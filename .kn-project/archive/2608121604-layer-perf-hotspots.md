# 2608121604 - layer-perf-hotspots

- Created: 2026-08-12 16:04 / Archived: 2026-08-12 17:10
- Issue: KNightING/camelot-nuxt-layer#23

## Summary

消除 layer 六處常駐輪詢與全域監聽的浪費，元件 API 與可見行為不變。最嚴重的一項是 PopupV2 的 rAF 迴圈：它自我遞迴且不保存 handle，popup 關閉時照跑、元件卸載後仍持續，每幀強制一次 `getBoundingClientRect()`；playground 單頁就有 19 個實例。其餘為 OverlayScrollbar 的全域捲動同步量測、虛擬捲動的 O(n²) 陣列複製、SelectV2 派發全域 `resize` 事件、四個元件的 `useElementBounding` 常駐監聽，以及 Scrollbar 未節流的捲動量測。影響範圍集中在浮層（PopupV2 及其衍生的 Select/Date/Time）、表格虛擬捲動與捲軸三類。

## Cross-Repo Scope

無（單一 repo）。

## Key Decisions

- **[Q1]** PopupV2 保留 rAF 輪詢，但僅於開啟期間執行、卸載時取消 — 理由：改動最小且開啟中的行為與現況完全一致，同時消除關閉空轉與卸載洩漏。
- **[Q2]** Input／ImageV2 的 window 位置監聽改為「開啟／顯示時才掛載」 — 理由：關閉狀態下的量測結果無任何讀取端，屬純浪費。
- **[Q3]** SelectV2 的 `itemHeight` 維持函式型傳入 — 理由：改傳數字會失去該 prop 的執行期響應，超出本次「不改行為」的範圍。
- **[Q4]** 驗證採 `pnpm lint` + `.playground` 手動走查 — 理由：本 repo 尚無測試框架設定。
- 節流一律採原生 `requestAnimationFrame` 合併，而非 `useThrottleFn` — 理由：需求是「每幀最多量測一次」，與畫面更新對齊；時間窗節流會在幀邊界產生額外或缺漏的量測。
- `useCamelotVirtual` 的 `offsets` 由 computed 改為一般函式 `readOffsets()`，各呼叫端自行讀 `sizesVersion` 建立相依 — 理由：computed 以 `Object.is` 比對新舊值，而增量快取重用同一個陣列參照，回傳相同參照會讓下游停止更新。
- PopupV2 移除只寫不讀的 `isTargetHovered` / `isPopupHovered` — 理由：改寫 hover 監聽時發現無任何讀取端，屬死碼。
- RippleEffect 一併移除 `useElCssVar('--ripple-size')`，改在 pointerdown 直接 `style.setProperty` — 理由：尺寸只有點擊當下需要，保留它等於多維持一組 ref 與兩個 watch。
- 對本次異動檔案套用 `eslint --fix`，連帶格式化同檔既有的解構寫法 — 理由：維持這些檔案在專案 lint 規則下乾淨；repo 其他既有錯誤不在本次範圍。

## Deviations

- 稽核清單原有 8 項，本計畫僅承接 1～6；第 7～8 項（`imports.dirs` 掃描範圍、`Icons({ autoInstall })`、表頭逐 cell `backdrop-blur`、DateRangeV2 的 deep watch）明列為非目標，留待後續計畫。
- 驗證環境限制：預覽分頁為 `visibilityState: hidden`，瀏覽器不發 rAF 與 scroll 事件，Scrollbar／OverlayScrollbar 的捲動路徑無法自動走查。改以「rAF 排程／取消次數」與一支臨時的虛擬捲動對照測試（對照 naive 前綴和，9 項全數 PASS，驗畢即刪）取得等效佐證，捲動手感由使用者於正常視窗確認。
- 發現但未處理：`RippleEffect.vue` 以 `id="container"` 標示根元素，多實例會產生重複 DOM id。屬 HTML 正確性問題而非效能，且修正需連動 scoped CSS，不在本次範圍。

## Impact Files

- `app/components/Camelot/PopupV2.vue` (`startTracking` / `stopTracking`) — rAF 追蹤改為僅開啟期間執行、卸載取消；`scrollParent` 與 hover 監聽改用 `useEventListener`，修掉未移除與重複疊加兩處洩漏；合併重複的 `open` watcher。
- `app/composables/useCamelotOverlayScrollbar.ts` (`scheduleMeasure`) — window 捲動／resize 與兩個 ResizeObserver 改走單一 pending frame 合併量測，scope dispose 時取消。
- `app/composables/useCamelotVirtual.ts` (`setSize` / `readOffsets`) — `sizes` 改為非響應式陣列 + `sizesVersion` 訊號，`setSize` O(1) 原地寫入並以 microtask 合併版本遞增；前綴和依 `dirtyFrom` 增量重算。對外簽章不變。
- `app/components/Camelot/Table.vue` (`measureRows`) — 以 `WeakSet` 記錄已 observe 的列，避免每次捲動重複 `observe`。
- `app/components/Camelot/SelectV2.vue` (`watch(open)`) — 移除每 100ms 派發全域 `resize` 的 interval，改為展開後 `scrollTo(0)`；`useVirtualList` 的範圍重算本就由 `useElementSize` 的 ResizeObserver 驅動，與 window `resize` 事件無關。
- `app/components/Camelot/RippleEffect.vue` (`onPointerDown`) — 移除 `useElementBounding` 與 `useElCssVar('--ripple-size')`，改於 pointerdown 量測一次並直接寫入 CSS 變數。
- `app/components/Camelot/Expanded.vue` — `useElementBounding` 關閉 `windowScroll` / `windowResize`（只需尺寸，由 ResizeObserver 涵蓋）。
- `app/components/Camelot/Input.vue` (`trackedWindowWhileOpen`) — 位置監聽改為展開期間才掛載。
- `app/components/Camelot/ImageV2.vue` (`trackedWindowWhileShown`) — 預覽浮層顯示期間才掛載位置監聽。
- `app/components/Camelot/Scrollbar.vue` (`scheduleUpdateScrollbar`) — 捲動量測 rAF 節流、`@scroll.passive`、`thumbStyle` 由 `reactive` 改為 `ref`。

## Details

驗證數據（`.playground`，Commit `89c5e22`）：19 個 PopupV2 實例閒置時 rAF 排程數為 0；開啟排程 1 次、關閉取消 1 次；浮層位置與觸發器對齊；hover 觸發開合正常；虛擬捲動對照測試 9/9 PASS；Ripple 24×24 → `--ripple-size` 67.88px、位置置中、650ms 後清除；異動檔案 lint 與 typecheck 皆乾淨。

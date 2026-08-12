<!-- REMINDER: Relative Paths Only! No file:///c:/... -->
# Plan: 2608121604 - layer-perf-hotspots

- Created: 2026-08-12
- Branch: fix/2608121604-layer-perf-hotspots
- Issue: KNightING/camelot-nuxt-layer#23
- Status: In Progress
- Completed: [Wait for Finish]

## Goals

修復 layer 效能稽核中確認的六個熱點，主軸是「消除常駐輪詢與全域監聽的浪費」，不改變任何對外 API 與可見行為。

1. **PopupV2 無限 rAF 迴圈**：卸載後仍持續執行、popup 關閉時也照跑的每幀 `getBoundingClientRect()`。
2. **OverlayScrollbar 全域 scroll 量測**：capture 階段監聽全頁捲動並同步量測，未節流。
3. **虛擬捲動 O(n²) 陣列複製**：`setSize` 每次複製整條 `sizes`，並使 O(n) 前綴和整條重算。
4. **SelectV2 派發全域 `resize` 事件**：開啟下拉時每 100ms 派發一次、持續 600ms，強迫全站 resize 監聽者重跑。
5. **`useElementBounding` 常駐監聽**：RippleEffect／Expanded／Input／ImageV2 在不需要時仍掛著 window scroll/resize 監聽。
6. **Scrollbar 捲動未節流**：每個 scroll 事件同步量測並寫入樣式。

**非目標**：不調整元件 API、不改視覺、不處理稽核清單第 7～8 項（`imports.dirs` 掃描範圍、backdrop-blur、deep watch 等）。

## Architecture

### 1. PopupV2 — rAF 生命週期收斂

`app/components/Camelot/PopupV2.vue:198` 的 `updateOnRequestAnimationFrame()` 自我遞迴且不保存 handle，`onMounted` 啟動後永不停止。改為：

- 以模組內變數保存 `rafId`，新增 `startTracking()` / `stopTracking()` 一對具名函式。
- 以 `watch(open, ...)`（`immediate`）驅動：`open === true` 才追蹤，關閉即 `cancelAnimationFrame`。
- `onBeforeUnmount` 一律 `stopTracking()`。
- 開啟當下先同步 `update()` 一次，避免首幀位置落後。

同檔另外兩處洩漏一併修：

- `PopupV2.vue:239` 的 `scrollParent` scroll 監聽從未移除 → 改用 `useEventListener`（`passive: true`），由 scope 自動回收。
- `PopupV2.vue:315` / `PopupV2.vue:337` 的 hover 監聽在 ref 變動時重複疊加（`targetListeners` / `popupListeners` 只增不減）→ 同樣改用 `useEventListener`（target 傳 getter，vueuse 會在目標變更時自動解掛舊的），並刪除兩個手動陣列與 `onBeforeUnmount` 內對應的清理碼。

### 2. OverlayScrollbar — rAF 合併量測

`app/composables/useCamelotOverlayScrollbar.ts:203` 的 `measure` 直接綁在 window `scroll`（capture）與 `resize`、以及兩個 `ResizeObserver` 上。改為新增 `scheduleMeasure()`：以單一 pending rAF 合併同一幀內的多次請求（已排程就直接返回），所有事件來源改呼叫 `scheduleMeasure`；`onMounted` 的首次量測與 `watch` 觸發維持直接呼叫 `measure`。元件卸載時取消 pending frame。

### 3. useCamelotVirtual / Table — O(1) 尺寸回報

`app/composables/useCamelotVirtual.ts:109` 的 `setSize` 每次 `slice()` 整條陣列，`app/composables/useCamelotVirtual.ts:47` 的 `offsets` 隨之整條重算；`app/components/Camelot/Table.vue:238` 會對每個可視列各呼叫一次。改為：

- `sizes` 改為非響應式的內部陣列 + `sizesVersion` 計數 ref 作為響應式訊號，`setSize` 原地寫入 → O(1)。
- 以 `dirtyFrom`（最小受影響索引）驅動前綴和的**增量重算**：`offsets` 只從 `dirtyFrom` 之後往後補，未變動的前段直接沿用快取。
- 同一幀內的多次 `setSize` 以 microtask 合併成一次版本遞增，避免逐列觸發重算。
- `Table.vue` 的 `measureRows` 以 `WeakSet` 記錄已納入 `ResizeObserver` 的列，避免每次捲動重複 `observe`；量測迴圈本身保留（`setSize` 已是 O(1)）。

外部介面（`setSize` / `visibleIndices` / `topPad` / `bottomPad` / `totalSize` / `scrollToIndex` / `readScroll`）簽章不變。

### 4. SelectV2 — 移除 `resize` 事件派發

`app/components/Camelot/SelectV2.vue:422` 的 interval 派發是為了讓 `useVirtualList` 在 popup 展開後重算範圍。經查 vueuse 14.4.0 的 `useVirtualList` 由 `useElementSize`（ResizeObserver）驅動 `calculateRange`（`useWatchForSizes`），**與 window `resize` 事件無關**，故該 interval 對它毫無作用，純粹是讓全站其他 resize 監聽者空轉。改為：開啟時 `nextTick` 後呼叫一次 `scrollTo(0)` 回到頂端，其餘交給 ResizeObserver。

### 5. useElementBounding 常駐成本

- `app/components/Camelot/RippleEffect.vue:19`：ripple 只在 `pointerdown` 當下需要容器矩形與對角線長度 → 移除 `useElementBounding`，改於事件中呼叫一次 `getBoundingClientRect()`，並就地換算 ripple 尺寸。此元件被 Material Button／Tabs／NumberCounter 使用，單頁可能數十個實例，收益最大。
- `app/components/Camelot/Expanded.vue:29`：僅對外提供 `contentHeight` / `contentWidth`，尺寸變化由 ResizeObserver 即可涵蓋 → 傳入 `{ windowScroll: false, windowResize: false }`。
- `app/components/Camelot/Input.vue:453`：`bottom` 僅供 `isBottom` 判斷下拉方向 → 關閉 window 監聽，改以 `useEventListener` 綁定「開啟時才存在」的目標（`() => isOpen.value ? window : null`），關閉即自動解掛。
- `app/components/Camelot/ImageV2.vue:111` / `:116`：預覽浮層為 `fixed` 定位、需要即時位置，但只有 `showFullImage` 為真時才需要 → 同樣以條件式目標掛載 window scroll / resize，未顯示時零監聽。

### 6. Scrollbar — rAF 節流

`app/components/Camelot/Scrollbar.vue:72` 的 `onScroll` 每事件同步量測 + 寫樣式。改為以 rAF 合併量測（與第 2 點同一手法），模板的 `@scroll` 加上 `.passive` 修飾。順帶把 `thumbStyle` 由 `reactive` 改為 `ref`，符合 code-style「一律只使用 ref」。

### 共通約束

- 全程遵守 `kn:project:code-style`：通用鐵則 + TypeScript + Nuxt/Vue 三層。
- 不新增相依套件；節流一律用原生 rAF（本案需要的是「每幀最多一次」，`useThrottleFn` 的時間窗語意不合）。
- 註解一律置於程式碼上一行，說明「為什麼」。

## Cross-Repo Scope

- **本計畫所屬 repo**: `camelot-nuxt-layer`
- **共用計畫 ID**: `2608121604-layer-perf-hotspots`　**共用分支名**: `fix/2608121604-layer-perf-hotspots`
- **參與 repo 與職責**: 無（單一 repo）
- **執行順序相依**: 無（單一 repo）
- **跨 repo 檔案指涉**: 無

## Impact Files

- `app/components/Camelot/PopupV2.vue:198` (`updateOnRequestAnimationFrame`) — 無限 rAF 迴圈未取消；同檔 `:239` scroll 監聽未移除、`:315`/`:337` hover 監聽重複疊加。
- `app/composables/useCamelotOverlayScrollbar.ts:203` (`useEventListener(window, 'scroll', measure, { capture: true })`) — 全域捲動同步量測，需 rAF 合併。
- `app/composables/useCamelotVirtual.ts:109` (`setSize`)、`:47` (`offsets`) — 每次回報尺寸複製整條陣列並重算整條前綴和。
- `app/components/Camelot/Table.vue:238` (`measureRows`) — 每次捲動對所有可視列重複 `observe`。
- `app/components/Camelot/SelectV2.vue:422` (`watch(open)`) — 以 `setInterval` 派發全域 `resize` 事件。
- `app/components/Camelot/RippleEffect.vue:19` (`useElementBounding`) — 常駐監聽僅為取得 pointerdown 當下的矩形。
- `app/components/Camelot/Expanded.vue:29` (`useElementBounding`) — 只需尺寸，不需 window 監聽。
- `app/components/Camelot/Input.vue:453` (`useElementBounding`) — `bottom` 僅供方向判斷，可改為開啟時才監聽。
- `app/components/Camelot/ImageV2.vue:111` (`useElementBounding`) — 預覽浮層顯示時才需要位置追蹤。
- `app/components/Camelot/Scrollbar.vue:72` (`onScroll`) — 每事件同步量測，需 rAF 節流。

## Open Questions / 待確認事項

> 尚未確認、會影響實作方向的行為或決策。**全部釐清前不得進入 Phase 3。**

### Q1. PopupV2 位置追蹤策略 — 影響範圍：`app/components/Camelot/PopupV2.vue`

- [x] 選項 A：保留 rAF 輪詢，但**僅在 `open === true` 期間執行**，卸載時取消　(建議，理由：改動最小、行為與現況在「開啟中」完全一致，且已消除「關閉時空轉」與「卸載後洩漏」兩項成本)
- [ ] 選項 B：完全移除輪詢，改以 `ResizeObserver` + scroll/resize 事件驅動（零輪詢，但目標因 CSS 動畫位移時可能跟不上）
- [ ] 選項 C：其他，請補充
- **決議**：選項 A　狀態：✅ 已確認

### Q2. Input / ImageV2 的位置監聽改為「僅在開啟／顯示時掛載」 — 影響範圍：`Input.vue`、`ImageV2.vue`

未開啟時不再追蹤位置。因為兩者的位置值只在開啟／顯示時被讀取，行為應等價。

- [x] 是　(建議，理由：關閉狀態下的量測結果無人使用，屬純浪費)
- [ ] 否，維持常駐監聽（僅改 RippleEffect 與 Expanded）
- **決議**：是　狀態：✅ 已確認

### Q3. SelectV2 的 `itemHeight` 傳法 — 影響範圍：`app/components/Camelot/SelectV2.vue:398`

目前傳 `() => props.itemHeight`（函式型），vueuse 會以 `reduce` 逐項累加算總高與位移，複雜度 O(n)；傳數字則為 O(1)。

- [x] 選項 A：維持函式型，本次不動　(建議，理由：改為數字會失去對 `itemHeight` prop 變動的響應，超出本次「不改行為」的範圍；選項清單通常不長，收益有限)
- [ ] 選項 B：改傳 `props.itemHeight` 數字，換取 O(1)（放棄該 prop 的執行期響應）
- **決議**：選項 A　狀態：✅ 已確認

### Q4. 驗證方式 — 影響範圍：Phase 4

- [x] 選項 A：`pnpm lint` + `.playground` 手動走查（Select／Date／Table／Ripple／Scrollbar 各操作一輪，並以 DevTools 確認 rAF 迴圈已停）　(建議，理由：本 repo 無測試框架設定，playground 是既有的驗證途徑)
- [ ] 選項 B：另外補寫自動化測試（`vitest` 已在 devDependencies 但專案尚無測試檔）
- **決議**：選項 A　狀態：✅ 已確認

## Key Decisions

- **[Q1]** PopupV2 保留 rAF 輪詢，但僅於開啟期間執行、卸載時取消 — 理由：改動最小且開啟中的行為與現況完全一致，同時消除關閉空轉與卸載洩漏。
- **[Q2]** Input／ImageV2 的 window 位置監聽改為「開啟／顯示時才掛載」 — 理由：關閉狀態下的量測結果無任何讀取端，屬純浪費。
- **[Q3]** SelectV2 的 `itemHeight` 維持函式型傳入 — 理由：改傳數字會失去該 prop 的執行期響應，超出本次「不改行為」的範圍。
- **[Q4]** 驗證採 `pnpm lint` + `.playground` 手動走查 — 理由：本 repo 尚無測試框架設定，playground 是既有驗證途徑。
- **[執行中]** 節流一律採原生 `requestAnimationFrame` 合併，而非 `useThrottleFn` — 理由：需求是「每幀最多量測一次」，與畫面更新對齊；時間窗節流會在幀邊界產生額外或缺漏的量測。
- **[執行中]** `useCamelotVirtual` 的 `offsets` 由 computed 改為一般函式 `readOffsets()`，各呼叫端自行讀 `sizesVersion` 建立相依 — 理由：computed 以 `Object.is` 比對新舊值，而增量快取重用同一個陣列參照，回傳相同參照會讓下游停止更新。
- **[執行中]** PopupV2 移除只寫不讀的 `isTargetHovered` / `isPopupHovered` 兩個 ref — 理由：改寫 hover 監聽時發現它們無任何讀取端，屬死碼（code-style 第 10 條）。
- **[執行中]** RippleEffect 一併移除 `useElCssVar('--ripple-size')`，改在 pointerdown 直接 `style.setProperty` — 理由：尺寸只有點擊當下需要，保留 useElCssVar 等於為此多維持一組 ref 與兩個 watch。
- **[執行中]** 對本次異動的檔案套用 `eslint --fix`，其中連帶格式化了同檔既有的解構寫法 — 理由：維持這些檔案在專案 lint 規則下乾淨；repo 其他既有錯誤不在本次範圍內處理。
- **[執行中]** 驗證環境限制：預覽分頁為 `visibilityState: hidden`，瀏覽器不發 rAF 與 scroll 事件，故 Scrollbar／OverlayScrollbar 的捲動路徑無法就地觀察 — 已改以「rAF 排程／取消次數」與獨立的虛擬捲動對照測試取得等效佐證。

## Git Completion Policy

- Issue 綁定時，PR body 必須含 `Closes #${N}`，歸檔完成後於該 issue 張貼由 archive 蒸餾的結案留言 (Rule 20)。
- 經核准的 Commit 後，完成階段會執行 `git rebase main` 與 `git push --force-with-lease --force-if-includes`（會重寫遠端工作分支歷史）。
- PR/archive order: Archive automatically triggered on PR request。
- 跨 repo：不適用（單一 repo）。

## References

- `.kn-project/wiki/components/PopupV2.md` — 現況行為描述（含「透過 requestAnimationFrame 持續更新目標位置」）
- `.kn-project/wiki/composables/useCamelotVirtual.md` — 現況簽章與備註
- `.kn-project/archive/2607081704-overlay-scrollbar-component.md` — OverlayScrollbar 的設計來源
- `node_modules/@vueuse/core` v14.4.0 `useVirtualList` / `useWatchForSizes` — 佐證第 4 點「window resize 與其無關」

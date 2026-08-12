# Tasks for 2608121604

## Phase 0 — 調查
- [x] 稽核 layer 效能熱點並取得 `path:line` 佐證
- [x] 確認 `useVirtualList` 由 ResizeObserver 驅動（SelectV2 的 resize 派發無效）

## Phase 3 — 執行
- [x] 1. PopupV2：rAF 追蹤僅在開啟期間執行、卸載取消；scroll／hover 監聽改用 `useEventListener`
- [x] 2. useCamelotOverlayScrollbar：`scheduleMeasure()` 以 rAF 合併量測
- [x] 3. useCamelotVirtual：`setSize` O(1) + 前綴和增量重算；Table `measureRows` 避免重複 observe
- [x] 4. SelectV2：移除全域 `resize` 派發 interval
- [x] 5. useElementBounding 常駐成本：RippleEffect（移除）／Expanded（關閉 window 監聽）／Input、ImageV2（條件式監聽）
- [x] 6. Scrollbar：rAF 節流 + `@scroll.passive` + `thumbStyle` 改用 `ref`

## Phase 4 — 驗證
- [x] `pnpm lint`：本次異動的 10 個檔案全數乾淨（repo 其他既有檔案的既存錯誤未處理）
- [x] `nuxi typecheck`：本次異動檔案無錯誤（僅 `.nuxt/types/imports.d.ts` 產生碼的既有錯誤）
- [x] `.playground` 走查：
  - [x] 19 個 PopupV2 實例閒置時 rAF 排程數為 0；開啟時排程 1 次、關閉時取消 1 次
  - [x] Popup 開啟位置與觸發器對齊（y=504 對 y=504）；hover 觸發模式開合正常
  - [x] useCamelotVirtual 對照 naive 前綴和的 9 項檢查全數 PASS（含 setSize、前段改寫、縮短、加長、scrollToIndex）
  - [x] Ripple 尺寸／位置／清除正確（24×24 → `--ripple-size` 67.88px）
  - [x] 無新增 console error
  - [ ] 捲動事件驅動的兩處（Scrollbar thumb、OverlayScrollbar measure）無法在此環境觀察：預覽分頁為 hidden，瀏覽器不發 rAF 與 scroll 事件。掛載時的量測為同步呼叫，不受影響。

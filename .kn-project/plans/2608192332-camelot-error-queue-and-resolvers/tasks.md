# Tasks for 2608192332

## Phase 1 — Composable 主體
- [x] 建立 `app/composables/useCamelotError.ts`：`CamelotErrorType<TData>`、`CamelotErrorLevel`、`CamelotErrorResolver<TData>`
- [x] 實作模組層 resolver 註冊表與 `registerErrorResolver()` / unregister
- [x] 實作模組層 interceptor 註冊表與 `registerErrorInterceptor()` / unregister
- [x] 實作內建通用轉換器（FetchError / Error / string，優先權最低）
- [x] 實作佇列 API：`errors` / `currentError` / `push` / `handle` / `dismiss` / `clear` / `watch`
- [x] `handle()` 串起 resolve → intercept → enqueue 管線

## Phase 2 — 顯示層（相依於 Phase 1 的 `currentError`）
- [x] 建立 `app/components/Camelot/ErrorDialog.vue`，複用 `CamelotConfirmDialog`
- [x] 接線 `dismiss()` 與 `onConfirm`，確認佇列可自動接續下一筆

## Phase 3 — 驗證
- [x] `.playground/app/pages/index.vue` 新增示範：一次推入多筆錯誤、註冊自訂轉換器、401 攔截情境
- [x] 執行 lint（`pnpm lint`）與型別檢查
- [x] 於 playground 實際驗證逐一顯示行為

## Phase 4 — Iteration 1：呼叫端控制 confirm 與多按鈕
- [x] `CamelotErrorAction` 型別，`CamelotErrorType` 追加 positive / neutral / negative
- [x] `CamelotErrorOptions` 追加 `onConfirm` 與三個動作覆寫，`push` / `handle` / `watch` 共用
- [x] `dismiss()` 依串接順序執行 onConfirm
- [x] `ErrorDialog.vue` 綁定三個動作槽，處理 `close: false`
- [x] playground 新增「重試 / 關閉」與 page 端 onConfirm 示範
- [x] lint 維持基準、瀏覽器實測

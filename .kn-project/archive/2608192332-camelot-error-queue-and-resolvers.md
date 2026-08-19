# 2608192332 - camelot-error-queue-and-resolvers

- Created: 2026-08-19 23:32 / Archived: 2026-08-20 00:58
- Issue: KNightING/camelot-nuxt-layer#29

## Summary
新增 `useCamelotError`，為 Layer 補上可累積多筆錯誤並逐一顯示的全域錯誤分發機制，並把錯誤格式的辨識邏輯外移成可註冊的轉換器。

動機是既有做法（他專案的 `useAppError`）把 401/400、後端自訂 JSON 等格式判斷硬寫在 composable 內，換一套 API 就得改動共用程式碼。本計畫把管線拆成三段——`handle(raw)` → **resolve**（轉換器鏈，純轉換）→ **intercept**（攔截器鏈，副作用與可攔截不入列）→ **enqueue**——Layer 只內建 `FetchError` / `Error` / `string` 三個無業務語意的通用轉換器，401 導登入這類行為一律由消費端註冊。顯示層 `CamelotErrorDialog` 複用既有的 `CamelotConfirmDialog`，支援 positive / neutral / negative 三顆動作按鈕（例如「重試 / 關閉」），`close: false` 可讓呼叫端自行控制關閉時機。影響範圍限於 `app/composables/`、`app/components/Camelot/` 與 playground。

## Cross-Repo Scope
無（單一 repo）。

## Key Decisions
- Nuxt 內建 `useError` 不採用，改走 `useCamelotError` — `useError` 只承載單一 `NuxtError`、`showError` 會切換到錯誤頁，與「多筆累積、非致命、逐一提示」的需求本質衝突。兩者互補：致命錯誤仍歸 Nuxt 錯誤頁。
- 一併實作 `CamelotErrorDialog.vue` — 沒有顯示層無法驗收「逐一顯示」核心需求。
- 內建 `FetchError` / `Error` / `string` 三個通用轉換器，優先權 -100 — 開箱可用且不含業務語意，最低優先權確保消費端永遠可覆蓋。
- 佇列不去重，另提供 `only` 選項 — 與 `useCamelotToast` 的 `options.only` API 一致；去重規則因專案而異，不由 Layer 決定。
- 型別隨 composable 定義於 `useCamelotError.ts` — 比照最相近的既有案例 `useCamelotToast.ts:69-96`。
- 新增與轉換器分離的攔截器（interceptor）階段 — resolver 若兼做副作用，「只想轉格式」的情境會意外觸發清權限／導頁；分兩段後職責單一，且 interceptor 回傳 `true` 可支援靜默處理。同時解掉參考專案 `useAppError` 中 `setTimeout(..., 1000)` 的時序 hack。
- 多按鈕沿用 ConfirmDialog 既有的 positive / neutral / negative 三角色 — 對映既有按鈕槽與排列順序，與 `CamelotConfirmAction` 詞彙一致，不必自行處理排版。
- 呼叫端與錯誤自帶的 `onConfirm` 採串接，呼叫端先跑 — 攔截器掛的多為導頁這類終結性動作，排最後才不會讓呼叫端邏輯被跳過。動作按鈕則為覆寫，因為 page 比轉換器更貼近當下情境。
- `CamelotErrorDialog` 的關閉路徑統一收斂到 `open` 的 computed setter，不另接 `@cancel` — `BaseDialogV2.vue:116-118,203-206` 的遮罩／ESC 關閉一律會先寫回 open model，再接 cancel 會造成重複 `dismiss()`，把佇列中的下一則一併吃掉。同理 `:auto-close="false"`，改由 `@positive` 單一路徑觸發。
- 內建 FetchError 轉換器採 duck-typing（檢查 `statusCode` 欄位）而非 `instanceof FetchError` — 避免 ofetch 跨 bundle 多實例時誤判，也免去在 Layer 引入執行期相依。
- 轉換器與攔截器註冊表採模組層單例而非 `useState` — 兩者都是函式，無法通過 SSR 序列化。
- playground 的重試示範改為「自行 dismiss → loading 3 秒 → 重新入列」的真實失敗循環 — 原本只跳 toast，無法展示 `close: false`（呼叫端自行控制關閉時機）的真正用途。

## Deviations
- 原計畫的 `## Impact Files` 列了 `components.d.ts`，實際不需異動：該檔只收 unplugin-icons 產生的 icon 元件，Camelot 元件的型別由 Nuxt 產在 `.nuxt/`。
- 計畫核准後追加兩次 Iteration（皆經核准）：Iteration 1 補上多動作按鈕與呼叫端的 confirm 控制（Q6/Q7）；Iteration 2 把 playground 的重試示範改為真實的非同步失敗循環。
- 驗證過程一度誤判 `CamelotLoading` 的 fade leave transition 卡住不消失。實為背景分頁沒有 rAF 導致 Vue transition 不推進，分頁喚醒後即正常移除，非 Layer 缺陷，未做任何修改。

## Impact Files
- `app/composables/useCamelotError.ts` (new) — 型別（`CamelotErrorType<TData>` / `CamelotErrorLevel` / `CamelotErrorAction` / `CamelotErrorResolver` / `CamelotErrorInterceptor`）、模組層註冊表與排序快取、佇列 API（`push` / `handle` / `dismiss` / `runAction` / `clear` / `watch`）。
- `app/components/Camelot/ErrorDialog.vue` (new) — 顯示層，逐一呈現 `currentError` 並綁定三個動作槽。
- `app/components/Camelot/ConfirmDialog.vue:32-55` — 未修改，ErrorDialog 直接複用其三個按鈕槽與排列規則。
- `app/components/Camelot/BaseDialogV2.vue:116-118,203-206` — 未修改，其「關閉時先寫回 open model 再 emit cancel」的行為決定了 ErrorDialog 的關閉路徑設計。
- `app/composables/useCamelotToast.ts:1-7,16` — 未修改，lazy 單例 + `useState` 佇列的樣板來源。
- `app/composables/useErrorRef.ts:9-19` — 未修改，`watch(errorRefs)` 的樣板來源。
- `app/composables/useBaseApi.ts:116-128` — 未修改，可自動回復的 401 由此處的 `autoRefreshToken` / `refreshTokenHandler` 就地刷新重送，不會進入本機制。
- `.playground/app/app.vue` — 掛載 `<CamelotErrorDialog />`。
- `.playground/app/pages/index.vue` — 新增 Global Error Queue 示範卡片（多筆累積、自訂 API 格式、401 三段式、重試／關閉、page 端 onConfirm）。

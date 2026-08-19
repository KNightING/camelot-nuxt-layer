<!-- REMINDER: Relative Paths Only! No file:///c:/... -->
# Plan: 2608192332 - Camelot Error Queue and Resolvers
- Created: 2026-08-19
- Branch: feature/2608192332-camelot-error-queue-and-resolvers
- Issue: KNightING/camelot-nuxt-layer#29
- Status: In Progress
- Completed: [Wait for Finish]

## Goals
在 Layer 中新增 `useCamelotError`，作為全域錯誤的統一分發點，解決既有 `useAppError`（他專案）的兩個痛點：

1. **可累積多筆錯誤、逐一顯示**（沿用 `useAppError` 的優點，但改為真正的佇列，而非單一 `currentError` 被後來者覆蓋）。
2. **辨識/轉換邏輯外移**（修正 `useAppError` 的缺點——`handleError` 內硬寫 `statusCode === 401/400`、`isErrorResponse(error.data)` 等專案專屬格式判斷）。
   - `useCamelotError` 的入口 **只接受 `CamelotErrorType`**（型別強制），任何原始錯誤（`FetchError`、後端自訂 JSON、第三方 SDK 錯誤）都必須先經由**已註冊的轉換器（resolver）**轉成 `CamelotErrorType`。
   - 轉換器可註冊 **N 個**，未來遇到新的 API 錯誤格式時，只需在消費端註冊一個新轉換器，**不需要修改 Layer**。
3. `CamelotErrorType<TData>` 支援**泛型 data**，讓轉換器可把原始 payload 帶進錯誤物件，供顯示層或後續流程取用。

### 附帶結論：Nuxt 內建 `useError` 不適用
使用者提出「不確定 Nuxt 本身的 `useError` 是否可做到」。結論為**不行**，仍走 `useCamelotError`，理由三點：

| 項目 | Nuxt `useError` | 本計畫需求 |
| :--- | :--- | :--- |
| 承載量 | 單一 `NuxtError`（內部即 `useState('error')`），新錯誤直接覆蓋舊的 | 需要**佇列**，多筆累積逐一顯示 |
| 語意 | 為「致命錯誤」設計；`showError()` 會中止當前頁面渲染並切換到 `error.vue` | 需要的是**非致命的提示型錯誤**，頁面必須留在原地 |
| 型別 | 固定為 `NuxtError`（`statusCode` / `statusMessage` / `data`），無轉換器機制 | 需要自訂 `CamelotErrorType<TData>` 與可插拔轉換器 |

因此 `useCamelotError` 與 Nuxt `useError` 是**互補**而非取代：前者處理「可回復、可逐一提示」的錯誤，後者維持處理致命錯誤與錯誤頁。

## Architecture

### 1. 型別（隨 composable 檔案定義，比照 `useCamelotToast` 既有慣例）
```ts
/** Camelot 錯誤的嚴重程度；影響顯示層的色彩角色 */
export type CamelotErrorLevel = 'error' | 'warning' | 'info'

/**
 * Camelot 統一錯誤模型。TData 為原始 payload 的型別，
 * 由轉換器決定要帶什麼進來（例如後端的 ErrorResponse）。
 */
export interface CamelotErrorType<TData = unknown> {
  id?: string
  title?: string
  message?: string
  /** 需要富文字時使用；與 message 二擇一，顯示層需自行確保來源可信 */
  messageHtml?: string
  /** 錯誤代碼；HTTP status 或後端自訂代碼 */
  code?: string | number
  level?: CamelotErrorLevel
  /** 轉換器帶入的原始資料 */
  data?: TData
  /** 使用者關閉此錯誤後執行 */
  onConfirm?: () => void
  zIndex?: number
}
```

### 2. 轉換器（Resolver）機制
```ts
export interface CamelotErrorResolver<TData = unknown> {
  /** 供除錯與 unregister 辨識，同名視為覆蓋 */
  name: string
  /** 數字大者先試；未指定為 0 */
  priority?: number
  /** 回傳 undefined 代表「我處理不了，交給下一個」 */
  resolve: (raw: unknown) => CamelotErrorType<TData> | undefined
}
```
- 註冊表為**模組層單例**（`Map<string, CamelotErrorResolver>`），因為 resolver 是函式、無法進 `useState` 序列化。
- 消費端於 plugin（`app/plugins/*.client.ts` 或 `defineNuxtPlugin`）呼叫 `registerErrorResolver()` 完成註冊；回傳 unregister 函式。
- 解析流程：依 priority 由高到低逐一呼叫 `resolve`，**第一個回傳非 undefined 者勝出**（guard clause，早退）。
- 全部落空時回傳一個保底的 `CamelotErrorType`（`level: 'error'`、`data` 掛原始物件），確保不會靜默吞錯（universal rule 7）。

### 2b. 攔截器（Interceptor）—— 401 這類「要做別的事」的場景
轉換器只負責**純轉換**（`unknown` → `CamelotErrorType`），副作用不該混進去。因此在「轉換完成」與「入列」之間插入第二段可註冊的階段：

```ts
export interface CamelotErrorInterceptor<TData = unknown> {
  /** 供除錯與 unregister 辨識，同名視為覆蓋 */
  name: string
  /** 數字大者先跑；未指定為 0 */
  priority?: number
  /**
   * 對已轉換的錯誤做副作用（清權限、記 log、導頁…）。
   * 回傳 true 代表「我已完全處理」，該錯誤不入列、不顯示 dialog。
   */
  intercept: (error: CamelotErrorType<TData>) => boolean | void
}
```

完整管線：`handle(raw)` → **resolve**（轉換器鏈，第一個命中者勝出）→ **intercept**（攔截器鏈，依序全跑，任一回傳 `true` 即中止並不入列）→ **enqueue** → `currentError` → dialog → 使用者確認 → `dismiss()` 觸發 `onConfirm`。

#### 401 的建議寫法（消費端，Layer 不預設任何業務語意）
```ts
// plugins/camelotError.ts —— 消費端專案，非 Layer
export default defineNuxtPlugin(() => {
  const { registerErrorResolver, registerErrorInterceptor } = useCamelotError()

  // Step 1. 轉換：把後端的 401 轉成統一模型（純轉換，無副作用）
  registerErrorResolver({
    name: 'unauthorized',
    priority: 100,
    resolve: (raw) => {
      if (!isFetchError(raw) || raw.statusCode !== 401) return undefined
      return { code: 401, message: '登入逾期，請重新登入', data: raw.data }
    },
  })

  // Step 2. 攔截：清權限（立即），並把導頁掛在 onConfirm（dialog 關閉後才跑）
  registerErrorInterceptor({
    name: 'unauthorized',
    intercept: (error) => {
      if (error.code !== 401) return
      useAuthStore().clear()
      error.onConfirm = () => navigateTo('/login')
    },
  })
})
```
三個需求各自落在管線的一段：**清除權限** 在 intercept、**跳出 dialog** 由入列後的 `CamelotErrorDialog` 負責、**確認後回登入** 在 `onConfirm`。若某種 401 想靜默處理（不彈窗），intercept 回傳 `true` 即可。

> **與 `useBaseApi` 的分工**：可自動回復的 401 應優先由 `app/composables/useBaseApi.ts:116-128`（`autoRefreshToken` / `refreshTokenHandler` / `shouldRefreshToken`）在 API 層就地刷新並重送，根本不會走到 `useCamelotError`。本管線處理的是**刷新也失敗、已無法回復**的 401。

### 3. 佇列與 API
狀態以 `useState<CamelotErrorType[]>('Camelot:Errors', () => [])` 承載（SSR-safe，比照 `app/composables/useCamelotToast.ts:16`），composable 本身為 lazy 單例（比照 `useCamelotToast.ts:1-7`）。

| API | 說明 |
| :--- | :--- |
| `errors` | 佇列本體（唯讀取用） |
| `currentError` | `computed` 取佇列第一筆，供顯示層一次顯示一則 |
| `push(error: CamelotErrorType)` | **只接受 `CamelotErrorType`**；補 id 後入列 |
| `handle(raw: unknown)` | 跑轉換器鏈 → `push`；這是接原始錯誤的唯一入口 |
| `dismiss(id?)` | 移除指定（預設當前）錯誤並觸發其 `onConfirm` |
| `clear()` | 清空佇列 |
| `registerErrorResolver(r)` | 註冊轉換器，回傳 unregister 函式 |
| `registerErrorInterceptor(i)` | 註冊攔截器，回傳 unregister 函式 |
| `watch(errors)` | 監看 `useFetch` 回傳的 `error` ref（單個或陣列），非 null 即 `handle`；沿用 `useAppError` 的便利性，實作比照 `app/composables/useErrorRef.ts:9-19` |

### 4. 內建轉換器
Layer 內建 **通用**轉換器（非專案專屬），確保開箱可用：
- `ofetch` 的 `FetchError` → `code = statusCode`、`message = statusMessage ?? message`、`data = error.data`
- 原生 `Error` → `message = error.message`
- `string` → `message`

專案專屬格式（如 `{ error: '...' }`、401 導向登入）**一律由消費端註冊 resolver**，Layer 不預設任何業務語意——這正是本計畫要修正的 `useAppError` 缺點。

### 5. 顯示元件
新增 `CamelotErrorDialog.vue`，包一層既有的 `CamelotConfirmDialog`（`app/components/Camelot/ConfirmDialog.vue:1`），監看 `currentError` 開關；關閉即 `dismiss()`，佇列若還有下一筆則自動接續顯示。文字（標題／按鈕）以 props 傳入預設值，**不在 Layer 內硬綁 i18n 詞條**——Layer 的 `nuxt.config.ts` 宣告 `locales: []`、語系全由消費端註冊（見 `.kn-project/wiki/features/i18n-locales.md`）。

### 6. 迭代：呼叫端控制 confirm 與多按鈕（Iteration 1）
原設計中 `onConfirm` 只能由轉換器／攔截器掛上，觸發錯誤的 page 無法就地決定「按下確認後要做什麼」；且對話框固定只有一顆確認鈕，無法表達「重試 / 關閉」這類雙動作。本次迭代補上兩者。

#### 6.1 動作按鈕（沿用 ConfirmDialog 既有的三角色）
`CamelotConfirmDialog` 已提供 positive / neutral / negative 三個按鈕槽與固定的排列順序（`ConfirmDialog.vue:32-55`），直接沿用其詞彙，不另發明陣列結構：

```ts
export interface CamelotErrorAction {
  label: string
  color?: CamelotColorRole
  /** 執行 handler 後是否關閉此錯誤；未指定為 true */
  close?: boolean
  handler?: () => void
}
```
`CamelotErrorType` 增加 `positive?` / `neutral?` / `negative?` 三個選用欄位。未指定 `positive` 時，對話框沿用 props 的預設確認鈕（維持既有行為，不破壞既有呼叫端）。

「重試 / 關閉」即：`positive: { label: '重試', handler: retry, close: false }`、`negative: { label: '關閉' }`。

#### 6.2 呼叫端補掛回呼
`CamelotErrorOptions` 增加 `onConfirm` 與三個動作覆寫，`push` / `handle` / `watch` 三個入口共用同一組選項：

```ts
export interface CamelotErrorOptions {
  only?: boolean
  onConfirm?: () => void
  positive?: CamelotErrorAction
  neutral?: CamelotErrorAction
  negative?: CamelotErrorAction
}
```
- 動作欄位為**覆寫**：呼叫端指定即蓋掉轉換器產出的同名動作（page 比轉換器更貼近當下情境）。
- `onConfirm` 為**串接**而非覆寫：**呼叫端的先跑，錯誤自帶的（攔截器掛上的系統級行為，例如導向登入）後跑**。理由是導頁屬於終結性動作，一旦執行後續邏輯就沒有意義，必須排在最後。

## Cross-Repo Scope
無（單一 repo）。

## Impact Files
- `app/composables/useCamelotError.ts` (new) — 本計畫主體：型別、轉換器註冊表、佇列與 API。
- `app/components/Camelot/ErrorDialog.vue` (new) — 顯示層，逐一呈現 `currentError`。
- `app/composables/useCamelotToast.ts:1-7,16` (`useCamelotToast` / `toastState`) — **不修改**，作為 lazy 單例 + `useState` 佇列的既有樣板參照。
- `app/composables/useErrorRef.ts:9-19` (`watchToggle` / `watcher`) — **不修改**，作為 `watch(errors)` 的既有樣板參照。
- `app/components/Camelot/ConfirmDialog.vue:1-58` — **不修改**，ErrorDialog 直接複用它（DRY，universal rule 2）。
- `app/composables/useCamelotError.ts`（Iteration 1）— 追加 `CamelotErrorAction`、`CamelotErrorType` 的三個動作欄位、`CamelotErrorOptions` 的 `onConfirm` 與動作覆寫。
- `app/components/Camelot/ErrorDialog.vue`（Iteration 1）— 綁定三個動作槽至 `CamelotConfirmDialog`（`ConfirmDialog.vue:32-55`）。
- `.playground/app/pages/index.vue` — 新增示範區塊，驗證佇列累積、逐一顯示與自訂轉換器。
- `components.d.ts` — 元件型別宣告檔，新增元件後需同步（由 Nuxt 產生／檢查）。

## Open Questions / 待確認事項

### Q1. 是否一併實作顯示元件 `CamelotErrorDialog.vue`？ — 影響範圍：`app/components/Camelot/ErrorDialog.vue`、`.playground`
- [x] A：一併實作（包 `CamelotConfirmDialog`）＋ playground demo　(建議，理由：`useCamelotError` 若沒有顯示層就無法驗收「逐一顯示」這個核心需求；且參考專案本來就是 composable + Dialog 成對)
- [ ] B：本次只做 composable，顯示層由消費端自行實作
- **決議**：A　狀態：✅ 已確認

### Q2. 內建轉換器要不要預設註冊？ — 影響範圍：`app/composables/useCamelotError.ts`
- [x] A：預設註冊 `FetchError` / `Error` / `string` 三個通用轉換器，優先權最低（-100），消費端註冊的一律先試　(建議，理由：開箱可用且不含任何業務語意；優先權最低確保消費端永遠能覆蓋)
- [ ] B：完全不預設，`handle()` 未命中就走保底物件
- **決議**：A　狀態：✅ 已確認

### Q3. 佇列的重複錯誤處理？ — 影響範圍：`app/composables/useCamelotError.ts`
- [x] A：不去重，全部累積（可另提供 `push(error, { only: true })` 先清空，比照 `useCamelotToast` 的 `options.only`）　(建議，理由：與既有 toast API 一致，且去重規則因專案而異，不該由 Layer 決定)
- [ ] B：以 `code + message` 自動去重
- **決議**：A　狀態：✅ 已確認

### Q4. 型別要放哪裡？ — 影響範圍：`app/composables/useCamelotError.ts` / `shared/types/`
- [x] A：隨 composable 定義於 `app/composables/useCamelotError.ts`　(建議，理由：比照最相近的既有案例 `useCamelotToast.ts:69-96`，型別與其唯一擁有者同檔)
- [ ] B：獨立為 `shared/types/camelotError.ts`
- **決議**：A　狀態：✅ 已確認

### Q5. 401 這類「要攔截做別的事」的機制 — 影響範圍：`app/composables/useCamelotError.ts`
> 需求：清除權限 → 跳出錯誤 dialog → 確認後回登入。

- [x] A：新增**攔截器（interceptor）**階段，與轉換器分離（詳見 `## Architecture` §2b）；轉換器保持純轉換，副作用與「可攔截不入列」由 interceptor 負責　(建議，理由：轉換器若兼做副作用，同一個 resolver 會在「只是想轉格式」的情境下產生非預期的清權限／導頁；分兩段後每段職責單一，且 interceptor 回傳 `true` 可支援靜默處理)
- [ ] B：不加新階段，副作用直接寫在 resolver 的 `resolve()` 內，導頁掛 `onConfirm`（API 較小，但 resolver 不純）
- [ ] C：不加新階段，改由消費端自己在呼叫 `handle()` 前後處理（Layer 完全不介入）
- **決議**：A　狀態：✅ 已確認


### Q6. 多按鈕的表達方式 — 影響範圍：`app/composables/useCamelotError.ts`、`app/components/Camelot/ErrorDialog.vue`
- [x] A：沿用 `CamelotConfirmDialog` 既有的 positive / neutral / negative 三角色　(建議，理由：與 Layer 既有詞彙 `CamelotConfirmAction` 一致，直接對映既有的按鈕槽與排列順序，不必自行處理排版；上限三顆對錯誤對話框足夠)
- [ ] B：`actions: CamelotErrorAction[]` 陣列，數量不限（需自行決定排列與樣式，且與既有 ConfirmDialog 詞彙脫節）
- **決議**：A　狀態：✅ 已確認

### Q7. 呼叫端的 `onConfirm` 與錯誤自帶的 `onConfirm` 衝突時 — 影響範圍：`app/composables/useCamelotError.ts`
- [x] A：串接，**呼叫端先跑、錯誤自帶的後跑**　(建議，理由：攔截器掛的通常是導頁這類終結性動作，排最後才不會讓呼叫端的邏輯被跳過)
- [ ] B：呼叫端覆寫錯誤自帶的（攔截器掛的導頁會被靜默吃掉）
- [ ] C：錯誤自帶的優先，呼叫端的忽略
- **決議**：A　狀態：✅ 已確認


## Key Decisions
- **[規劃]** Nuxt 內建 `useError` 不採用，改走 `useCamelotError` — 理由：`useError` 只承載單一 `NuxtError`、`showError` 會切換到錯誤頁，與「多筆累積、非致命、逐一提示」的需求本質衝突（見 `## Goals`）。
- **[Q1]** 一併實作 `CamelotErrorDialog.vue` — 理由：沒有顯示層無法驗收「逐一顯示」核心需求。
- **[Q2]** 內建 `FetchError` / `Error` / `string` 三個通用轉換器，優先權 -100 — 理由：開箱可用且不含業務語意，最低優先權確保消費端永遠可覆蓋。
- **[Q3]** 佇列不去重，另提供 `only` 選項 — 理由：與 `useCamelotToast` 的 `options.only` API 一致；去重規則因專案而異，不由 Layer 決定。
- **[Q4]** 型別隨 composable 定義於 `useCamelotError.ts` — 理由：比照最相近的既有案例 `useCamelotToast.ts:69-96`。
- **[Q5]** 新增與轉換器分離的攔截器（interceptor）階段 — 理由：resolver 若兼做副作用，「只想轉格式」的情境會意外觸發清權限／導頁；分兩段後職責單一，且 interceptor 回傳 `true` 可支援靜默處理（不彈窗）。同時解掉參考專案 `useAppError` 中 `setTimeout(..., 1000)` 的時序 hack。
- **[Q6]** 多按鈕沿用 ConfirmDialog 既有的 positive / neutral / negative 三角色 — 理由：對映既有按鈕槽與排列順序，與 `CamelotConfirmAction` 詞彙一致，不必自行處理排版。
- **[Q7]** 呼叫端與錯誤自帶的 `onConfirm` 採串接，呼叫端先跑 — 理由：攔截器掛的多為導頁這類終結性動作，排最後才不會讓呼叫端邏輯被跳過。
- **[執行中]** `CamelotErrorDialog` 的關閉路徑統一收斂到 `open` 的 computed setter，不另接 `@cancel` — 理由：`BaseDialogV2.vue:116-118,203-206` 的遮罩／ESC 關閉一律會先寫回 open model，再接 cancel 會造成重複 `dismiss()`（把佇列中的下一則一併吃掉）。同理 `:auto-close="false"`，改由 `@positive` 單一路徑觸發。
- **[執行中]** 內建 FetchError 轉換器採 duck-typing（檢查 `statusCode` 欄位）而非 `instanceof FetchError` — 理由：避免 ofetch 跨 bundle 多實例時 `instanceof` 誤判，也免去在 Layer 引入執行期相依。
- **[規劃]** 轉換器註冊表採模組層單例而非 `useState` — 理由：resolver 是函式，無法通過 SSR 序列化（呼應 TypeScript 規範第 3 條「無狀態相依以模組級單例提供」）。

## Git Completion Policy
- Issue 綁定後，PR body 必須含 `Closes #${N}`，歸檔完成後於該 issue 張貼由 archive 蒸餾的結案留言 (Rule 20)。
- After user-approved commits, completion will run `git rebase main` and update the remote work branch with `git push --force-with-lease --force-if-includes`（`main` 由本 repo 的 `refs/remotes/origin/HEAD` 解析而得）。
- PR/archive order: Archive automatically triggered on PR request。
- 單一 repo，本 repo 自己開自己的 PR。

## References
- 參考來源（他專案，唯讀）：`sl-digital-lwd/sinphar-webapp-member` 的 `composables/useAppError.ts` 與 `components/App/ErrorDialog.vue`
- `.kn-project/wiki/features/i18n-locales.md` — Layer 不自帶語系註冊，故顯示層文字不硬綁 i18n
- `.kn-project/wiki/features/layering.md` — 浮層 z-index 以 `var(--cml-z-*)` 引用

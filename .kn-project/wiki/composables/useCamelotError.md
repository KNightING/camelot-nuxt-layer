# useCamelotError

> 全域單例的錯誤佇列：可累積多筆錯誤並逐一顯示，入口只接受 `CamelotErrorType`，任意原始錯誤須經由可註冊的轉換器轉換、再交由攔截器處理副作用。

管線總覽與消費端註冊範例見 [錯誤處理系統](../features/error-handling.md)。

## 簽章
```ts
useCamelotError(): {
  errors: Ref<CamelotErrorType[]>
  currentError: ComputedRef<CamelotErrorType | null>
  push: (error: CamelotErrorType, options?: CamelotErrorOptions) => string
  handle: (raw: unknown, options?: CamelotErrorOptions) => string | undefined
  dismiss: (id?: string) => void
  runAction: (action: CamelotErrorAction, id?: string) => void
  clear: () => void
  registerErrorResolver: <TData>(resolver: CamelotErrorResolver<TData>) => () => void
  registerErrorInterceptor: <TData>(interceptor: CamelotErrorInterceptor<TData>) => () => void
  watch: (errors: Ref<unknown> | Ref<unknown>[], options?: CamelotErrorOptions) => void
}
```

`registerErrorResolver` / `registerErrorInterceptor` 亦可從 composable 外直接具名匯入（皆為模組層函式）。

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `errors` | `Ref<CamelotErrorType[]>` | 錯誤佇列，透過 `useState('Camelot:Errors')` 保存。 |
| `currentError` | `ComputedRef<CamelotErrorType \| null>` | 佇列第一筆，供顯示層一次呈現一則；無則為 `null`。 |
| `push` | `(error, options?) => string` | 入列一筆**已是** `CamelotErrorType` 的錯誤，回傳補上的 `id`。 |
| `handle` | `(raw, options?) => string \| undefined` | 接收任意原始錯誤的入口：轉換 → 攔截 → 入列。被攔截器攔下時回傳 `undefined`；`raw` 為 `null` / `undefined` 時不做任何事。 |
| `dismiss` | `(id?) => void` | 移除錯誤並觸發其 `onConfirm`；未指定 `id` 時移除當前顯示的那一筆。 |
| `runAction` | `(action, id?) => void` | 執行動作按鈕：先跑 `handler`，除非 `close` 為 `false`，否則一併 `dismiss`。 |
| `clear` | `() => void` | 清空佇列。 |
| `registerErrorResolver` | `(resolver) => () => void` | 註冊轉換器，回傳註銷函式。同名視為覆蓋。 |
| `registerErrorInterceptor` | `(interceptor) => () => void` | 註冊攔截器，回傳註銷函式。同名視為覆蓋。 |
| `watch` | `(errors, options?) => void` | 監看單一或多個錯誤 ref（例如 `useFetch` 的 `error`），非空即送進 `handle`。以 `{ immediate: true }` 建立。 |

## 參數與型別

| 型別 | 欄位 |
| --- | --- |
| `CamelotErrorType<TData = unknown>` | `id?`、`title?`、`message?`、`messageHtml?`、`code?`、`level?`、`data?: TData`、`onConfirm?`、`positive?`、`neutral?`、`negative?`、`zIndex?` |
| `CamelotErrorLevel` | `'error' \| 'warning' \| 'info'`（未指定時顯示層視為 `'error'`） |
| `CamelotErrorAction` | `{ label: string; color?: CamelotColorRole; close?: boolean; handler?: () => void }` |
| `CamelotErrorResolver<TData>` | `{ name: string; priority?: number; resolve: (raw: unknown) => CamelotErrorType<TData> \| undefined }` |
| `CamelotErrorInterceptor<TData>` | `{ name: string; priority?: number; intercept: (error: CamelotErrorType<TData>) => boolean \| undefined }` |
| `CamelotErrorOptions` | `only?`、`onConfirm?`、`positive?`、`neutral?`、`negative?` |

- **`resolve` 回傳 `undefined`** 代表「處理不了」，交給下一個轉換器；第一個回傳非 `undefined` 者勝出。
- **`intercept` 回傳 `true`** 代表「已完全處理」，該錯誤不入列、不顯示。
- **`close: false`** 讓對話框留著，由呼叫端自行決定何時 `dismiss`（例如重試流程）。
- **`priority`** 數字大者先跑，未指定為 `0`；內建轉換器為 `-100`。

## 內建轉換器
Layer 預設註冊三個**不含業務語意**的通用轉換器，優先權皆為 `-100`，確保消費端註冊的一律先試：

| 名稱 | 命中條件 | 產出 |
| --- | --- | --- |
| `camelot:fetch-error` | 物件且具 `statusCode` 欄位 | `code = statusCode`、`message = statusMessage ?? message`、`data = error.data` |
| `camelot:native-error` | `instanceof Error` | `message = error.message`、`data = error` |
| `camelot:string` | `typeof raw === 'string'` | `message = raw` |

全部落空時回傳保底錯誤（`level: 'error'`、`data` 掛原始物件），不會靜默吞錯。

## 用法
```ts
const { push, handle, watch } = useCamelotError()

// 已是 CamelotErrorType，含雙動作按鈕
push({
  title: '連線失敗',
  message: '無法取得資料。',
  positive: { label: '重試', close: false, handler: retry },
  negative: { label: '關閉' },
})

// 原始錯誤走轉換器鏈
handle(rawError)

// useFetch 的 error ref，並由呼叫端指定關閉後行為
const { error } = await useFetch('/api/orders')
watch(error, { onConfirm: () => router.back() })
```

## 備註
- 為模組層單例（`camelotError`），首次呼叫時建立，之後共用同一實例。
- 轉換器與攔截器的註冊表為**模組層 `Map`** 而非 `useState`——兩者都是函式，無法通過 SSR 序列化。排序結果會快取，註冊／註銷時失效。
- `CamelotErrorOptions` 的動作欄位為**覆寫**（呼叫端比轉換器更貼近當下情境）；`onConfirm` 為**串接**，呼叫端的先跑、錯誤自帶的（攔截器掛上的導頁等終結性動作）後跑。
- `id` 以 `Math.random().toString(36).substring(2, 11)` 產生。
- 與 [useErrorRef](./useErrorRef.md) 的差異：後者只把多個錯誤 ref 匯總成一個 ref，不含佇列、轉換與顯示。
- 與 Nuxt 內建 `useError` 互補：`useError` 只承載單一 `NuxtError` 且 `showError()` 會切換到錯誤頁，適合致命錯誤；本 composable 處理非致命、可逐一提示的錯誤。

---
[🪝 Composable 清單](../features/composables.md) ・ [🏠 Wiki](../index.md)

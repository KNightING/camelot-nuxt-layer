# useBaseApi

> 建立共用基礎設定的 API 用戶端，提供 get／post／put／patch／del 方法，並支援自動 refresh token、快取策略與日期還原等機制。

## 簽章
```ts
useBaseApi(baseOptions: ApiFetchOptions<any>): {
  get: <DataT>(url: Url, options?: ApiFetchOptions<DataT>) => ApiFetch<DataT>
  post: <DataT>(url: Url, options?: ApiFetchOptions<DataT>) => ApiFetch<DataT>
  put: <DataT>(url: Url, options?: ApiFetchOptions<DataT>) => ApiFetch<DataT>
  patch: <DataT>(url: Url, options?: ApiFetchOptions<DataT>) => ApiFetch<DataT>
  del: <DataT>(url: Url, options?: ApiFetchOptions<DataT>) => ApiFetch<DataT>
}

type Url = string | Request | Ref<string | Request> | (() => string | Request)

enum ContentType { Json, MultiPartFormData }
```

## 參數
| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `baseOptions` | `ApiFetchOptions<any>` | — | 各方法共用的基礎設定，會與各次呼叫的 `options` 淺層合併（`options` 覆寫 `baseOptions`）。 |

`ApiFetchOptions<DataT>` 主要欄位（繼承自 `UseFetchOptions`，並排除 `onRequest`／`onRequestError`／`onResponse`／`onResponseError`）：

| 欄位 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `contentType` | `ContentType` | `ContentType.Json` | 請求內容型別；`Json` 會自動加上 `Content-Type: application/json`。 |
| `cachePolicy` | `'none' \| 'cache'` | `'none'` | `'cache'` 時透過 `useNuxtData` 取回快取資料（需自行設定 key）。 |
| `onRequests` | `OnRequest[]` | — | 請求前依序執行的攔截器陣列。 |
| `onResponses` | `OnResponse<DataT>[]` | — | 回應後依序執行的攔截器陣列。 |
| `onResponseErrors` | `OnResponseError<DataT>[]` | — | 回應錯誤時依序執行的攔截器陣列。 |
| `addSecureHeaderRequest` | `boolean` | `true` | 是否加上安全標頭（`X-Content-Type-Options: nosniff`、`Referrer-Policy: same-origin`）。 |
| `transDateKeys` | `string[]` | — | 指定要將回應中該些 key 的值還原為 `Date` 物件。 |
| `autoRefreshToken` | `boolean` | — | 啟用自動 refresh token 機制。 |
| `refreshTokenHandler` | `RefreshTokenHandler` | — | refresh token 實際處理函式，回傳 `true` 代表刷新成功。需搭配 `autoRefreshToken`。 |
| `shouldRefreshToken` | `ShouldRefreshTokenFn` | `response.status === 401` | 自訂判斷是否需要 refresh token。 |
| `maxRefreshRetry` | `number` | `1` | refresh retry 的最大次數。 |

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `get` / `post` / `put` / `patch` / `del` | `(url, options?) => ApiFetch<DataT>` | 各 HTTP 方法的建構函式，回傳含多種取用方式的物件。 |

各方法回傳物件（`useApiFetch` 之結果）包含：

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `useFetch` | `(coverOptions?) => UseFetchReturn` | 原生 `useFetch` 包裝。 |
| `useFetchBetter` / `useBFetch` | `(coverOptions?) => { data, refresh, error, clear, status, idle, pending, success }` | 額外提供 `idle`／`pending`／`success` 三個由 `status` 衍生的 computed。 |
| `useLazyFetch` / `useLFetch` | `(coverOptions?) => ...` | `useFetchBetter` 的懶載入版（`immediate:false`、`watch:false`、`server:false`、`dedupe:'defer'`）。 |
| `fetch` | `(coverOptions?, _retryCount?, abortSignal?) => Promise<DataT>` | 以 `$fetch` 直接發送並回傳資料，支援 signal 模式的自動 refresh token（同時相容 `ignoreResponseError`）。 |

## 用法
```ts
const api = useBaseApi({ baseURL: '/api', autoRefreshToken: true, refreshTokenHandler })
const { data, pending } = api.get<User[]>('/users').useBFetch()
const detail = await api.post<Detail>('/detail', { body: { id } }).fetch()
```

## 備註
- 同一個 `refreshTokenHandler` 參考共用一把鎖（模組層 `Map`），同一伺服器的多個請求同時需要 refresh 時只會觸發一次；不同 handler 互不影響。
- 其他匯出：`useBasicToken(account, pwd)`（回傳 Base64）、`useBasicTokenRequest`、`useBearerTokenRequest`、`secureHeaderRequest`，以及類別 `BaseApi`（建構子接收 `baseOptions`，`api` 屬性為 `useBaseApi` 之結果）。
- `transDateKeys` 會設定 `transform`，對陣列逐項或單一物件套用日期還原。

---
[🏠 Wiki](../index.md)

# useBaseApi

## Summary

`useBaseApi(baseOptions)` 以一組共用設定建立 API 用戶端，回傳 get、post、put、patch、del 五個方法。每個方法產生一個請求物件，可用 useFetch 系列或 `fetch()` 取用，並內建安全標頭、日期還原、快取取值與自動 refresh token。同一模組另匯出 `BaseApi` 類別與 Basic、Bearer 授權攔截器。情境導向的組法見 API 用戶端頁，本頁只放 API 參考。

## 運作方式

### 選項合併

1. 各方法把呼叫時的選項淺層覆蓋在 baseOptions 上，同名欄位以呼叫時為準。
2. 未指定時補上預設：JSON 內容型別、不使用快取、加上安全標頭。
3. refresh 相關設定與 transDateKeys 在建立請求物件時就固定，之後取用方式共用同一份。

來源：1. [useBaseApi.ts][]

### 請求與回應攔截

1. 內容型別為 JSON 時，設定 Content-Type 標頭。
2. 開啟安全標頭時，加上 X-Content-Type-Options 與 Referrer-Policy。
3. 依陣列順序執行 `onRequests`。
4. 回應後依序執行 `onResponses`；回應錯誤時依序執行 `onResponseErrors`。

來源：1. [useBaseApi.ts][]

### 自動 refresh token

1. 觸發條件：開啟 `autoRefreshToken`、有提供 handler，且判斷函式成立；預設判斷是狀態碼 401。
2. 同一個 handler 共用一把鎖，多個請求同時需要刷新時只呼叫一次 handler，其餘等待同一個結果。
3. 刷新成功：useFetch 系列在 nextTick 後自動 refresh；`fetch()` 重新呼叫原請求。
4. 刷新失敗或已達重試上限：照常走錯誤攔截器並把錯誤交給呼叫端。

可自動回復的 401 在這裡就地刷新並重送，不會進入全域錯誤佇列；刷新也失敗的錯誤才交由 [useCamelotError](./useCamelotError.md) 提示。

| 規則 | 說明 |
| --- | --- |
| useFetch 系列刷新成功 | 直接 refresh，本次回應不執行 `onResponses` 與 `onResponseErrors` |
| `fetch()` 的攔截器 | 無論是否需要刷新，本次回應的攔截器都會先執行 |
| 重試計數 | useFetch 系列在收到不需刷新的回應時歸零；`fetch()` 每次呼叫各自計數 |
| 重送的中止訊號 | `fetch()` 重送時不帶原本的 AbortSignal |
| 相容忽略錯誤模式 | `ignoreResponseError` 開啟時同樣能觸發刷新 |

來源：1. [useBaseApi.ts][]

### 日期還原與回應解析

1. 設定 `transDateKeys` 時會改寫 transform：回應是陣列就逐項處理，否則處理物件本身。
2. 只處理第一層欄位；值為字串、數字或 Date 時轉成 Date 物件。
3. `fetch()` 一律以 JSON 解析回應本文，再套用 transform。

來源：1. [useBaseApi.ts][]

### 快取

`cachePolicy` 為 cache 時，useFetch 系列先以 useNuxtData 依 key 取已有資料，有資料就不重新請求；需要自行設定 key。

來源：1. [useBaseApi.ts][]

## 用法

```ts
const api = useBaseApi({ baseURL: '/api', autoRefreshToken: true, refreshTokenHandler })
const { data, pending } = api.get<User[]>('/users').useBFetch()
const detail = await api.post<Detail>('/detail', { body: { id } }).fetch()
```

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

`ApiFetch` 在原始碼中沒有具名型別，這裡用來指稱請求物件，成員見下方「回傳」。

## 參數

| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `baseOptions` | `ApiFetchOptions<any>` | — | 各方法共用的基礎設定 |

選項型別延伸自 Nuxt 的 useFetch 選項，但移除四個單一攔截器欄位，改用下表的陣列版本。

| 欄位 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `contentType` | `ContentType` | `ContentType.Json` | Json 時自動加上 JSON 的 Content-Type |
| `cachePolicy` | `'none' \| 'cache'` | `'none'` | cache 時以 useNuxtData 取回已有資料，需設定 key |
| `onRequests` | `OnRequest[]` | — | 請求前依序執行的攔截器 |
| `onResponses` | `OnResponse<DataT>[]` | — | 回應後依序執行的攔截器 |
| `onResponseErrors` | `OnResponseError<DataT>[]` | — | 回應錯誤時依序執行的攔截器 |
| `addSecureHeaderRequest` | `boolean` | `true` | 是否加上安全標頭 |
| `transDateKeys` | `string[]` | — | 回應中要還原為 Date 的欄位名 |
| `autoRefreshToken` | `boolean` | — | 啟用自動 refresh token |
| `refreshTokenHandler` | `RefreshTokenHandler` | — | 實際刷新的函式，回傳 `true` 代表成功 |
| `shouldRefreshToken` | `ShouldRefreshTokenFn` | 狀態碼 401 | 自訂是否需要刷新的判斷 |
| `maxRefreshRetry` | `number` | `1` | 刷新後重送的最大次數 |

## 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `get`、`post`、`put`、`patch`、`del` | `(url, options?) => ApiFetch<DataT>` | 各 HTTP 方法；`del` 送出 DELETE |

每個請求物件包含下列取用方式：

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `useFetch` | `(coverOptions?) => AsyncData` | Nuxt useFetch 的包裝 |
| `useFetchBetter`、`useBFetch` | `(coverOptions?) => { data, refresh, error, clear, status, idle, pending, success }` | 另提供由 status 衍生的三個 computed |
| `useLazyFetch`、`useLFetch` | `(coverOptions?) => 同上` | 預設不立即執行、不 watch、只在 client、dedupe 為 defer |
| `fetch` | `(coverOptions?, retryCount?, abortSignal?) => Promise<DataT>` | 以 $fetch 直接送出並回傳資料 |

## 其他匯出

| 名稱 | 說明 |
| --- | --- |
| `useBasicToken(account, pwd)` | 回傳帳密組合的 Base64 字串 |
| `useBasicTokenRequest(account, pwd)` | 產生加上 Basic 授權標頭的請求攔截器；任一值為空時不加 |
| `useBearerTokenRequest(token)` | 產生加上 Bearer 授權標頭的請求攔截器；token 為空時不加 |
| `secureHeaderRequest` | 加上安全標頭的請求攔截器 |
| `BaseApi` | 類別，建構子接收 baseOptions，`api` 屬性即 useBaseApi 的結果 |
| `ContentType` | 列舉：Json、MultiPartFormData |
| `RefreshTokenHandler`、`ShouldRefreshTokenFn` | refresh token 相關函式型別 |
| `OnRequest`、`OnResponse`、`OnResponseError` | 攔截器函式型別 |

來源：1. [useBaseApi.ts][]

## 相關頁面

- [API 用戶端](../../platform/api-client.md)：應用層 API 類別、取用方式的選擇與 refresh token 接法。
- [錯誤處理系統](../../platform/error-handling.md)：無法回復的錯誤如何提示。

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useBaseApi.ts | [app/composables/useBaseApi.ts](../../../../app/composables/useBaseApi.ts) |

[useBaseApi.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

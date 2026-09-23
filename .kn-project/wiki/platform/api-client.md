# API 用戶端

## Summary

Camelot 的 API 層（API Client）以 `useBaseApi` 為核心：一次設定 `baseURL`、標頭、攔截器與 refresh token 策略，之後每支端點各自取得一個請求物件，由呼叫端決定用 `useFetch` 系列（響應式）或 `fetch`（命令式）。建議以繼承 `BaseApi` 的應用層類別收斂設定與端點，元件只認具名方法、不碰 URL 字串。完整簽章見 useBaseApi 參考頁。

## 運作方式

### 組成與分工

| 單元 | 角色 |
| :--- | :--- |
| `useBaseApi` | 工廠：綁定共用設定，回傳 `get`、`post`、`put`、`patch`、`del` |
| `BaseApi` | 類別包裝：建構子接收共用設定，`this.api` 即工廠的結果，供應用層繼承 |
| 請求物件 | 一次請求的多種取用方式：`useFetch`、`useBFetch`、`useLFetch`、`fetch` |

這張圖回答：應用層類別的一次呼叫，經過哪幾層才變成實際請求？

```json diagram id=圖1
{
  "type": "flow",
  "dir": "TD",
  "title": "API 呼叫分層",
  "desc": "應用層類別把共用設定交給工廠，每支端點回傳請求物件，由呼叫端選擇響應式或命令式取用",
  "nodes": [
    {"id": "A", "text": "應用層類別", "shape": "stadium"},
    {"id": "B", "text": "API 工廠"},
    {"id": "G", "text": "共用設定", "kind": "data"},
    {"id": "C", "text": "HTTP 方法"},
    {"id": "D", "text": "請求物件", "key": true},
    {"id": "E", "text": "響應式取用"},
    {"id": "F", "text": "命令式取用"}
  ],
  "edges": [
    {"from": "A", "to": "B", "label": "傳入共用設定"},
    {"from": "B", "to": "G", "label": "綁定", "kind": "async"},
    {"from": "B", "to": "C"},
    {"from": "C", "to": "D", "label": "一端點一方法"},
    {"from": "D", "to": "E", "label": "隨依賴重取"},
    {"from": "D", "to": "F", "label": "回傳 Promise"}
  ]
}
```

![API 呼叫分層](api-client.圖1.svg)

共用設定包含 `baseURL`、標頭、`contentType`、攔截器與 refresh token 策略。

來源：1. [useBaseApi.ts][]

### 建立應用層 API 類別

以 `BaseApi` 為基底，建構子集中所有共用設定，每支端點一個具名 public 方法：

```ts
class OrderApi extends BaseApi {
  constructor() {
    super({
      // baseURL 可傳 computed，讓執行期設定（如 runtimeConfig）生效
      baseURL: computed(() => useRuntimeConfig().public.apiBaseUrl),
      contentType: ContentType.Json,
      headers: defaultHeaders,
      onRequests: [useBearerTokenRequest(() => useAuthStore().accessToken ?? '')],
      autoRefreshToken: true,
      refreshTokenHandler: async () => {
        // 回傳 true 代表刷新成功，原請求會自動重送
        return await refreshAccessToken()
      },
    })
  }

  // 回傳請求物件而非直接 .fetch()，讓呼叫端自行選擇取用方式
  public getOrders(query?: MaybeRefOrGetter<OrderQuery>) {
    return this.api.get<OrderListResp>(() => '/orders', { query })
  }

  public postOrder(body: MaybeRefOrGetter<CreateOrderReq>) {
    return this.api.post<CreateOrderResp>(() => '/orders', { body })
  }
}

export const useOrderApi = () => new OrderApi()
```

| 要點 | 說明 |
| :--- | :--- |
| 方法內不呼叫 `fetch` | 回傳請求物件；頁面要響應式用 `useBFetch`，要命令式用 `fetch`，同一支端點兩種情境共用 |
| URL 一律用 getter | URL 型別支援字串、Request、Ref 與 getter；getter 才能讓路徑中的變數參與響應式重取 |
| `query` 與 `body` 收 `MaybeRefOrGetter` | 搭配 `useFetch` 系列時，來源變動會自動重取 |
| 型別放在泛型參數 | 回應型別寫在方法的泛型參數上，即端點契約 |

playground 有一份可執行的同型範例。

來源：1. [useBaseApi.ts][]　2. [useTestApi.ts][]

### 四種取用方式

| 方式 | 行為 | 適用情境 |
| :--- | :--- | :--- |
| `useFetch` | Nuxt `useFetch` 的原生包裝 | 需要原生回傳結構時 |
| `useBFetch`，別名 `useFetchBetter` | 額外提供由 `status` 衍生的 `idle`、`pending`、`success` | 一般頁面載入的預設選擇 |
| `useLFetch`，別名 `useLazyFetch` | `useBFetch` 的懶載入版：不立即送出、不 watch、不在 server 端執行，`dedupe` 為 `defer` | 由使用者操作觸發、不隨依賴自動重取 |
| `fetch` | 以 `$fetch` 送出並回傳 Promise，可傳 `AbortSignal` 中止 | 送出表單、序列流程、需要 await 結果或中止請求 |

每種方式都可傳覆寫設定 `coverOptions`，只影響該次呼叫。

來源：1. [useBaseApi.ts][]

### 設定的合併規則

共用設定與單次設定是淺層合併，同名鍵由單次設定覆寫。

| 鍵 | 合併方式 |
| :--- | :--- |
| 純量與物件鍵，例如 `baseURL`、`headers`、`contentType` | 單次設定整個取代共用設定 |
| 攔截器陣列 `onRequests`、`onResponses`、`onResponseErrors` | 同樣是取代而非串接，單次傳入後共用的那組不再生效 |

攔截器需要疊加時，在單次陣列中一併列出要保留的攔截器。

來源：1. [useBaseApi.ts][]

## 認證與 refresh token

### 請求攔截器

| 匯出 | 用途 |
| :--- | :--- |
| `useBearerTokenRequest` | 加上 Bearer 認證標頭，接受 ref 或 getter |
| `useBasicTokenRequest` | 以帳號、密碼加上 Basic 認證標頭 |
| `useBasicToken` | 產生 Base64 字串 |
| `secureHeaderRequest` | 安全標頭，預設已由 `addSecureHeaderRequest` 自動掛上 |

來源：1. [useBaseApi.ts][]

### 自動刷新

| 選項 | 說明 |
| :--- | :--- |
| `autoRefreshToken` | 啟用自動刷新與原請求重送 |
| `refreshTokenHandler` | 實際刷新邏輯，回傳 `true` 代表成功 |
| `shouldRefreshToken` | 自訂觸發條件，預設為回應狀態 401 |
| `maxRefreshRetry` | 重試上限，預設 `1` |

同一個刷新函式參考共用一把鎖：多個請求同時遇到 401 只觸發一次刷新，其餘等待同一個 Promise；不同函式互不影響。

因此刷新函式應是穩定的參考，不要每次呼叫都重新建立。

來源：1. [useBaseApi.ts][]

### 忽略回應錯誤時的攔截器

開啟 `ignoreResponseError` 後，HTTP 4xx 與 5xx 不再拋出，而是走 `onResponses`。

`onResponseErrors` 只剩斷網、逾時、DNS 等傳輸層錯誤會進入。

| 處理 | 放在哪組攔截器 |
| :--- | :--- |
| 狀態碼相關，自行判斷回應狀態 | `onResponses` |
| 連線層錯誤 | `onResponseErrors` |

自動 refresh token 在兩種模式下都可運作。

來源：1. [useBaseApi.ts][]

## 其他機制

| 機制 | 說明 |
| :--- | :--- |
| `contentType` | 預設 JSON，自動帶對應的 Content-Type；上傳檔案用 multipart form data |
| `cachePolicy` | 設為 `cache` 時透過 `useNuxtData` 取回快取；需自行設定 key，未設定則無效 |
| `transDateKeys` | 指定回應中哪些 key 要還原為 Date；內部改寫 transform，對陣列逐項或單一物件套用 |
| `addSecureHeaderRequest` | 預設 `true`，自動加上 nosniff 與 same-origin Referrer-Policy 兩個安全標頭 |

來源：1. [useBaseApi.ts][]

## 與其他系統的分工

| 情境 | 交給誰 |
| :--- | :--- |
| 串流 | SSE 與逐行 JSON 改用 [useFetchStream](../features/composables/useFetchStream.md) 與 [useFetchJSONLinesStream](../features/composables/useFetchJSONLinesStream.md) |
| 錯誤處理 | 可自動回復的 401 在 API 層就地刷新並重送；刷新也失敗的錯誤才交由 [錯誤處理系統](./error-handling.md) 提示 |
| 分頁 | 清單型端點可搭配 [useInfinitePage](../features/composables/useInfinitePage.md) |

## 相關頁面

- [useBaseApi](../features/composables/useBaseApi.md)：完整 API 參考
- [錯誤處理系統](./error-handling.md)：全域錯誤佇列與本頁的分工
- [Composable 清單](../features/composables.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useBaseApi.ts | [app/composables/useBaseApi.ts](../../../app/composables/useBaseApi.ts) |
| useTestApi.ts | [.playground/app/composables/useTestApi.ts](../../../.playground/app/composables/useTestApi.ts) |

[useBaseApi.ts]: #references
[useTestApi.ts]: #references

---
[⚙️ Env](../environment.md) | [🏠 Wiki](../index.md)

# useBaseUrl

> 於 client 端回傳結合 `window.location.origin` 與 runtime config `app.baseURL` 的基底網址。

## 簽章
```ts
const useBaseUrl: () => string
```

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| （回傳值） | `string` | client 端回傳 `` `${window.location.origin}${config.app.baseURL}` ``；非 client 端回傳空字串 `''`。 |

## 用法
```ts
const baseUrl = useBaseUrl()
```

## 備註
- 透過 `isClient`（`@vueuse/core`）判斷執行環境。
- client 端使用 `useRuntimeConfig()` 取得 `config.app.baseURL`。

---
[🏠 Wiki](../index.md)

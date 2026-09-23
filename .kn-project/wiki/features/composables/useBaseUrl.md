# useBaseUrl

## Summary

`useBaseUrl()` 在瀏覽器端回傳目前網站的 origin 加上 Nuxt runtime config 的 `app.baseURL`，組成應用程式的基底網址；在伺服器端回傳空字串。

## 運作方式

1. 以 VueUse 的 `isClient` 判斷執行環境。
2. 瀏覽器端：讀取 runtime config，回傳 origin 與 `app.baseURL` 直接相接的字串。
3. 伺服器端：回傳空字串，不讀取 runtime config。

來源：1. [useBaseUrl.ts][]

## 用法

```ts
const baseUrl = useBaseUrl()
const shareLink = `${baseUrl}orders/${id}`
```

## 簽章

```ts
useBaseUrl(): string
```

## 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| （回傳值） | `string` | 瀏覽器端為 origin 加上 `app.baseURL`；伺服器端為 `''` |

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useBaseUrl.ts | [app/composables/useBaseUrl.ts](../../../../app/composables/useBaseUrl.ts) |

[useBaseUrl.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

# useFileToDataURL

## Summary

useFileToDataURL 以 FileReader 把 File 讀成 Data URL 字串，並用 Nuxt 的 useAsyncData 包裝，回傳可 await 的非同步資料物件。快取 key 取自 useFileKey，同一個檔案重複呼叫會共用結果。常用於上傳前的圖片預覽。

## 介面

### 簽章

```ts
const useFileToDataURL: (file: File) => AsyncData<string, …>
```

### 參數

| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `file` | `File` | 必填 | 要讀取的檔案 |

### 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| 回傳值 | useAsyncData 的回傳型別 | `data` 為 Data URL 字串，另有 `pending`、`error`、`refresh` 等 |

來源：1. [useFileToDataURL.ts][]　2. [useFileKey.ts][]

## 用法

```ts
const { data, pending } = await useFileToDataURL(file)
// data.value 為檔案的 Data URL
```

## 規則

| 規則 | 說明 |
| --- | --- |
| 快取 key | `useFileKey(file)` |
| 讀取方式 | `FileReader.readAsDataURL`，只能在瀏覽器端執行 |
| 讀取失敗 | 只監聽 load 事件，讀檔失敗時 Promise 不會結束，`pending` 會停在 `true` |

## 相關頁面

- [useFileKey](./useFileKey.md)：檔案識別字串。

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useFileToDataURL.ts | [app/composables/useFileToDataURL.ts](../../../../app/composables/useFileToDataURL.ts) |
| useFileKey.ts | [app/composables/useFileKey.ts](../../../../app/composables/useFileKey.ts) |

[useFileToDataURL.ts]: #references
[useFileKey.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

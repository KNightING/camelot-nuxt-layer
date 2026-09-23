# useFileKey

## Summary

useFileKey 依檔案的 MIME 型別、名稱、大小與最後修改時間組出一個識別字串，用來判斷兩個 File 是否為同一個檔案，或當作快取、useAsyncData 的 key。它是純函式，不建立任何響應式狀態。

## 介面

### 簽章

```ts
const useFileKey: (file: File) => string
```

### 參數

| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `file` | `File` | 必填 | 來源檔案 |

### 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| 回傳值 | `string` | 以底線串接 `type`、`name`、`size`、`lastModified` |

來源：1. [useFileKey.ts][]

## 用法

```ts
const key = useFileKey(file)
// 'image/png_photo.png_20480_1700000000000'
```

## 規則

| 規則 | 說明 |
| --- | --- |
| 相同判定 | 四個欄位都相同就得到相同字串，內容不同但欄位相同也會撞 key |
| 使用者 | useFileToDataURL 以它作為 useAsyncData 的 key |

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useFileKey.ts | [app/composables/useFileKey.ts](../../../../app/composables/useFileKey.ts) |

[useFileKey.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

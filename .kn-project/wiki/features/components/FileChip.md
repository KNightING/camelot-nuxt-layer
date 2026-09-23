# FileChip

## Summary

FileChip（匯入名稱 `CamelotFileChip`）是單一檔案的附件晶片：左側是圖片縮圖或依檔案類型著色的圖示，右側是檔名與「類型標籤 · 大小」，可選擇在右上角加移除鈕。[FileDropzone](./FileDropzone.md) 的附件列預設就用它渲染，也可以單獨拿來顯示已上傳的檔案。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `file` | `File` | — | 要顯示的檔案，必填 |
| `url` | `string` | `''` | 縮圖網址；未提供且為圖片檔時自行產生 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色，用於移除鈕的懸停色 |
| `removable` | `boolean` | `false` | 顯示右上角移除鈕 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `remove` | — | 點擊移除鈕時觸發 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | `{ file, url, meta }` | 自訂晶片內容；url 為縮圖網址，meta 為檔案類型資訊 |

## 運作方式

### 圖示與文字

1. 有縮圖網址時顯示縮圖，否則依檔案類型顯示圖示：試算表、PDF、文件、壓縮檔、音訊、影片，其餘為通用檔案圖示。
2. 類型標籤與圖示底色來自共用的檔案分類規則，大小以同一套規則格式化。
3. 檔名過長時截斷，最寬 10rem。

來源：1. [FileChip.vue][]　2. [useCamelotFileDrop.ts][]

### 縮圖生命週期

外部傳入 url 時直接使用。沒有傳入且檔案是圖片時，元件自行產生 objectURL，並在 file 或 url 變動、以及卸載時回收，避免記憶體洩漏。

來源：1. [FileChip.vue][]

### 主題圓角

| 主題 | 晶片圓角 | 圖示圓角 |
| :--- | :--- | :--- |
| Aqua | 1rem | 0.625rem |
| Sci-Fi | 直角 | 直角 |
| 其他 | 0.75rem | 0.5rem |

來源：1. [FileChip.vue][]

## 相關頁面

- [檔案拖放](../file-drop.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| FileChip.vue | [app/components/Camelot/FileChip.vue](../../../../app/components/Camelot/FileChip.vue) |
| useCamelotFileDrop.ts | [app/composables/useCamelotFileDrop.ts](../../../../app/composables/useCamelotFileDrop.ts) |

[FileChip.vue]: #references
[useCamelotFileDrop.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

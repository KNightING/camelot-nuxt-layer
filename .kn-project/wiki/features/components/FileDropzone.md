# FileDropzone

## Summary

FileDropzone（匯入名稱 `CamelotFileDropzone`）是通用檔案的拖放區：點擊區域開啟檔案選擇，或把檔案拖進來，已選檔案以附件晶片列顯示在下方並可逐一移除。可限制檔案類型、單選多選與檔數上限，選取結果以 v-model 回傳。只收圖片、要縮圖格的情境改用 [ImageDropzone](./ImageDropzone.md)。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色 |
| `accept` | `string` | `'*'` | 接受的檔案類型，寫法同原生 accept |
| `multiple` | `boolean` | `true` | 是否可多選 |
| `disabled` | `boolean` | `false` | 是否停用 |
| `max` | `number` | `0` | 最多檔數，0 表示不限 |
| `height` | `string` | `'7rem'` | 拖曳區最小高度 |
| `hint` | `string` | `'點此選擇檔案，或拖曳到此區域'` | 提示文字 |
| `preview` | `boolean` | `true` | 是否顯示附件晶片列 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `select` | `(files: File[])` | 選取檔案時觸發 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model` | `File[] \| null` | 目前選取的檔案清單，預設 `null` |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | `{ dragOver, count, max, atMax, open }` | 自訂拖曳區內容；open 為開啟檔案選擇的函式 |
| `icon` | — | 自訂拖曳區圖示 |
| `chip` | `{ file, url, index, remove }` | 自訂附件晶片；預設渲染 [FileChip](./FileChip.md) |

## 運作方式

### 選取與拖放

拖放、類型過濾、檔數上限與縮圖生命週期都由 [useCamelotFileDrop](../composables/useCamelotFileDrop.md) 處理，元件只負責畫面。

| 狀態 | 外觀 |
| :--- | :--- |
| 拖曳經過 | 邊框、底色與文字轉為角色色 |
| 懸停 | 邊框轉為角色色、底色加深 |
| 停用 | 半透明並阻擋所有互動 |

來源：1. [FileDropzone.vue][]　2. [useCamelotFileDrop.ts][]

### 主題圓角

| 主題 | 拖曳區圓角 |
| :--- | :--- |
| Aqua | 1rem |
| Sci-Fi | 直角 |
| Cupertino | 0.75rem |
| Material | 0.5rem |

來源：1. [FileDropzone.vue][]

## 相關頁面

- [檔案拖放](../file-drop.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| FileDropzone.vue | [app/components/Camelot/FileDropzone.vue](../../../../app/components/Camelot/FileDropzone.vue) |
| useCamelotFileDrop.ts | [app/composables/useCamelotFileDrop.ts](../../../../app/composables/useCamelotFileDrop.ts) |

[FileDropzone.vue]: #references
[useCamelotFileDrop.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

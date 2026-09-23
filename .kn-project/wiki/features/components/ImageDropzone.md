# ImageDropzone

## Summary

ImageDropzone（匯入名稱 `CamelotImageDropzone`）是圖片專用的拖放區，有兩種版面：stacked 是一個大的拖放區塊，縮圖列在下方；grid 是多欄縮圖格，新增格接在最後一張縮圖之後。預設只收圖片，可限制張數，縮圖可逐一移除，選取結果以 v-model 回傳。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色 |
| `accept` | `string` | `'image/*'` | 接受的檔案類型，寫法同原生 accept |
| `multiple` | `boolean` | `false` | 是否可多選；grid 版面一律多選 |
| `disabled` | `boolean` | `false` | 是否停用 |
| `layout` | `'stacked' \| 'grid'` | `'stacked'` | 版面 |
| `max` | `number` | `0` | 最多張數，0 表示不限；grid 達上限時隱藏新增格 |
| `columns` | `number` | `4` | grid 欄數 |
| `height` | `string` | `'7rem'` | stacked 區塊最小高度 |
| `hint` | `string` | `'點此選擇圖片，或拖曳到此區域'` | stacked 提示文字 |
| `gridHint` | `string` | `'新增'` | grid 新增格提示文字 |
| `preview` | `boolean` | `true` | stacked 是否在下方顯示縮圖；grid 一律顯示 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `select` | `(files: File[])` | 選取檔案時觸發 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model` | `File[] \| null` | 目前選取的圖片清單，預設 `null` |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | `{ dragOver, count, max, atMax, open }` | 自訂拖放區或新增格內容；open 為開啟檔案選擇的函式 |
| `icon` | — | 自訂拖放區圖示 |
| `thumb` | `{ url, filename, index, remove }` | 自訂縮圖格；預設顯示圖片與移除鈕 |

## 運作方式

### 兩種版面

| 版面 | 排列 | 縮圖 | 多選 |
| :--- | :--- | :--- | :--- |
| stacked | 拖放區塊在上，縮圖列在下 | 依 preview | 依 multiple |
| grid | 縮圖與新增格排成 columns 欄 | 一律顯示 | 一律多選 |

拖放、類型過濾、張數上限與縮圖生命週期都由 [useCamelotFileDrop](../composables/useCamelotFileDrop.md) 處理，元件只負責畫面。

來源：1. [ImageDropzone.vue][]　2. [useCamelotFileDrop.ts][]

### 狀態與主題

拖曳經過時邊框、底色與文字轉為角色色；停用時半透明並阻擋所有互動。

| 主題 | 拖放區圓角 | 縮圖圓角 |
| :--- | :--- | :--- |
| Aqua | 1rem | 0.5rem |
| Sci-Fi | 直角 | 直角 |
| Cupertino | 0.75rem | 0.375rem |
| Material | 0.5rem | 0.375rem |

來源：1. [ImageDropzone.vue][]

## 相關頁面

- [FileDropzone](./FileDropzone.md)
- [檔案拖放](../file-drop.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| ImageDropzone.vue | [app/components/Camelot/ImageDropzone.vue](../../../../app/components/Camelot/ImageDropzone.vue) |
| useCamelotFileDrop.ts | [app/composables/useCamelotFileDrop.ts](../../../../app/composables/useCamelotFileDrop.ts) |

[ImageDropzone.vue]: #references
[useCamelotFileDrop.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

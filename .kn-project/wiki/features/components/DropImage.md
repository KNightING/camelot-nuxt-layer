# DropImage

## Summary

DropImage（匯入名稱 `CamelotDropImage`）是單張圖片的選取區：點擊開啟檔案選擇或把圖片拖進來，選到的圖片直接預覽在方形或 16:9 的框內，並以 v-model 回傳該檔案。尚未選圖時可顯示既有圖片與提示文字。多張、主題化的圖片上傳請改用 [ImageDropzone](./ImageDropzone.md)。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `label` | `string` | — | 上方標籤文字 |
| `modelValue` | `File \| string` | — | 目前選取的圖片 |
| `originImage` | `string` | — | 既有圖片網址，未選新圖時顯示 |
| `id` | `string` | — | 檔案輸入框的 id；未提供時自動產生 |
| `placeholderText` | `string` | — | 沒有任何圖片時顯示的提示文字 |
| `isAspectVideo` | `boolean` | — | 使用 16:9 比例，否則為正方形 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `update:modelValue` | `value?: File \| string` | 選取或拖放圖片後觸發 |

## 運作方式

### 選取與預覽

1. 點擊預覽框開啟檔案選擇，或把檔案拖到框上；拖曳經過時框內顯示藍底虛線提示。
2. 只取第一個檔案，且只接受圖片類型，其他類型直接忽略。
3. 選到的檔案讀成 DataURL 畫進預覽，並觸發 update:modelValue。

預覽只在元件內選檔或拖放時更新，外部改寫 modelValue 不會重畫預覽。

來源：1. [DropImage.vue][]

### 既有圖片

modelValue 為 undefined 且有 originImage 時顯示既有圖片：載入中先顯示 [Skeleton](./Skeleton.md)，載入完成後顯示圖片。

未提供 id 時，以時間戳加兩組隨機數產生，讓同頁多個 DropImage 的 label 各自對應自己的輸入框。

來源：1. [DropImage.vue][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| DropImage.vue | [app/components/Camelot/DropImage.vue](../../../../app/components/Camelot/DropImage.vue) |

[DropImage.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

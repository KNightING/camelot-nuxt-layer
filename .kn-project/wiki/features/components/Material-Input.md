# Material Input

## Summary

`CamelotMaterialInput` 是 Material 主題的 Filled 文字輸入框：上方圓角、容器底色加底線，可選浮動標籤與必填標記。一般不直接使用，而是由 `CamelotInput` 在 Material 主題（也是預設主題）下自動選用；只有外層採浮動標籤模式時才會傳入 `label`。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `label` | `string` | `''` | 浮動標籤文字；有值時欄位最低 56px，沒有時最低 42px |
| `placeholder` | `string` | `''` | 佔位文字；有 `label` 時只在聚焦時顯示 |
| `disabled` | `boolean` | `false` | 是否停用輸入框 |
| `type` | `CamelotInputType` | `'text'` | 原生 input type，由 `CamelotInput` 依密碼顯示切換計算後傳入 |
| `required` | `boolean` | `false` | 為真時標籤後顯示紅色 `*` |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `string \| number` | 輸入框的值 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `before` | — | 輸入框前方（左側）內容 |
| `after` | — | 輸入框後方（右側）內容 |

## Exposed
| 名稱 | 說明 |
| :--- | :--- |
| `inputEl` | 原生 input 元素的 ref，供 `CamelotInput` 轉接給使用端做聚焦、選取等操作 |

## 運作方式

### 欄位高度與標籤

| 情境 | 行為 |
| :--- | :--- |
| 有 `label` | 欄位最低 56px；標籤平時置中於欄位內，聚焦或有值時縮小上浮並改用色彩角色 |
| 沒有 `label` | 欄位最低 42px，佔位文字隨時顯示 |
| 有值的判斷 | 值不是 undefined 也不是空字串；數字 0 算有值 |

來源：1. [Material/Input.vue][]

### 聚焦與停用

1. 平時底線為外框線色。
2. 欄位內任一元素取得焦點時，底線換成目前色彩角色，並在底部加一條 1px 的內陰影，讓底線看起來加粗。
3. 停用時原生 input 停用；半透明與禁止游標由外層 `CamelotInput` 處理。

來源：1. [Material/Input.vue][]　2. [Input.vue][]

## 相關頁面

- [Input](./Input.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Material/Input.vue | [app/components/Camelot/Material/Input.vue](../../../../app/components/Camelot/Material/Input.vue) |
| Input.vue | [app/components/Camelot/Input.vue](../../../../app/components/Camelot/Input.vue) |

[Material/Input.vue]: #references
[Input.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

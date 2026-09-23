# Textarea

## Summary

多行文字輸入元件：上方以 FieldLabel 顯示欄位標題，支援自動增高、最大列數、手動縮放方向與字數統計，外觀依主題切換。匯入名稱為 `CamelotTextarea`（Nuxt 自動匯入）。

## 運作方式

### 自動增高

1. 開啟自動增高時，輸入、值變動與掛載後都會依內容重新計算高度。
2. 設定最大列數時，高度上限以行高乘列數再加上內距推算。
3. 自動增高時一律不可手動縮放；未開啟時依縮放設定決定可拖曳的方向。

來源：1. [Textarea.vue][]

### 外觀與狀態

| 主題 | 樣式 | 聚焦時 |
|---|---|---|
| Aqua | 玻璃底 | 聚焦光暈 |
| Sci-Fi | 直角半透明主色框、等寬字 | 框線換主色並外發光 |
| Cupertino | 圓角細框、淺底 | 框線換主色 |
| Material | Filled：淺底、只有下框線 | 下框線加粗並換主色 |

1. 字級為 1rem，游標顏色跟隨色彩角色。
2. 停用時整個元件半透明、游標顯示禁止。
3. 同時設定字數上限與顯示字數時，右下角顯示「目前字數 / 上限」。

來源：1. [Textarea.vue][]

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `label` | `string` | — | 欄位標題文字。 |
| `required` | `boolean` | — | 是否在標題顯示必填星號。 |
| `placeholder` | `string` | — | 提示文字。 |
| `disabled` | `boolean` | — | 是否停用。 |
| `rows` | `number` | `3` | 預設顯示列數。 |
| `autosize` | `boolean` | `false` | 是否隨內容自動增高。 |
| `maxRows` | `number` | — | 自動增高時的最大列數。 |
| `resize` | `'none' \| 'vertical' \| 'both'` | `'vertical'` | 手動縮放方向，`autosize` 開啟時不可縮放。 |
| `maxlength` | `number` | — | 最大字元數。 |
| `showCount` | `boolean` | `false` | 是否顯示字數統計，需同時設定 `maxlength`。 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色。 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `string`，預設 `''` | 文字輸入值。 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `label` | `{ label: string }` | 自訂標題區塊，預設渲染 FieldLabel。 |

## 相關頁面

- [FieldLabel](./FieldLabel.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Textarea.vue | [app/components/Camelot/Textarea.vue](../../../../app/components/Camelot/Textarea.vue) |

[Textarea.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

# CheckboxGroup

## Summary

CheckboxGroup 以選項清單渲染一組核取方塊，匯入名稱 `CamelotCheckboxGroup`。所有已勾選選項的值以陣列雙向綁定，可整組或逐選項停用，並可加上群組標題與必填標記。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `options` | `CamelotGroupOption[]` | —（必填） | 選項清單 |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | 排列方向 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色 |
| `disabled` | `boolean` | `false` | 整組停用；逐選項停用請用選項的 `disabled` |
| `label` | `string` | `''` | 群組標題文字 |
| `required` | `boolean` | `false` | 是否顯示必填標記 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `change` | `values: (string \| number)[]` | 勾選狀態變動時，回傳更新後的已選值陣列 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `(string \| number)[]`（預設 `[]`） | 目前所有已勾選選項的值陣列 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `label` | `{ label: string }` | 自訂群組標題，預設渲染 FieldLabel |

## 運作方式

1. 每個選項渲染為一個 [Checkbox](./Checkbox.md)，值在陣列中即為勾選。
2. 點擊選項時，已勾選就從陣列移除，否則加到陣列尾端。
3. 以新陣列更新綁定值，並送出 change。
4. 整組或該選項停用時，點擊不作用。

| 規則 | 說明 |
|---|---|
| 水平排列 | 自動換行，項目間距 24px |
| 垂直排列 | 由上而下，項目間距 8px |

來源：1. [CheckboxGroup.vue][]

## 相關頁面
- [FieldLabel](./FieldLabel.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| CheckboxGroup.vue | [app/components/Camelot/CheckboxGroup.vue](../../../../app/components/Camelot/CheckboxGroup.vue) |

[CheckboxGroup.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

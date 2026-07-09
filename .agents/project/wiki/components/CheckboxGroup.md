# CheckboxGroup

> 以選項清單渲染一組核取方塊，並以陣列形式雙向綁定所有已勾選的值。

**匯入名稱**：`CamelotCheckboxGroup`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `options` | `CamelotGroupOption[]` | — | 選項清單。 |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | 排列方向（預設水平）。 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色。 |
| `disabled` | `boolean` | `false` | 整組停用；逐選項停用請用 `option.disabled`。 |
| `label` | `string` | `''` | 群組標題文字。 |
| `required` | `boolean` | `false` | 是否顯示必填標記。 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `change` | `values: (string \| number)[]` | 勾選狀態變動時，回傳更新後的已選值陣列。 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `(string \| number)[]`（預設 `[]`） | 目前所有已勾選選項的值陣列。 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `label` | `{ label: string }` | 自訂群組標題，預設渲染 `CamelotFieldLabel`。 |

## 備註
- 每個選項渲染為 `CamelotCheckbox`，勾選狀態由 `modelValue.includes(opt.value)` 決定。
- `toggle` 於停用時（整組或單一選項）不作用。

---
[🏠 Wiki](../index.md)

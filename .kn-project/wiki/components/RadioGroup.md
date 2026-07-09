# RadioGroup

> 以選項清單渲染一組單選圓鈕，並以單一值雙向綁定目前選取項。

**匯入名稱**：`CamelotRadioGroup`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `options` | `CamelotGroupOption[]` | — | 選項清單。 |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | 排列方向（預設水平）。 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色。 |
| `disabled` | `boolean` | `false` | 整組停用；逐選項停用請用 `option.disabled`。 |
| `deselectable` | `boolean` | `false` | 點擊已選取項可取消選取（非必填情境），取消時 `modelValue` 為 `undefined`。 |
| `label` | `string` | `''` | 群組標題文字。 |
| `required` | `boolean` | `false` | 是否顯示必填標記。 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `change` | `option: CamelotGroupOption \| undefined` | 選取變動時觸發；`deselectable` 取消選取時 `option` 為 `undefined`。 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `string \| number \| undefined` | 目前選取選項的值。 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `label` | `{ label: string }` | 自訂群組標題，預設渲染 `CamelotFieldLabel`。 |

## 備註
- 每個選項渲染為 `CamelotRadio`，選取狀態由 `modelValue === opt.value` 決定。
- `select` 於停用時（整組或單一選項）不作用；點擊已選取項時，非 `deselectable` 不動作，`deselectable` 則將值設為 `undefined`。

---
[🏠 Wiki](../index.md)

# Menu

> 支援多層巢狀、可展開／收合並具選中態的選單清單元件。

**匯入名稱**：`CamelotMenu`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `items` | `CamelotMenuItem[]` | — | 選單項目清單（可含 `children` 巢狀） |
| `defaultExpandAll` | `boolean` | `false` | 掛載時是否預設展開所有含子項的父節點 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `select` | `item: CamelotMenuItem` | 選取某項目時觸發 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` (`active`) | `string \| number` | 目前選中的項目 `value` |
| `expanded` | `(string \| number)[]` | 已展開的節點 `value` 陣列（預設 `[]`） |

## 備註
- 透過 `provide(CAMELOT_MENU_KEY, ...)` 向子元件 `CamelotInternalMenuItem` 提供 `isActive`、`isActiveAncestor`、`isExpanded`、`toggleExpand`、`select`。
- `isActiveAncestor`：子孫中含選中項且自身非選中項時為真（父節點僅變色不上底色）。
- `defaultExpandAll` 為真且 `expanded` 為空時，於 `onMounted` 展開所有父節點。
- 使用 `useCamelotRoleColorClass` 依 `color` 產生角色色彩 class。

---
[🏠 Wiki](../index.md)

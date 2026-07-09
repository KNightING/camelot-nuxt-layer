# Tree

> 樹狀結構元件，支援展開／收合、勾選（含父節點半選推導）與自訂節點呈現。

**匯入名稱**：`CamelotTree`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `nodes` | `CamelotTreeNode[]` | — | 樹狀節點資料（必填）。 |
| `checkable` | `boolean` | `false` | 是否顯示勾選框。 |
| `defaultExpandAll` | `boolean` | `false` | 初始展開全部節點。 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色。 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `nodeClick` | `(node: CamelotTreeNode)` | 點擊節點時觸發。 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model:checked` | `(string \| number)[]` | 已勾選的葉節點值；父節點勾選／半選由葉節點推導。預設 `[]`。 |
| `v-model:expanded` | `(string \| number)[]` | 已展開的節點值。預設 `[]`。 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `node` | （透傳自 `CamelotInternalTreeNode` 的作用域） | 自訂單一節點的呈現。 |

## 備註
- 內部以 `CamelotInternalTreeNode` 遞迴渲染，並透過 `provide`（`CAMELOT_TREE_KEY`）傳遞勾選／展開狀態與方法。
- 勾選以葉節點為準，父節點的全選／半選（indeterminate）由其子孫葉節點狀態計算。

---
[🏠 Wiki](../index.md)

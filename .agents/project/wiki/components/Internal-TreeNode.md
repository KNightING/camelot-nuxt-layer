# TreeNode

> 樹狀結構的單一節點，內部實作，遞迴渲染子節點並支援展開/收合與勾選。

**匯入名稱**：`CamelotInternalTreeNode`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `node` | `CamelotTreeNode` | — | 節點資料 |
| `level` | `number` | `0` | 層級深度（決定左側縮排） |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `node` | `{ node, level, isChecked, isExpanded }` | 自訂節點內容；預設顯示 `node.label`，並遞迴傳遞給子節點 |

## 備註
- 為內部元件，透過 `CAMELOT_TREE_KEY` 注入 `CamelotTreeContext`（提供 checkable、color、isChecked、isIndeterminate、isExpanded、toggleExpand、toggleCheck、onNodeClick、hasNodeSlot 等）。
- 可勾選模式（`checkable`）且未自訂 node slot 時，label 直接由 `CamelotCheckbox` 渲染，與獨立 Checkbox 一致。
- 可勾選模式下點擊整行切換勾選，展開由 chevron 按鈕控制；不可勾選時點擊整行切換展開。
- 有子節點時以 `CamelotExpanded` 做展開動畫並遞迴渲染 `CamelotInternalTreeNode`。
- chevron 圖示於展開時旋轉 90 度；節點 disabled 時降低不透明度並阻擋互動。

---
[🏠 Wiki](../index.md)

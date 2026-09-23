# TreeNode

## Summary

TreeNode（匯入名稱 `CamelotInternalTreeNode`）是 [Tree](./Tree.md) 樹狀結構的單一節點，屬內部元件。每列顯示展開箭頭、可選的勾選框與標籤，有子節點時遞迴渲染下一層；勾選、展開等狀態都由 Tree 注入的 context 管理，節點本身不存狀態。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `node` | `CamelotTreeNode` | — | 節點資料 |
| `level` | `number` | `0` | 層級深度，每層左側縮排 20px |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `node` | `{ node, level, isChecked, isExpanded }` | 自訂節點內容，預設顯示標籤；會遞迴轉給子節點 |

## 運作方式

### 點擊行為

| 模式 | 點整列 | 點箭頭 |
| :--- | :--- | :--- |
| 可勾選 | 切換勾選 | 切換展開 |
| 不可勾選 | 有子節點時切換展開 | 切換展開 |

兩種模式點整列時都會通知 Tree 的節點點擊處理；停用的節點半透明且不可點。

來源：1. [TreeNode.vue][]　2. [tree.ts][]

### 勾選框與標籤

1. 可勾選且未自訂 node 插槽時，標籤直接交給 [Checkbox](./Checkbox.md) 渲染，外觀與獨立的 Checkbox 一致。
2. 有自訂 node 插槽時，勾選框不帶標籤，後面接插槽內容。
3. 勾選框支援半選狀態，顏色跟隨 Tree 的色彩角色。

來源：1. [TreeNode.vue][]

### 展開

有子節點時左側顯示箭頭，展開時轉 90 度，子層以 [Expanded](./Expanded.md) 做展開動畫；沒有子節點時保留同寬的空位，讓標籤對齊。

node 插槽的型別需明確宣告：元件把自己的插槽遞迴轉給子節點，沒有宣告時 TypeScript 會循環推導而報錯。

來源：1. [TreeNode.vue][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| TreeNode.vue | [app/components/Camelot/Internal/TreeNode.vue](../../../../app/components/Camelot/Internal/TreeNode.vue) |
| tree.ts | [shared/types/tree.ts](../../../../shared/types/tree.ts) |

[TreeNode.vue]: #references
[tree.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

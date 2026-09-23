# Tree

## Summary

樹狀結構元件：遞迴渲染節點清單，支援展開與收合、以葉節點為準的勾選與父節點半選推導，以及自訂節點呈現。勾選框直接使用 Checkbox。匯入名稱為 `CamelotTree`（Nuxt 自動匯入）。

## 運作方式

### 節點資料

每個節點有顯示文字與唯一值，可另帶子節點、停用旗標與任意附帶資料。

來源：1. [tree.ts][]

### 勾選與展開狀態

1. 勾選清單只記錄葉節點的值。
2. 父節點的所有子孫葉節點都勾選時為勾選；部分勾選時為半選。
3. 勾選父節點時，若子孫葉節點尚未全選就全部勾選，否則全部取消。
4. 展開清單記錄已展開節點的值。
5. 開啟初始全部展開且展開清單為空時，掛載後展開所有含子節點的節點。

來源：1. [Tree.vue][]

### 點擊

1. 可勾選模式下，點整行、包含空白處，都會切換該節點的勾選；展開與收合只由左側箭頭按鈕負責。
2. 不可勾選時，點含子節點的行會展開或收合。
3. 兩種模式點擊後都會發出節點點擊事件。
4. 停用節點半透明且不回應點擊。

來源：1. [TreeNode.vue][]

### 勾選框與自訂節點

勾選框直接使用 [Checkbox](./Checkbox.md)，四種主題與半選狀態都和單獨使用時相同。

沒有提供 `node` 插槽時，節點文字交給 Checkbox 的 label 渲染，外觀與獨立的 Checkbox 一致。

提供 `node` 插槽時改成不帶 label 的勾選框加上自訂內容。Tree 在建立時偵測插槽是否存在，並透過注入的上下文告訴每個節點。

色彩角色以 getter 放進上下文，執行期改變色彩角色時，列內的勾選框會跟著換色。

每一行最低 40px，每深一層縮排 20px，勾選時不會造成版面位移。

來源：1. [Tree.vue][]　2. [TreeNode.vue][]

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `nodes` | `CamelotTreeNode[]` | — | 樹狀節點資料，必填。 |
| `checkable` | `boolean` | `false` | 是否顯示勾選框。 |
| `defaultExpandAll` | `boolean` | `false` | 初始展開全部節點。 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色。 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `nodeClick` | `(node: CamelotTreeNode)` | 點擊未停用的節點列時觸發。 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model:checked` | `(string \| number)[]` | 已勾選的葉節點值，預設 `[]`。 |
| `v-model:expanded` | `(string \| number)[]` | 已展開的節點值，預設 `[]`。 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `node` | `{ node, level, isChecked, isExpanded }` | 自訂單一節點的呈現，遞迴傳給所有子節點。 |

## 相關頁面

- [Checkbox](./Checkbox.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| tree.ts | [shared/types/tree.ts](../../../../shared/types/tree.ts) |
| Tree.vue | [app/components/Camelot/Tree.vue](../../../../app/components/Camelot/Tree.vue) |
| TreeNode.vue | [app/components/Camelot/Internal/TreeNode.vue](../../../../app/components/Camelot/Internal/TreeNode.vue) |

[tree.ts]: #references
[Tree.vue]: #references
[TreeNode.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

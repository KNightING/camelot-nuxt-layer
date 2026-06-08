/** Camelot Tree 節點資料結構 */
export interface CamelotTreeNode<T = unknown> {
  label: string
  value: string | number
  children?: CamelotTreeNode<T>[]
  disabled?: boolean
  data?: T
}

/** Tree 透過 provide/inject 傳給遞迴 TreeNode 的上下文 */
export interface CamelotTreeContext {
  checkable: boolean
  /** 消費端是否提供了自訂 node slot（決定預設標籤是否由 Checkbox 渲染） */
  hasNodeSlot: boolean
  isChecked: (node: CamelotTreeNode) => boolean
  isIndeterminate: (node: CamelotTreeNode) => boolean
  isExpanded: (node: CamelotTreeNode) => boolean
  toggleCheck: (node: CamelotTreeNode) => void
  toggleExpand: (node: CamelotTreeNode) => void
  onNodeClick: (node: CamelotTreeNode) => void
}

export const CAMELOT_TREE_KEY = 'camelotTree'

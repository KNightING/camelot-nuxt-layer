/** Camelot Menu 項目（可多階層巢狀） */
export interface CamelotMenuItem<T = unknown> {
  label: string
  value: string | number
  children?: CamelotMenuItem<T>[]
  disabled?: boolean
  data?: T
}

/** Menu 透過 provide/inject 傳給遞迴 MenuItem 的上下文 */
export interface CamelotMenuContext {
  isActive: (value: string | number) => boolean
  /** 該節點的子孫中是否含有目前選中項（用於父節點僅變色、不上選中底色） */
  isActiveAncestor: (item: CamelotMenuItem) => boolean
  isExpanded: (item: CamelotMenuItem) => boolean
  toggleExpand: (item: CamelotMenuItem) => void
  select: (item: CamelotMenuItem) => void
}

export const CAMELOT_MENU_KEY = 'camelotMenu'

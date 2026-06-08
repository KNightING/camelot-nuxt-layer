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
  isExpanded: (item: CamelotMenuItem) => boolean
  toggleExpand: (item: CamelotMenuItem) => void
  select: (item: CamelotMenuItem) => void
}

export const CAMELOT_MENU_KEY = 'camelotMenu'

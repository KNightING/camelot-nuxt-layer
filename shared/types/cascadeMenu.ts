/** Camelot CascadeMenu 項目（可無限階層巢狀，子選單向側邊飛出展開） */
export interface CamelotCascadeMenuItem<T = unknown> {
  label: string
  value: string | number
  /** 子選單項目；有值即視為含子層（列右側顯示 chevron） */
  children?: CamelotCascadeMenuItem<T>[]
  /** 停用該列（不可 hover/點選） */
  disabled?: boolean
  /** 渲染為分隔線（忽略其他欄位） */
  divider?: boolean
  /** 任意附帶資料，於 select 事件回傳 */
  data?: T
}

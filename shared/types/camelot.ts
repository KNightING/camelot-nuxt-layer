/**
 * Camelot 元件共用的色彩角色（對應 tailwind.css 內的 --color-{role} token）。
 * 集中宣告以避免在各元件重複定義相同 union。
 */
export type CamelotColorRole
  = | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'error'
    | 'info'
    | 'warning'
    | 'success'

/** RadioGroup / CheckboxGroup 的選項（disabled 為逐選項停用） */
export interface CamelotGroupOption {
  label: string
  value: string | number
  disabled?: boolean
}

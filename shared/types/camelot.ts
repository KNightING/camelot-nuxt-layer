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

/** Tag 外觀：solid 實心 / soft 柔色 / outline 外框 */
export type CamelotTagVariant = 'solid' | 'soft' | 'outline'

/**
 * TagGroup 的標籤項目（物件形式）。
 * color / variant 未指定時沿用 TagGroup 的群組預設，locked 為逐項鎖定不可刪除。
 */
export interface CamelotTagItem {
  label: string
  color?: CamelotColorRole
  variant?: CamelotTagVariant
  locked?: boolean
}

/** TagGroup v-model 的項目：純字串沿用群組預設，物件可逐項覆寫顏色 / variant / 鎖定 */
export type CamelotTagInput = string | CamelotTagItem

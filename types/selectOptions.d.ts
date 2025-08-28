export type SelectOptions<T> = SelectOption<T>[]
export interface SelectOption<T = string> {
  name: string
  value: string | number
  data?: T
  label?: string
  disable?: boolean
}

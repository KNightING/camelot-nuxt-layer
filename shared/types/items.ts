export type Items<T = string> = Item<T>[]

export interface Item<T = string> {
  key: string
  value: string | number | boolean
  label?: string
  data?: T
}

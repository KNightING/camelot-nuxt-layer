/** Camelot Table 欄位定義（T 為列資料型別） */
export interface CamelotTableColumn<T = Record<string, unknown>> {
  /** 對應 row 的欄位 key（也用於 head-${key} / cell-${key} slot 命名） */
  key: string
  /** 表頭標題 */
  title: string
  /** 欄寬（如 '120px'；固定欄建議明確指定以正確計算 sticky 位移） */
  width?: string
  /** 對齊 */
  align?: 'left' | 'center' | 'right'
  /** 固定欄：靠左或靠右 */
  fixed?: 'left' | 'right'
  /** 取值函式（覆寫預設的 row[key]），供巢狀/衍生欄位使用 */
  accessor?: (row: T) => unknown
}

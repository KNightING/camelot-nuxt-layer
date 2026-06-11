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

/** CascadeMenu 透過 provide/inject 傳給遞迴 CascadeMenuPanel 的上下文 */
export interface CamelotCascadeMenuContext {
  /** 子選單展開方式（根面板一律由觸發器點擊開啟） */
  submenuTrigger: 'hover' | 'click'
  /** hover 模式展開延遲 (ms) */
  openDelay: number
  /** hover 模式收合延遲 (ms) */
  closeDelay: number
  /** 浮層基底 z-index，實際層級 = baseZIndex + level */
  baseZIndex: number
  /** 單一面板選項區最大高度（CSS 長度，超過則內部捲動）；實際會再夾在視窗高度內 */
  maxHeight: string
  /**
   * 取得 CurrentColor 注入用的 literal class。
   * 因每層面板皆 Teleport 至 body，CSS 變數繼承會中斷，故需逐面板套用此 class。
   */
  roleColorClass: () => string
  /** 點選葉節點（無 children）→ 由根元件 emit 並依設定關閉 */
  select: (item: CamelotCascadeMenuItem) => void
  /** 關閉整個選單 */
  closeAll: () => void
  /** 面板掛載時註冊根元素（供 click-outside 判定，Teleport 後仍可追蹤） */
  registerPanel: (el: HTMLElement) => void
  /** 面板卸載時移除註冊 */
  unregisterPanel: (el: HTMLElement) => void
}

export const CAMELOT_CASCADE_MENU_KEY = 'camelotCascadeMenu'

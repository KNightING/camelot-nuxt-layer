/**
 * CascadeMenu 透過 provide/inject 傳給遞迴 CascadeMenuPanel 的上下文。
 * 內含 DOM 型別且僅在瀏覽器端運作，故置於 `app/`——`shared/` 的 TS project
 * 不載入 DOM lib（同時供 Nitro server 使用），放在那裡會使消費端 type check 失敗。
 */
export interface CamelotCascadeMenuContext {
  /** 子選單展開方式（根面板一律由觸發器點擊開啟） */
  submenuTrigger: 'hover' | 'click'
  /** hover 模式展開延遲 (ms) */
  openDelay: number
  /** hover 模式收合延遲 (ms) */
  closeDelay: number
  /**
   * 浮層基底 z-index，實際層級 = baseZIndex + level。
   * 未指定時回落到疊層刻度的 `--cml-z-popup`（見 wiki `features/layering.md`），
   * 以免在此重複硬編一次數值。
   */
  baseZIndex?: number
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

/** 上述 context 的 inject key；與 context 同進退，故一併置於此 */
export const CAMELOT_CASCADE_MENU_KEY = 'camelotCascadeMenu'

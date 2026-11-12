/** 事件與資源的識別值 */
export type CamelotSchedulerId = string | number

/**
 * Scheduler 的視圖：
 * - month 月、week 週、day 日
 * - resourceWeek 人員 × 一週（排班表）
 * - resourceDay 人員 × 一天的小時時間軸（排班表）
 */
export type CamelotSchedulerView = 'month' | 'week' | 'day' | 'resourceWeek' | 'resourceDay'

/** Scheduler 的事件；時間一律是使用者本地時間 */
export interface CamelotSchedulerEvent {
  id: CamelotSchedulerId
  title: string
  start: Date
  /** 結束時間，必須晚於 start */
  end: Date
  /** 所屬人員；排班視圖用它決定事件在哪一列 */
  resourceId?: CamelotSchedulerId
  /** 事件的色彩角色；未指定時用元件的 color */
  color?: CamelotColorRole
  /** 鎖定後不能拖移、調整長度或刪除 */
  locked?: boolean
}

/** 排班視圖的一列（人員、房間、設備等） */
export interface CamelotSchedulerResource {
  id: CamelotSchedulerId
  name: string
  /** 這一列事件的預設色彩角色 */
  color?: CamelotColorRole
}

/** Scheduler 所有顯示文字；預設繁體中文，消費端可整組覆蓋 */
export interface CamelotSchedulerLabels {
  today: string
  month: string
  week: string
  day: string
  resourceWeek: string
  resourceDay: string
  previous: string
  next: string
  newEvent: string
  editEvent: string
  title: string
  start: string
  end: string
  resource: string
  color: string
  save: string
  cancel: string
  delete: string
  noResource: string
  /** 月曆格放不下時的「還有 N 筆」，{count} 會換成數量 */
  more: string
  untitled: string
}

/** 重疊分欄的輸入：一段以分鐘表示的區間 */
export interface CamelotSchedulerRange {
  key: CamelotSchedulerId
  /** 起點（分鐘） */
  start: number
  /** 終點（分鐘），必須大於 start */
  end: number
}

/** 重疊分欄的結果：該區間在第幾欄、同一組重疊共有幾欄 */
export interface CamelotSchedulerColumnLayout {
  key: CamelotSchedulerId
  column: number
  columns: number
}

/** 拖移、調整長度、拖曳選取三種手勢 */
export type CamelotSchedulerDragMode = 'move' | 'resize' | 'create'

/** 手勢進行中的預覽 */
export interface CamelotSchedulerDraft {
  mode: CamelotSchedulerDragMode
  /** 預覽用的事件；create 模式的 id 是暫時值 */
  event: CamelotSchedulerEvent
}

/** 指標位置換算出來的時間點；排班視圖還會帶上指標所在的那一列 */
export interface CamelotSchedulerPoint {
  dateTime: Date
  resourceId?: CamelotSchedulerId
}

/**
 * 拖移的最小單位：
 * - minute 時間軸（週、日、人員 × 小時），可以換時間
 * - day 日期格（月、人員 × 週），只能換日，時間不變
 */
export type CamelotSchedulerGranularity = 'minute' | 'day'

/** 拖移控制器的設定；每個視圖提供自己的座標換算與回呼 */
export interface CamelotSchedulerDragOptions {
  /** 由螢幕座標換算成時間點；落在視圖外時回傳 null */
  locate: (clientX: number, clientY: number) => CamelotSchedulerPoint | null
  granularity: CamelotSchedulerGranularity
  /** 吸附單位（分鐘） */
  snapMinutes: () => number
  /** 點一下空白處新增的事件長度（分鐘） */
  defaultMinutes: () => number
  /** 唯讀時所有手勢都不啟動 */
  readonly: () => boolean
  /** 拖移或調整長度放開後 */
  onChange: (event: CamelotSchedulerEvent, previous: CamelotSchedulerEvent) => void
  /** 新增手勢完成（拖曳選取或點一下） */
  onCreate: (event: CamelotSchedulerEvent) => void
  /** 在事件上點一下（沒有拖移） */
  onOpen: (event: CamelotSchedulerEvent) => void
}

/** 一塊矩形區域（螢幕座標），用來判斷指標落在哪一格 */
export interface CamelotSchedulerRect {
  left: number
  top: number
  right: number
  bottom: number
}

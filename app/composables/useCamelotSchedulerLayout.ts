import {
  addDays,
  differenceInCalendarDays,
  startOfMonth,
  startOfWeek,
  startOfDay,
} from 'date-fns'

const MINUTES_PER_DAY = 24 * 60
const MONTH_GRID_DAYS = 42
const WEEK_DAYS = 7

/**
 * Scheduler 的純函式：重疊分欄、吸附、區間與位移運算。
 * 所有時間運算以整數分鐘進行，日期的加減走本地時間的日曆日，避開夏令時間造成的一小時誤差。
 */
export const useCamelotSchedulerLayout = () => {
  /** 把分鐘數吸附到 step 的倍數 */
  const snapMinutes = (minutes: number, step: number): number => Math.round(minutes / step) * step

  const minutesOfDay = (date: Date): number => date.getHours() * 60 + date.getMinutes()

  /** 某一天的第 minutes 分鐘；minutes 可以是 1440（隔天零點） */
  const dateAtMinutes = (day: Date, minutes: number): Date =>
    new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, minutes)

  /** 事件是否與某一天有交集（零長度事件以起點判斷） */
  const isEventOnDay = (event: CamelotSchedulerEvent, day: Date): boolean => {
    const dayStart = startOfDay(day)
    const dayEnd = addDays(dayStart, 1)
    if (event.end <= event.start) return event.start >= dayStart && event.start < dayEnd
    return event.start < dayEnd && event.end > dayStart
  }

  const eventsOnDay = (events: CamelotSchedulerEvent[], day: Date): CamelotSchedulerEvent[] =>
    events.filter(event => isEventOnDay(event, day))

  /** 事件在某一天內的區間（分鐘），跨日的部分裁到當天 0 到 1440 */
  const rangeInDay = (event: CamelotSchedulerEvent, day: Date): { start: number, end: number } => {
    const dayStart = startOfDay(day)
    const startsBefore = event.start < dayStart
    const endsAfter = differenceInCalendarDays(event.end, day) > 0
    return {
      start: startsBefore ? 0 : minutesOfDay(event.start),
      end: endsAfter ? MINUTES_PER_DAY : minutesOfDay(event.end),
    }
  }

  /**
   * 重疊分欄：同一時段的區間並排成欄。
   * 彼此連續重疊的區間成為一組，組內共用欄數，欄寬由呼叫端平分。
   */
  const layoutColumns = (ranges: CamelotSchedulerRange[]): CamelotSchedulerColumnLayout[] => {
    // 起點早的先排；起點相同時較長的先排，讓長事件佔左邊的欄
    const sorted = [...ranges].sort((a, b) => a.start - b.start || b.end - a.end)
    const result: CamelotSchedulerColumnLayout[] = []
    let cluster: CamelotSchedulerColumnLayout[] = []
    let columnEnds: number[] = []
    let clusterEnd = -Infinity

    const closeCluster = () => {
      const columns = columnEnds.length
      cluster.forEach((item) => {
        item.columns = columns
      })
      result.push(...cluster)
      cluster = []
      columnEnds = []
    }

    sorted.forEach((range) => {
      if (cluster.length > 0 && range.start >= clusterEnd) closeCluster()
      const freeColumn = columnEnds.findIndex(columnEnd => columnEnd <= range.start)
      const column = freeColumn === -1 ? columnEnds.length : freeColumn
      columnEnds[column] = range.end
      clusterEnd = Math.max(clusterEnd, range.end)
      cluster.push({
        key: range.key,
        column,
        columns: 1,
      })
    })
    if (cluster.length > 0) closeCluster()
    return result
  }

  /**
   * 找出離指標最近的格子：指標在某一格內就是那一格，落在格子外（拖出視圖）則取距離最近的。
   * rects 裡的 undefined 代表那一格還沒量到，會被略過；全部都沒有就回傳 -1。
   */
  const nearestRectIndex = (rects: (CamelotSchedulerRect | undefined)[], x: number, y: number): number => {
    let bestIndex = -1
    let bestDistance = Infinity
    rects.forEach((rect, index) => {
      if (!rect) return
      const dx = Math.max(rect.left - x, 0, x - rect.right)
      const dy = Math.max(rect.top - y, 0, y - rect.bottom)
      const distance = dx * dx + dy * dy
      if (distance < bestDistance) {
        bestDistance = distance
        bestIndex = index
      }
    })
    return bestIndex
  }

  /** 月視圖的 6 週 × 7 天（42 天），從包含月初的那一週開始 */
  const buildMonthGrid = (date: Date, weekStartsOn: 0 | 1): Date[] => {
    const gridStart = startOfWeek(startOfMonth(date), { weekStartsOn })
    return Array.from({ length: MONTH_GRID_DAYS }, (_, index) => addDays(gridStart, index))
  }

  const buildWeekDays = (date: Date, weekStartsOn: 0 | 1): Date[] => {
    const weekStart = startOfWeek(date, { weekStartsOn })
    return Array.from({ length: WEEK_DAYS }, (_, index) => addDays(weekStart, index))
  }

  /**
   * 把事件平移：先加整天、再加分鐘，用本地時間的日曆運算，長度（毫秒）維持不變。
   * resourceId 有傳（含 undefined 以外的值）才會換人員。
   */
  const shiftEvent = (
    event: CamelotSchedulerEvent,
    dayDelta: number,
    minuteDelta: number,
    resourceId?: CamelotSchedulerId,
  ): CamelotSchedulerEvent => {
    const duration = event.end.getTime() - event.start.getTime()
    const start = new Date(
      event.start.getFullYear(),
      event.start.getMonth(),
      event.start.getDate() + dayDelta,
      event.start.getHours(),
      event.start.getMinutes() + minuteDelta,
    )
    return {
      ...event,
      start,
      end: new Date(start.getTime() + duration),
      resourceId: resourceId ?? event.resourceId,
    }
  }

  /** 調整結束時間，長度不得小於 minimumMinutes */
  const resizeEventEnd = (event: CamelotSchedulerEvent, end: Date, minimumMinutes: number): CamelotSchedulerEvent => {
    const earliestEnd = new Date(event.start.getTime() + minimumMinutes * 60_000)
    return {
      ...event,
      end: end < earliestEnd ? earliestEnd : end,
    }
  }

  /** 由兩個端點得到「起點在前」的區間，長度至少一個吸附單位 */
  const rangeBetween = (a: Date, b: Date, stepMinutes: number): { start: Date, end: Date } => {
    const [start, rawEnd] = a <= b ? [a, b] : [b, a]
    const earliestEnd = new Date(start.getTime() + stepMinutes * 60_000)
    return {
      start,
      end: rawEnd < earliestEnd ? earliestEnd : rawEnd,
    }
  }

  return {
    minutesPerDay: MINUTES_PER_DAY,
    snapMinutes,
    minutesOfDay,
    dateAtMinutes,
    isEventOnDay,
    eventsOnDay,
    rangeInDay,
    layoutColumns,
    nearestRectIndex,
    buildMonthGrid,
    buildWeekDays,
    shiftEvent,
    resizeEventEnd,
    rangeBetween,
  }
}

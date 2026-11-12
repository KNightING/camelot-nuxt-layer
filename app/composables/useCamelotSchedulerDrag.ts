import { differenceInCalendarDays } from 'date-fns'

// 滑鼠移動超過這個距離（px）才算拖移，否則視為點一下
const DRAG_START_DISTANCE = 4
// 觸控要按住這麼久（毫秒）才進入拖移，之前的手指移動視為捲動
const TOUCH_HOLD_MS = 350
// 觸控在按住期間移動超過這個距離（px）就放棄，讓頁面捲動
const TOUCH_CANCEL_DISTANCE = 8
// 點一下日期格新增事件時的預設開始時間（分鐘，9:00）
const DEFAULT_DAY_START_MINUTES = 9 * 60
// 新增手勢進行中的暫時事件識別值
const DRAFT_EVENT_ID = '__camelot-scheduler-draft__'

interface DragSession {
  mode: CamelotSchedulerDragMode
  original: CamelotSchedulerEvent | null
  pointerId: number
  startX: number
  startY: number
  pickup: CamelotSchedulerPoint
  isTouch: boolean
  activated: boolean
  holdTimer: ReturnType<typeof setTimeout> | undefined
}

/**
 * Scheduler 的指標手勢：拖移事件、拖拉結束時間、在空白處拖曳選取。
 * 座標與時間的換算由各視圖的 locate 提供，本控制器只處理手勢的生命週期與預覽。
 */
export const useCamelotSchedulerDrag = (options: CamelotSchedulerDragOptions) => {
  const {
    snapMinutes,
    minutesOfDay,
    dateAtMinutes,
    shiftEvent,
    resizeEventEnd,
    rangeBetween,
  } = useCamelotSchedulerLayout()

  /** 手勢進行中的預覽；沒有手勢時是 null */
  const draft = ref<CamelotSchedulerDraft | null>(null)

  let session: DragSession | null = null

  const snapDateTime = (dateTime: Date): Date => {
    if (options.granularity === 'day') return dateAtMinutes(dateTime, 0)
    const snapped = snapMinutes(minutesOfDay(dateTime), options.snapMinutes())
    return dateAtMinutes(dateTime, snapped)
  }

  const buildDraft = (current: CamelotSchedulerPoint): CamelotSchedulerDraft | null => {
    if (!session) return null
    const currentTime = snapDateTime(current.dateTime)
    const pickupTime = snapDateTime(session.pickup.dateTime)

    if (session.mode === 'move' && session.original) {
      const dayDelta = differenceInCalendarDays(currentTime, pickupTime)
      const minuteDelta = options.granularity === 'day' ? 0 : minutesOfDay(currentTime) - minutesOfDay(pickupTime)
      return {
        mode: 'move',
        event: shiftEvent(session.original, dayDelta, minuteDelta, current.resourceId),
      }
    }
    if (session.mode === 'resize' && session.original) {
      return {
        mode: 'resize',
        event: resizeEventEnd(session.original, currentTime, options.snapMinutes()),
      }
    }
    const range = rangeBetween(pickupTime, currentTime, options.snapMinutes())
    return {
      mode: 'create',
      event: {
        id: DRAFT_EVENT_ID,
        title: '',
        start: range.start,
        end: range.end,
        resourceId: session.pickup.resourceId,
      },
    }
  }

  /** 點一下空白處：用預設長度新增 */
  const buildClickCreate = (pickup: CamelotSchedulerPoint): CamelotSchedulerEvent => {
    const snapped = snapDateTime(pickup.dateTime)
    const start = options.granularity === 'day' ? dateAtMinutes(snapped, DEFAULT_DAY_START_MINUTES) : snapped
    return {
      id: DRAFT_EVENT_ID,
      title: '',
      start,
      end: new Date(start.getTime() + options.defaultMinutes() * 60_000),
      resourceId: pickup.resourceId,
    }
  }

  const preventTouchScroll = (event: TouchEvent) => {
    if (event.cancelable) event.preventDefault()
  }

  const stopListening = () => {
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
    window.removeEventListener('pointercancel', onPointerCancel)
    window.removeEventListener('touchmove', preventTouchScroll)
  }

  const endSession = () => {
    if (session) clearTimeout(session.holdTimer)
    session = null
    draft.value = null
    stopListening()
  }

  const activate = () => {
    if (!session || session.activated) return
    session.activated = true
    // 進入拖移後擋掉觸控捲動；必須是非 passive 的監聽才擋得住
    if (session.isTouch) window.addEventListener('touchmove', preventTouchScroll, { passive: false })
  }

  const movedDistance = (event: PointerEvent): number =>
    session ? Math.hypot(event.clientX - session.startX, event.clientY - session.startY) : 0

  function onPointerMove(event: PointerEvent) {
    if (!session || event.pointerId !== session.pointerId) return
    if (!session.activated) {
      if (session.isTouch) {
        if (movedDistance(event) > TOUCH_CANCEL_DISTANCE) endSession()
        return
      }
      if (movedDistance(event) < DRAG_START_DISTANCE) return
      activate()
    }
    // 日期格的新增只支援點一下，不做拖曳選取
    if (session.mode === 'create' && options.granularity === 'day') return
    const current = options.locate(event.clientX, event.clientY)
    if (!current) return
    draft.value = buildDraft(current)
  }

  function onPointerUp(event: PointerEvent) {
    if (!session || event.pointerId !== session.pointerId) return
    const finished = session
    const finishedDraft = draft.value
    endSession()

    if (!finished.activated || !finishedDraft) {
      if (finished.mode === 'create') options.onCreate(buildClickCreate(finished.pickup))
      else if (finished.mode === 'move' && finished.original) options.onOpen(finished.original)
      return
    }
    if (finishedDraft.mode === 'create') options.onCreate(finishedDraft.event)
    else if (finished.original) options.onChange(finishedDraft.event, finished.original)
  }

  function onPointerCancel(event: PointerEvent) {
    if (!session || event.pointerId !== session.pointerId) return
    endSession()
  }

  const begin = (mode: CamelotSchedulerDragMode, original: CamelotSchedulerEvent | null, event: PointerEvent) => {
    if (options.readonly() || session) return
    if (original?.locked && mode !== 'move') return
    if (original?.locked) {
      // 鎖定的事件不能拖，但點一下還是可以開啟
      options.onOpen(original)
      return
    }
    const pickup = options.locate(event.clientX, event.clientY)
    if (!pickup) return
    if (event.pointerType === 'mouse') event.preventDefault()

    const isTouch = event.pointerType === 'touch'
    session = {
      mode,
      original,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      pickup,
      isTouch,
      activated: false,
      holdTimer: isTouch ? setTimeout(activate, TOUCH_HOLD_MS) : undefined,
    }
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerCancel)
  }

  const startMove = (original: CamelotSchedulerEvent, event: PointerEvent) => begin('move', original, event)

  const startResize = (original: CamelotSchedulerEvent, event: PointerEvent) => begin('resize', original, event)

  const startCreate = (event: PointerEvent) => begin('create', null, event)

  /** 把預覽套進事件清單：被拖的事件換成預覽版，新增手勢則多一筆暫時事件 */
  const applyDraft = (events: CamelotSchedulerEvent[]): CamelotSchedulerEvent[] => {
    const current = draft.value
    if (!current) return events
    if (current.mode === 'create') return [...events, current.event]
    return events.map(item => (item.id === current.event.id ? current.event : item))
  }

  /** 這筆事件目前是不是手勢的預覽 */
  const isDraftEvent = (event: CamelotSchedulerEvent): boolean =>
    draft.value !== null && draft.value.event.id === event.id

  onBeforeUnmount(endSession)

  return {
    draft,
    startMove,
    startResize,
    startCreate,
    applyDraft,
    isDraftEvent,
  }
}

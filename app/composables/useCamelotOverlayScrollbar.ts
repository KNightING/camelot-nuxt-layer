export type CamelotScrollbarOrientation = 'horizontal' | 'vertical'

/** thumb 最小尺寸（px），避免內容極多時 thumb 太小難以抓取 */
const MIN_THUMB_SIZE = 40

/** 主軸兩端內縮（px）：捲軸不貼齊起訖邊界 */
const MAIN_INSET = 6

/** 交叉軸內縮（px）：水平→距容器底；垂直→距容器右 */
const CROSS_INSET = 2

/** 水平浮動時距視窗底的間距（px） */
const VIEWPORT_GAP = 6

/**
 * 自訂 overlay 捲軸核心（方向感知）：附著在既有捲動容器上，量測幾何、產生 track/thumb/bar 樣式、
 * 處理拖曳與 hover。水平支援 docking（貼容器底）/floating（Teleport 至視窗底）；垂直恆 docked 於右側。
 *
 * 主軸（main）＝捲動方向：水平為 X（scrollLeft/scrollWidth/clientWidth），垂直為 Y（scrollTop/scrollHeight/clientHeight）。
 */
export const useCamelotOverlayScrollbar = (
  container: Readonly<ShallowRef<HTMLElement | null>>,
  orientation: () => CamelotScrollbarOrientation,
  // 是否啟用「浮動到視窗底」（僅水平有意義）
  floatingEnabled: () => boolean,
  // thumb 顏色（CSS 色彩運算式，如 var(--color-primary)）
  thumbColor: () => string = () => 'var(--cml-c-m3-on-surface)',
  // 主軸起點額外偏移（px）：例如垂直捲軸避開 sticky 表頭，從表頭下方開始
  mainStartInset: () => number = () => 0,
) => {
  const visible = ref(false)
  const floating = ref(false)
  const dragging = ref(false)
  const hovered = ref(false)

  const active = computed(() => dragging.value || hovered.value)
  const isHorizontal = () => orientation() === 'horizontal'

  // 量測值（沿主軸）
  const trackLength = ref(0)
  const mainScroll = ref(0)
  const mainSize = ref(0)
  const mainClient = ref(0)
  const floatMainStart = ref(0) // 水平浮動時的 left（rect.left + MAIN_INSET）

  const maxScroll = computed(() => Math.max(mainSize.value - mainClient.value, 0))

  const thumbSize = computed(() => {
    if (mainSize.value <= 0) return MIN_THUMB_SIZE
    const ratio = mainClient.value / mainSize.value
    return Math.max(trackLength.value * ratio, MIN_THUMB_SIZE)
  })

  const maxThumbOffset = computed(() => Math.max(trackLength.value - thumbSize.value, 0))

  const thumbOffset = computed(() => {
    if (maxScroll.value <= 0) return 0
    return (mainScroll.value / maxScroll.value) * maxThumbOffset.value
  })

  // track 定位（依方向與 docked/floating 態）；主軸起點加上 mainStartInset（如垂直避開表頭）
  const trackStyle = computed(() => {
    const startPad = mainStartInset() + MAIN_INSET
    if (isHorizontal()) {
      return floating.value
        ? {
            position: 'fixed' as const,
            left: `${floatMainStart.value}px`,
            width: `${trackLength.value}px`,
            bottom: `${VIEWPORT_GAP}px`,
          }
        : {
            position: 'absolute' as const,
            left: `${startPad}px`,
            right: `${MAIN_INSET}px`,
            bottom: `${CROSS_INSET}px`,
          }
    }
    // 垂直：恆 docked 於右側，top 自表頭下方起
    return {
      position: 'absolute' as const,
      top: `${startPad}px`,
      bottom: `${MAIN_INSET}px`,
      right: `${CROSS_INSET}px`,
    }
  })

  // thumb（命中區）：只放隨拖曳頻繁變動的定位與 cursor
  const thumbStyle = computed(() =>
    isHorizontal()
      ? {
          width: `${thumbSize.value}px`,
          transform: `translateX(${thumbOffset.value}px)`,
          cursor: dragging.value ? 'grabbing' : 'grab',
        }
      : {
          height: `${thumbSize.value}px`,
          transform: `translateY(${thumbOffset.value}px)`,
          cursor: dragging.value ? 'grabbing' : 'grab',
        },
  )

  // bar（視覺）：hover/拖曳放大（水平 scaleY 往上、垂直 scaleX 往右，origin 由 CSS 指定）；顏色/淡邊隨 active。
  // 與 thumb 定位拆開 → 拖曳期間此物件參照不變 → Vue 跳過 patch → CSS transition 不被重啟。
  const barStyle = computed(() => {
    const c = thumbColor()
    const scale = active.value ? 1 : 0.5
    return {
      transform: isHorizontal() ? `scaleY(${scale})` : `scaleX(${scale})`,
      backgroundColor: active.value ? c : `color-mix(in srgb, ${c} 55%, transparent)`,
      boxShadow: active.value
        ? `0 0 0 4px color-mix(in srgb, ${c} 20%, transparent)`
        : `0 0 0 2px color-mix(in srgb, ${c} 12%, transparent)`,
    }
  })

  const readMain = (el: HTMLElement) =>
    isHorizontal()
      ? { scroll: el.scrollLeft, size: el.scrollWidth, client: el.clientWidth }
      : { scroll: el.scrollTop, size: el.scrollHeight, client: el.clientHeight }

  const measure = () => {
    const el = container.value
    if (!el) {
      visible.value = false
      return
    }

    const m = readMain(el)
    // 無主軸溢出則不需要捲軸
    if (m.size <= m.client + 1) {
      visible.value = false
      return
    }

    // 容器完全在視窗外則不顯示
    const rect = el.getBoundingClientRect()
    const viewportBottom = window.innerHeight
    if (rect.bottom <= 0 || rect.top >= viewportBottom) {
      visible.value = false
      return
    }

    mainSize.value = m.size
    mainClient.value = m.client
    mainScroll.value = m.scroll
    trackLength.value = Math.max(m.client - mainStartInset() - 2 * MAIN_INSET, 0)

    // 僅水平：表格底被捲出視窗且啟用浮動 → 改浮動於視窗底
    const shouldFloat = isHorizontal() && floatingEnabled() && rect.bottom > viewportBottom
    floating.value = shouldFloat
    if (shouldFloat) floatMainStart.value = rect.left + MAIN_INSET

    visible.value = true
  }

  const onContainerScroll = () => {
    const el = container.value
    if (el) mainScroll.value = isHorizontal() ? el.scrollLeft : el.scrollTop
  }

  // 拖曳：以 pointer capture 讓 move/up 事件持續落在 thumb 上
  let dragStartPos = 0
  let dragStartScroll = 0

  const onThumbDown = (e: PointerEvent) => {
    const el = container.value
    if (!el) return
    dragging.value = true
    dragStartPos = isHorizontal() ? e.clientX : e.clientY
    dragStartScroll = isHorizontal() ? el.scrollLeft : el.scrollTop
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    e.preventDefault()
  }

  const onThumbMove = (e: PointerEvent) => {
    if (!dragging.value) return
    const el = container.value
    if (!el || maxThumbOffset.value <= 0) return
    const delta = (isHorizontal() ? e.clientX : e.clientY) - dragStartPos
    const next = dragStartScroll + (delta / maxThumbOffset.value) * maxScroll.value
    if (isHorizontal()) el.scrollLeft = next
    else el.scrollTop = next
    mainScroll.value = isHorizontal() ? el.scrollLeft : el.scrollTop
  }

  const onThumbUp = (e: PointerEvent) => {
    if (!dragging.value) return
    dragging.value = false
    ;(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId)
  }

  const onThumbEnter = () => {
    hovered.value = true
  }

  const onThumbLeave = () => {
    hovered.value = false
  }

  // window scroll 以 capture 監聽，才能收到任何祖先捲動容器（scroll 不冒泡）
  useEventListener(container, 'scroll', onContainerScroll, { passive: true })
  useEventListener(window, 'scroll', measure, { passive: true, capture: true })
  useEventListener(window, 'resize', measure)
  useResizeObserver(container, measure)

  watch([floatingEnabled, orientation, mainStartInset], measure)
  onMounted(() => nextTick(measure))

  return {
    visible,
    floating,
    trackStyle,
    thumbStyle,
    barStyle,
    onThumbDown,
    onThumbMove,
    onThumbUp,
    onThumbEnter,
    onThumbLeave,
  }
}

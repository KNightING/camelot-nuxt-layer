/** thumb 最小寬度（px），避免內容極寬時 thumb 太小難以抓取 */
const MIN_THUMB_WIDTH = 40

/** 水平內縮（px）：docked/浮動兩態都讓捲軸不貼齊左右邊界 */
const H_INSET = 8

/** docked 時距容器底的內縮（px），配合圓角裁切留一點空間 */
const DOCK_BOTTOM = 4

/** 浮動時距視窗底的間距（px） */
const VIEWPORT_GAP = 6

/**
 * 表格水平捲軸（取代原生橫軸）：只要表格有水平溢出且在視窗內就顯示一條自訂、
 * 可 hover/拖曳的水平捲軸。
 * - **docked（預設）**：以 absolute 呈現在表格容器內底部（被圓角 overflow 裁切、左右內縮），
 *   像表格自己的捲軸；由呼叫端以 `<Teleport :disabled>` 保留在原位。
 * - **floating（floatingEnabled 為真且表格底被捲出視窗時）**：teleport 至 body 並 fixed 於視窗底，
 *   確保捲不到表格底時仍可操作。
 * 兩態共用同一元素 → 高度一致。
 */
export const useCamelotFloatingScrollbar = (
  container: Readonly<ShallowRef<HTMLElement | null>>,
  // 是否啟用「浮動到視窗底」行為（表格底出視窗時）。關閉時只保留 docked 捲軸。
  floatingEnabled: () => boolean,
  // thumb 顏色（CSS 色彩運算式，如 var(--color-primary)）。因浮動態 Teleport 至 body、
  // 取不到元件內的 --cml-color-current-color，故由呼叫端傳入解析後的顏色。
  thumbColor: () => string = () => 'var(--cml-c-m3-on-surface)',
) => {
  const visible = ref(false)
  const floating = ref(false)
  const dragging = ref(false)
  const hovered = ref(false)

  // hover 或拖曳時 thumb 變粗、顏色加深
  const active = computed(() => dragging.value || hovered.value)

  // 量測值（隨 scroll / resize 更新）
  const trackWidth = ref(0)
  const floatLeft = ref(0)
  const scrollWidth = ref(0)
  const clientWidth = ref(0)
  const scrollLeft = ref(0)

  const maxScroll = computed(() => Math.max(scrollWidth.value - clientWidth.value, 0))

  const thumbWidth = computed(() => {
    if (scrollWidth.value <= 0) return MIN_THUMB_WIDTH
    const ratio = clientWidth.value / scrollWidth.value
    return Math.max(trackWidth.value * ratio, MIN_THUMB_WIDTH)
  })

  const maxThumbOffset = computed(() => Math.max(trackWidth.value - thumbWidth.value, 0))

  const thumbOffset = computed(() => {
    if (maxScroll.value <= 0) return 0
    return (scrollLeft.value / maxScroll.value) * maxThumbOffset.value
  })

  // 軌道定位：docked → 容器內 absolute（左右/底內縮，被圓角裁切）；floating → fixed 於視窗底
  const trackStyle = computed(() =>
    floating.value
      ? {
          position: 'fixed' as const,
          left: `${floatLeft.value}px`,
          width: `${trackWidth.value}px`,
          bottom: `${VIEWPORT_GAP}px`,
        }
      : {
          position: 'absolute' as const,
          left: `${H_INSET}px`,
          right: `${H_INSET}px`,
          bottom: `${DOCK_BOTTOM}px`,
        },
  )

  // thumb（父層，命中區）：只放會隨拖曳頻繁變動的定位與 cursor。
  const thumbStyle = computed(() => ({
    width: `${thumbWidth.value}px`,
    transform: `translateX(${thumbOffset.value}px)`,
    cursor: dragging.value ? 'grabbing' : 'grab',
  }))

  // bar（子層，視覺）：放大以 transform: scaleY 動畫（height transition 在此環境會卡住；
  // transform 為 compositor 友善且穩定）。bar 固定 12px，idle 縮為 scaleY(0.5)=視覺 6px，
  // active 放大為 scaleY(1)=12px；淡邊(box-shadow)隨 transform 一起放大。顏色亦隨 active 加深。
  const barStyle = computed(() => {
    const c = thumbColor()
    return {
      transform: active.value ? 'scaleY(1)' : 'scaleY(0.5)',
      backgroundColor: active.value ? c : `color-mix(in srgb, ${c} 55%, transparent)`,
      boxShadow: active.value
        ? `0 0 0 4px color-mix(in srgb, ${c} 20%, transparent)`
        : `0 0 0 2px color-mix(in srgb, ${c} 12%, transparent)`,
    }
  })

  const measure = () => {
    const el = container.value
    if (!el) {
      visible.value = false
      return
    }

    // 無水平溢出則不需要捲軸
    if (el.scrollWidth <= el.clientWidth + 1) {
      visible.value = false
      return
    }

    // 表格完全在視窗外則不顯示
    const rect = el.getBoundingClientRect()
    const viewportBottom = window.innerHeight
    if (rect.bottom <= 0 || rect.top >= viewportBottom) {
      visible.value = false
      return
    }

    clientWidth.value = el.clientWidth
    scrollWidth.value = el.scrollWidth
    scrollLeft.value = el.scrollLeft
    // 可用軌道寬 = 容器可視寬扣掉左右內縮
    trackWidth.value = Math.max(el.clientWidth - 2 * H_INSET, 0)

    // 表格底被捲出視窗、且啟用浮動 → 改浮動於視窗底；否則維持 docked（容器內）
    const shouldFloat = floatingEnabled() && rect.bottom > viewportBottom
    floating.value = shouldFloat
    if (shouldFloat) floatLeft.value = rect.left + H_INSET

    visible.value = true
  }

  // 容器捲動 → 同步 thumb 位置（水平捲動不影響幾何，只需更新 scrollLeft）
  const onContainerScroll = () => {
    const el = container.value
    if (el) scrollLeft.value = el.scrollLeft
  }

  // 拖曳：以 pointer capture 讓 move/up 事件持續落在 thumb 上
  let dragStartX = 0
  let dragStartScrollLeft = 0

  const onThumbDown = (e: PointerEvent) => {
    const el = container.value
    if (!el) return
    dragging.value = true
    dragStartX = e.clientX
    dragStartScrollLeft = el.scrollLeft
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    e.preventDefault()
  }

  const onThumbMove = (e: PointerEvent) => {
    if (!dragging.value) return
    const el = container.value
    if (!el || maxThumbOffset.value <= 0) return
    const delta = e.clientX - dragStartX
    el.scrollLeft = dragStartScrollLeft + (delta / maxThumbOffset.value) * maxScroll.value
    scrollLeft.value = el.scrollLeft
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

  watch(floatingEnabled, measure)
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

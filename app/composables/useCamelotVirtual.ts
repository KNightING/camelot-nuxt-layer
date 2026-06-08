import type { MaybeRefOrGetter, Ref } from 'vue'

/**
 * 可變列高的虛擬視窗計算（vue-virtual-scroller 風格：量測後快取列高）。
 *
 * 不要求固定列高：先以 estimate 估高，渲染後由呼叫端透過 setSize() 回報實際尺寸，
 * 逐步修正 offset 與可視範圍。回傳 spacer 前後留白（topPad/bottomPad）讓呼叫端
 * 以「前後撐高 + 中間實渲染」方式虛擬化（div 或 table spacer-row 皆適用）。
 *
 * @param scrollEl 捲動容器
 * @param count    項目總數
 * @param estimate 預估單項尺寸（px）
 * @param options.overscan 視窗前後多渲染的項目數（預設 4）
 * @param options.horizontal 水平模式（以 width 計）
 * @param options.headerOffset 虛擬項目開始前、在捲動內容中的固定偏移（如 table 的 sticky header + pinned 列高）
 */
export const useCamelotVirtual = (
  scrollEl: Ref<HTMLElement | null | undefined>,
  count: MaybeRefOrGetter<number>,
  estimate: MaybeRefOrGetter<number>,
  options: {
    overscan?: MaybeRefOrGetter<number>
    horizontal?: MaybeRefOrGetter<boolean>
    headerOffset?: MaybeRefOrGetter<number>
  } = {},
) => {
  const sizes = ref<number[]>([])
  const scrollOffset = ref(0)
  const viewport = ref(0)

  // 維持 sizes 長度與 count 一致（新項目以 estimate 填入）
  watchEffect(() => {
    const n = toValue(count)
    const est = toValue(estimate)
    const arr = sizes.value
    if (arr.length < n) {
      for (let i = arr.length; i < n; i++) arr.push(est)
      sizes.value = arr.slice()
    }
    else if (arr.length > n) {
      arr.length = n
      sizes.value = arr.slice()
    }
  })

  // 前綴和：offsets[i] = 第 i 項在虛擬區內的起始位置
  const offsets = computed(() => {
    const arr = sizes.value
    const out = new Array<number>(arr.length + 1)
    out[0] = 0
    for (let i = 0; i < arr.length; i++) out[i + 1] = out[i] + (arr[i] || 0)
    return out
  })

  const totalSize = computed(() => offsets.value[offsets.value.length - 1] ?? 0)

  // 二分搜尋：找出第一個 offsets[i+1] > target 的 i
  const findIndex = (target: number) => {
    const o = offsets.value
    let lo = 0
    let hi = o.length - 1
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if ((o[mid + 1] ?? 0) <= target) lo = mid + 1
      else hi = mid
    }
    return lo
  }

  const range = computed(() => {
    const n = toValue(count)
    if (n === 0) return {
      start: 0,
      end: 0,
    }
    const over = toValue(options.overscan) ?? 4
    const head = toValue(options.headerOffset) ?? 0
    const top = scrollOffset.value - head
    const bottom = top + viewport.value
    const start = Math.max(0, findIndex(top) - over)
    const end = Math.min(n, findIndex(bottom) + 1 + over)
    return {
      start,
      end,
    }
  })

  const topPad = computed(() => offsets.value[range.value.start] ?? 0)
  const bottomPad = computed(() => Math.max(0, totalSize.value - (offsets.value[range.value.end] ?? 0)))

  const visibleIndices = computed(() => {
    const {
      start, end,
    } = range.value
    const out: number[] = []
    for (let i = start; i < end; i++) out.push(i)
    return out
  })

  const readScroll = () => {
    const el = scrollEl.value
    if (!el) return
    const horizontal = toValue(options.horizontal)
    scrollOffset.value = horizontal ? el.scrollLeft : el.scrollTop
    viewport.value = horizontal ? el.clientWidth : el.clientHeight
  }

  // 呼叫端在每個渲染項回報實際尺寸
  const setSize = (index: number, size: number) => {
    if (size > 0 && sizes.value[index] !== size) {
      const next = sizes.value.slice()
      next[index] = size
      sizes.value = next
    }
  }

  const scrollToIndex = (index: number) => {
    const el = scrollEl.value
    if (!el) return
    const head = toValue(options.headerOffset) ?? 0
    const pos = (offsets.value[index] ?? 0) + head
    if (toValue(options.horizontal)) el.scrollLeft = pos
    else el.scrollTop = pos
  }

  let ro: ResizeObserver | null = null
  watch(scrollEl, (el, _old, onCleanup) => {
    if (!el || typeof window === 'undefined') return
    readScroll()
    el.addEventListener('scroll', readScroll, { passive: true })
    ro = new ResizeObserver(readScroll)
    ro.observe(el)
    onCleanup(() => {
      el.removeEventListener('scroll', readScroll)
      ro?.disconnect()
      ro = null
    })
  }, { immediate: true })

  return {
    range,
    visibleIndices,
    topPad,
    bottomPad,
    totalSize,
    setSize,
    scrollToIndex,
    readScroll,
  }
}

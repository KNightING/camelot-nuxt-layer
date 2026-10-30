/**
 * 瀏覽器是否支援 CSS Anchor Positioning（`anchor-name` / `position-anchor` / `anchor()`）。
 *
 * 浮層原本以 JS 每幀量測 target 再寫入 fixed 座標，捲動由合成器先走，浮層會晚一到數幀才跟上；
 * 支援時改由瀏覽器原生同步定位，不支援才退回 JS 量測。SSR 沒有 CSS 物件，一律視為不支援。
 */
export const isCssAnchorSupported = () => {
  if (typeof CSS === 'undefined' || typeof CSS.supports !== 'function') {
    return false
  }
  return CSS.supports('anchor-name', '--camelot-anchor-probe')
}

/** `<dashed-ident>` 只允許英數、底線、連字號；`useId` 的輸出可能含冒號等字元 */
export const createAnchorName = (id: string) => {
  return `--camelot-anchor-${id.replace(/[^a-zA-Z0-9_-]/g, '')}`
}

/**
 * 為一個浮層實例建立唯一的 anchor 名稱與支援狀態，供 PopupV2、Tooltip、CascadeMenu 共用，
 * 不要各自實作偵測。
 *
 * `supported` 於 onMounted 才偵測：SSR 與 hydration 首幀一律走退回路徑，避免兩端輸出不一致。
 */
export const useCamelotAnchor = () => {
  const name = createAnchorName(useId())
  const supported = ref(false)

  onMounted(() => {
    supported.value = isCssAnchorSupported()
  })

  /** 套在 target 元素上，把它登記為 anchor；不支援時為空 */
  const targetStyle = computed(() => {
    return supported.value ? { anchorName: name } : undefined
  })

  /** 套在浮層元素上，指向 target 並在 target 被捲出可視範圍時一併隱藏 */
  const floatingStyle = computed(() => {
    return supported.value
      ? {
          positionAnchor: name,
          positionVisibility: 'anchors-visible',
        }
      : undefined
  })

  return {
    name,
    supported,
    targetStyle,
    floatingStyle,
  }
}

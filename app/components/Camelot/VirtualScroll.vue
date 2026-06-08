<template>
  <div
    ref="scrollEl"
    class="cml-virtual-scroll relative overflow-auto"
    :style="rootStyle"
  >
    <div :class="horizontal ? 'flex flex-row' : 'flex flex-col'">
      <div
        aria-hidden="true"
        :style="padStyle(topPad)"
      />
      <div
        v-for="i in visibleIndices"
        :key="keyFor(i)"
        :data-vindex="i"
        :class="horizontal ? 'shrink-0' : ''"
      >
        <slot
          :item="items[i]"
          :index="i"
        />
      </div>
      <div
        aria-hidden="true"
        :style="padStyle(bottomPad)"
      />
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
const props = withDefaults(
  defineProps<{
    items: T[]
    /** 每項唯一鍵：欄位名或取值函式（預設用索引） */
    itemKey?: string | ((item: T, index: number) => string | number)
    /** 預估單項尺寸（px），用於尚未量測的項目 */
    estimatedItemSize?: number
    /** 視窗前後多渲染的項目數 */
    overscan?: number
    /** 水平虛擬滾動 */
    horizontal?: boolean
    /** 固定高度（如 '320px'） */
    height?: string
    /** 最大高度（內容不足時自適應） */
    maxHeight?: string
  }>(),
  {
    estimatedItemSize: 44,
    overscan: 4,
    horizontal: false,
  },
)

const scrollEl = useTemplateRef<HTMLElement>('scrollEl')

const {
  visibleIndices, topPad, bottomPad, totalSize, setSize, scrollToIndex, readScroll,
} = useCamelotVirtual(
  scrollEl,
  () => props.items.length,
  () => props.estimatedItemSize,
  {
    overscan: () => props.overscan,
    horizontal: () => props.horizontal,
  },
)

const rootStyle = computed(() => ({
  height: props.height,
  maxHeight: props.maxHeight,
}))

const padStyle = (pad: number) =>
  props.horizontal
    ? {
        width: `${pad}px`,
        flexShrink: 0,
      }
    : { height: `${pad}px` }

const keyFor = (index: number) => {
  const item = props.items[index]
  if (typeof props.itemKey === 'function') return props.itemKey(item as T, index)
  if (props.itemKey && item && typeof item === 'object') {
    return (item as Record<string, unknown>)[props.itemKey] as string | number
  }
  return index
}

// 量測每個已渲染項的實際尺寸並回報，修正可視範圍
let ro: ResizeObserver | null = null

const measure = (el: Element) => {
  const idx = Number((el as HTMLElement).dataset.vindex)
  if (Number.isNaN(idx)) return
  const size = props.horizontal ? (el as HTMLElement).offsetWidth : (el as HTMLElement).offsetHeight
  setSize(idx, size)
}

const measureAll = () => {
  const root = scrollEl.value
  if (!root) return
  for (const el of root.querySelectorAll('[data-vindex]')) {
    measure(el)
    ro?.observe(el)
  }
}

onMounted(() => {
  if (typeof window === 'undefined') return
  ro = new ResizeObserver((entries) => {
    for (const e of entries) measure(e.target)
  })
  nextTick(measureAll)
})

watch(visibleIndices, () => nextTick(measureAll))
watch(() => props.items, () => nextTick(() => {
  readScroll()
  measureAll()
}), { deep: false })

onBeforeUnmount(() => {
  ro?.disconnect()
  ro = null
})

defineExpose({ scrollToIndex })
</script>

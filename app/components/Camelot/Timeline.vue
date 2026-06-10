<template>
  <div
    class="cml-timeline"
    :class="[roleColorClass, isHorizontal ? 'flex flex-row items-stretch' : 'flex flex-col']"
  >
    <div
      v-for="(item, i) in items"
      :key="item.key ?? i"
      :ref="(el) => setItemRef(el, i)"
      class="cml-tl-item grid transition-all duration-500 ease-out"
      :class="[
        isHorizontal ? 'flex-1 min-w-[140px]' : '',
        animate ? (shown.has(i) ? 'opacity-100 translate-x-0 translate-y-0' : enterClass) : '',
      ]"
      :style="gridStyle"
    >
      <!-- content BEFORE node (vertical: left / horizontal: top) -->
      <div
        v-if="sideFor(i) === 'before'"
        class="cml-tl-content"
        :class="contentClass(i, 'before')"
      >
        <slot
          name="title"
          :item="item"
          :index="i"
        >
          <div
            v-if="item.title"
            class="font-semibold text-on-surface"
          >
            {{ item.title }}
          </div>
        </slot>
        <slot
          name="content"
          :item="item"
          :index="i"
        >
          <div
            v-if="item.content"
            class="text-sm text-on-surface-variant"
          >
            {{ item.content }}
          </div>
          <img
            v-if="item.image"
            :src="item.image"
            :alt="item.title ?? ''"
            class="mt-2 max-w-full w-[200px] rounded-lg border border-outline-variant object-cover"
            :class="{ 'ml-auto': !isHorizontal && sideFor(i) === 'before', 'mx-auto': isHorizontal }"
          >
        </slot>
      </div>

      <!-- axis: node + connector（alternate 垂直時固定置中欄，避免被推到左側） -->
      <div
        class="cml-tl-axis relative flex shrink-0 items-center"
        :class="[
          isHorizontal ? 'flex-row h-9 w-full justify-center' : 'flex-col w-9 self-stretch justify-start pt-1.5',
          side === 'alternate' ? (isHorizontal ? 'row-start-2' : 'col-start-2') : '',
        ]"
      >
        <!-- connector（垂直改上下兩段，列高不一仍連續；圓點 pt-1.5 對齊標題行高中心 12px） -->
        <template v-if="isHorizontal">
          <span
            v-if="i < items.length - 1"
            class="absolute top-1/2 left-1/2 right-[-50%] h-px -translate-y-1/2 bg-outline-variant"
          />
        </template>
        <template v-else>
          <span
            v-if="i > 0"
            class="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-outline-variant"
          />
          <span
            v-if="i < items.length - 1"
            class="absolute left-1/2 top-3 bottom-0 w-px -translate-x-1/2 bg-outline-variant"
          />
        </template>
        <slot
          name="node"
          :item="item"
          :index="i"
        >
          <span
            class="relative z-[1] block h-3 w-3 rounded-full ring-4 ring-surface"
            :class="themeMode === 'scifi'
              ? 'bg-[var(--cml-color-current-color)] shadow-[0_0_8px_var(--cml-color-current-color)]'
              : 'bg-[var(--cml-color-current-color)]'"
          />
        </slot>
      </div>

      <!-- content AFTER node (vertical: right / horizontal: bottom) -->
      <div
        v-if="sideFor(i) === 'after'"
        class="cml-tl-content"
        :class="contentClass(i, 'after')"
      >
        <slot
          name="title"
          :item="item"
          :index="i"
        >
          <div
            v-if="item.title"
            class="font-semibold text-on-surface"
          >
            {{ item.title }}
          </div>
        </slot>
        <slot
          name="content"
          :item="item"
          :index="i"
        >
          <div
            v-if="item.content"
            class="text-sm text-on-surface-variant"
          >
            {{ item.content }}
          </div>
          <img
            v-if="item.image"
            :src="item.image"
            :alt="item.title ?? ''"
            class="mt-2 max-w-full w-[200px] rounded-lg border border-outline-variant object-cover"
            :class="{ 'ml-auto': !isHorizontal && sideFor(i) === 'before', 'mx-auto': isHorizontal }"
          >
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TimelineItem {
  title?: string
  content?: string
  /** 內容圖片網址（渲染於文字下方，自訂 #content slot 時不套用） */
  image?: string
  key?: string | number
}

const props = withDefaults(
  defineProps<{
    items: TimelineItem[]
    direction?: 'vertical' | 'horizontal'
    /** 內容位置：vertical → before=左/after=右；horizontal → before=上/after=下；alternate 交錯 */
    side?: 'before' | 'after' | 'alternate'
    color?: CamelotColorRole
    /** 捲動逐一淡入 */
    animate?: boolean
  }>(),
  {
    direction: 'vertical',
    side: 'after',
    color: 'primary',
    animate: false,
  },
)

const { themeMode } = useCamelotTheme()
const roleColorClass = useCamelotRoleColorClass(() => props.color)

const isHorizontal = computed(() => props.direction === 'horizontal')

const sideFor = (i: number): 'before' | 'after' => {
  if (props.side === 'alternate') return i % 2 === 0 ? 'after' : 'before'
  return props.side
}

// 軸線固定軌道：alternate 用三軌（軸線置中）；單側用兩軌（軸線靠邊）。
// 垂直 → 欄(grid-cols)；水平 → 列(grid-rows)，確保節點/線恆在同一水平或垂直線上。
const tracks = computed(() => {
  if (props.side === 'alternate') return '1fr auto 1fr'
  return props.side === 'before' ? '1fr auto' : 'auto 1fr'
})
const gridStyle = computed(() =>
  isHorizontal.value
    ? { gridTemplateRows: tracks.value }
    : { gridTemplateColumns: tracks.value },
)

const contentClass = (i: number, slotSide: 'before' | 'after') => {
  const pad = isHorizontal.value
    ? (slotSide === 'before' ? 'pb-2 text-center' : 'pt-2 text-center')
    : (slotSide === 'before' ? 'pr-4 pb-6 text-right' : 'pl-4 pb-6')
  // alternate：把內容固定到對應的首/末軌（垂直=欄、水平=列）
  let track = ''
  if (props.side === 'alternate') {
    if (isHorizontal.value) track = slotSide === 'before' ? 'row-start-1' : 'row-start-3'
    else track = slotSide === 'before' ? 'col-start-1' : 'col-start-3'
  }
  return [pad, track]
}

// 捲動淡入
const shown = ref(new Set<number>())
const enterClass = computed(() =>
  isHorizontal.value ? 'opacity-0 translate-y-3' : (props.side === 'before' ? 'opacity-0 -translate-x-3' : 'opacity-0 translate-x-3'),
)

const itemEls: (HTMLElement | null)[] = []
const setItemRef = (el: object | null, i: number) => {
  itemEls[i] = el as HTMLElement | null
}

let io: IntersectionObserver | null = null
onMounted(() => {
  if (!props.animate || typeof window === 'undefined') {
    props.items.forEach((_, i) => shown.value.add(i))
    return
  }
  io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        const i = itemEls.indexOf(e.target as HTMLElement)
        if (i >= 0) {
          shown.value = new Set(shown.value).add(i)
          io?.unobserve(e.target)
        }
      }
    }
  }, { threshold: 0.2 })
  nextTick(() => itemEls.forEach(el => el && io?.observe(el)))
})
onBeforeUnmount(() => io?.disconnect())
</script>

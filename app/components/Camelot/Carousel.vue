<template>
  <div
    class="cml-carousel relative select-none isolate"
    :class="roleColorClass"
    :style="{ height, touchAction: isVertical ? 'pan-x' : 'pan-y' }"
    @pointerenter="hovered = true"
    @pointerleave="hovered = false"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerEnd"
    @pointercancel="onPointerEnd"
  >
    <!-- Viewport -->
    <div
      class="absolute inset-0 overflow-hidden"
      :style="effect === 'coverflow' || effect === 'flip' ? { perspective: '1200px' } : undefined"
    >
      <div
        v-for="(item, i) in items"
        v-show="isVisible(i)"
        :key="keyFor(i)"
        class="absolute top-1/2 left-1/2"
        :style="slideStyle(i)"
      >
        <div
          class="h-full w-full"
          :style="effect === 'flip' ? { backfaceVisibility: 'hidden' } : undefined"
        >
          <slot
            :item="item"
            :index="i"
            :is-active="i === current"
          >
            {{ item }}
          </slot>
        </div>
      </div>
    </div>

    <!--
      Arrows：定位交給外層 .cml-arrow-anchor，內容可用 #prev / #next slot 整顆換掉。
      slot 只負責長相與觸發，不必重寫定位；要完全移除請用 :show-arrows="false"。
    -->
    <template v-if="showArrows && items.length > 1">
      <div
        class="cml-arrow-anchor"
        :class="direction === 'vertical' ? 'top-2 left-1/2 -translate-x-1/2' : 'top-1/2 left-2 -translate-y-1/2'"
      >
        <slot
          name="prev"
          :prev="prev"
          :next="next"
          :go="go"
          :current="current"
          :total="items.length"
          :disabled="atStart"
        >
          <button
            type="button"
            class="cml-arrow"
            :class="[arrowClass, direction === 'vertical' ? 'rotate-90' : '']"
            aria-label="previous"
            @click="prev"
          >
            <IMaterialSymbolsChevronLeftRounded class="h-6 w-6" />
          </button>
        </slot>
      </div>
      <div
        class="cml-arrow-anchor"
        :class="direction === 'vertical' ? 'bottom-2 left-1/2 -translate-x-1/2' : 'top-1/2 right-2 -translate-y-1/2'"
      >
        <slot
          name="next"
          :prev="prev"
          :next="next"
          :go="go"
          :current="current"
          :total="items.length"
          :disabled="atEnd"
        >
          <button
            type="button"
            class="cml-arrow"
            :class="[arrowClass, direction === 'vertical' ? 'rotate-90' : '']"
            aria-label="next"
            @click="next"
          >
            <IMaterialSymbolsChevronRightRounded class="h-6 w-6" />
          </button>
        </slot>
      </div>
    </template>

    <!-- Dots（獨立 CamelotCarouselIndicator，可 slot 自訂、支援垂直排列） -->
    <CamelotCarouselIndicator
      v-if="showDots && items.length > 1"
      :model-value="current"
      :total="items.length"
      :direction="direction"
      :color="color"
      class="absolute z-[150]"
      :class="direction === 'vertical' ? 'top-1/2 right-3 -translate-y-1/2' : 'bottom-3 left-1/2 -translate-x-1/2'"
      @update:model-value="go"
    >
      <template
        v-if="$slots.dot"
        #dot="scope"
      >
        <slot
          name="dot"
          v-bind="scope"
        />
      </template>
    </CamelotCarouselIndicator>
  </div>
</template>

<script setup lang="ts" generic="T">
import IMaterialSymbolsChevronLeftRounded from '~icons/material-symbols/chevron-left-rounded'
import IMaterialSymbolsChevronRightRounded from '~icons/material-symbols/chevron-right-rounded'

const props = withDefaults(
  defineProps<{
    items: T[]
    itemKey?: string | ((item: T, index: number) => string | number)
    direction?: 'horizontal' | 'vertical'
    effect?: 'slide' | 'fade' | 'zoom' | 'coverflow' | 'cardStack' | 'flip'
    loop?: boolean
    autoplay?: boolean
    interval?: number
    pauseOnHover?: boolean
    /** slide/coverflow/zoom 模式下，當前項前後各顯示幾個鄰項 */
    peek?: number
    /** 相鄰項間距（px，slide 模式以內距實作，不破壞比例） */
    gap?: number
    duration?: number
    showArrows?: boolean
    showDots?: boolean
    height?: string
    color?: CamelotColorRole
  }>(),
  {
    direction: 'horizontal',
    effect: 'slide',
    loop: false,
    autoplay: false,
    interval: 4000,
    pauseOnHover: true,
    peek: 0,
    gap: 0,
    duration: 450,
    showArrows: true,
    showDots: true,
    height: '320px',
    color: 'primary',
  },
)

const current = defineModel<number>({ default: 0 })

const { themeMode } = useCamelotTheme()
const roleColorClass = useCamelotRoleColorClass(() => props.color)

const reduceMotion = computed(() =>
  typeof window !== 'undefined'
  && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
)

const n = computed(() => props.items.length)
const isVertical = computed(() => props.direction === 'vertical')

const keyFor = (index: number) => {
  const item = props.items[index]
  if (typeof props.itemKey === 'function') return props.itemKey(item as T, index)
  if (props.itemKey && item && typeof item === 'object') {
    return (item as Record<string, unknown>)[props.itemKey] as string | number
  }
  return index
}

// 與當前項的最短帶號距離（loop 時環繞）
const distance = (i: number) => {
  let d = i - current.value
  if (props.loop && n.value > 0) {
    if (d > n.value / 2) d -= n.value
    else if (d < -n.value / 2) d += n.value
  }
  return d
}

// 可視窗半徑（只渲染窗內項目）
const windowRadius = computed(() => {
  switch (props.effect) {
    case 'slide':
      return props.peek + 1
    case 'coverflow':
    case 'zoom':
      return Math.max(props.peek, 2) + 1
    case 'cardStack':
      return 3
    default:
      return 1
  }
})

const isVisible = (i: number) => Math.abs(distance(i)) <= windowRadius.value

// 每張投影片寬/高比例（slide / coverflow / zoom 讓鄰項露出）
const slideExtent = computed(() => {
  if (props.effect === 'slide') return `${100 / (2 * props.peek + 1)}%`
  if (props.effect === 'coverflow' || props.effect === 'zoom') {
    return props.peek > 0 ? `${100 / (2 * props.peek + 1)}%` : '72%'
  }
  return '100%'
})

const transition = computed(() =>
  reduceMotion.value
    ? 'none'
    : `transform ${props.duration}ms var(--ease-ios), opacity ${props.duration}ms var(--ease-ios)`,
)

const slideStyle = (i: number) => {
  const d = distance(i)
  const ad = Math.abs(d)
  const ext = slideExtent.value
  const base: Record<string, string | number> = {
    transition: transition.value,
    zIndex: 100 - ad,
  }
  // 尺寸與置中軸
  if (isVertical.value) {
    base.height = ext
    base.width = '100%'
    base.padding = props.gap ? `${props.gap / 2}px 0` : '0'
  }
  else {
    base.width = ext
    base.height = '100%'
    base.padding = props.gap ? `0 ${props.gap / 2}px` : '0'
  }

  const axis = isVertical.value ? 'Y' : 'X'
  // 拖曳位移接在置中之後、各效果自己的位移之前：coverflow 之類帶 rotateY 的效果，
  // 若把它接在最後會沿著已旋轉的軸移動，看起來會歪掉。
  const dragPx = FOLLOW_DRAG_EFFECTS.has(props.effect) ? dragOffset.value : 0
  const centre = dragPx
    ? `translate(-50%, -50%) translate${axis}(${dragPx}px)`
    : 'translate(-50%, -50%)'
  if (dragPx) {
    // 跟手期間不要有過場，否則畫面會落後手指一個 duration
    base.transition = 'none'
  }
  let transform = ''
  let opacity = 1

  switch (props.effect) {
    case 'slide':
      transform = `${centre} translate${axis}(${d * 100}%)`
      break
    case 'fade':
      transform = centre
      opacity = d === 0 ? 1 : 0
      break
    case 'zoom':
      transform = `${centre} translate${axis}(${d * 72}%) scale(${Math.max(1 - ad * 0.22, 0.6)})`
      opacity = ad === 0 ? 1 : (ad <= Math.max(props.peek, 1) ? 0.55 : 0)
      break
    case 'coverflow':
      transform = `${centre} translate${axis}(${d * 50}%) rotateY(${-d * 42}deg) scale(${Math.max(1 - ad * 0.16, 0.55)})`
      opacity = ad <= (props.peek > 0 ? props.peek : 2) ? 1 : 0
      break
    case 'cardStack':
      if (d < 0) {
        transform = `${centre} translateX(-120%) rotate(-10deg)`
        opacity = 0
      }
      else {
        transform = `${centre} translateY(${-d * 4}%) scale(${Math.max(1 - d * 0.06, 0.7)})`
        opacity = d <= 2 ? 1 : 0
      }
      base.zIndex = 100 - d
      break
    case 'flip':
      transform = `${centre} rotateY(${d * 180}deg)`
      opacity = ad === 0 ? 1 : 0
      break
  }

  base.transform = transform
  base.opacity = opacity
  base.transformStyle = 'preserve-3d'
  return base
}

const go = (i: number) => {
  if (n.value === 0) return
  if (props.loop) {
    current.value = ((i % n.value) + n.value) % n.value
  }
  else {
    current.value = Math.min(Math.max(i, 0), n.value - 1)
  }
}
const next = () => go(current.value + 1)
const prev = () => go(current.value - 1)

const atStart = computed(() => !props.loop && current.value <= 0)
const atEnd = computed(() => !props.loop && current.value >= n.value - 1)

// Autoplay
const hovered = ref(false)
const {
  pause, resume,
} = useIntervalFn(
  () => next(),
  () => props.interval,
  { immediate: false },
)
watchEffect(() => {
  const active = props.autoplay
    && !reduceMotion.value
    && n.value > 1
    && !(props.pauseOnHover && hovered.value)
    && dragStart.value === null
  if (active) resume()
  else pause()
})

// 滑動/拖曳：pointermove 期間把位移直接畫在投影片上（跟手），放開才決定要不要換頁
const SWIPE_THRESHOLD = 40
// 只有位移類效果跟手；fade / flip 沒有平移可跟，維持門檻式換頁
const FOLLOW_DRAG_EFFECTS = new Set(['slide', 'coverflow', 'zoom', 'cardStack'])

const dragStart = ref<{ x: number, y: number } | null>(null)
const dragOffset = ref(0)

// setPointerCapture / releasePointerCapture 在 pointerId 已失效時會丟 NotFoundError。
// 讓它中斷 handler 會使後面的換頁判斷整段不執行，因此一律吞掉——抓不到指標最多是
// 拖出元件外會斷開，不該連換頁都失效。
const setPointerCaptureSafely = (e: PointerEvent, capture: boolean) => {
  const el = e.currentTarget as HTMLElement | null
  if (!el) return
  try {
    if (capture) el.setPointerCapture?.(e.pointerId)
    else el.releasePointerCapture?.(e.pointerId)
  }
  catch {
    // 忽略：指標已結束或不屬於本元件
  }
}

// 控制項（箭頭、指標、投影片內的連結／按鈕）不進入拖曳
const INTERACTIVE_SELECTOR = 'button, a, input, select, textarea, label, [role="button"], [role="tab"]'

const onPointerDown = (e: PointerEvent) => {
  if (n.value < 2) return
  // 從控制項按下時直接放行：setPointerCapture 會把 pointerup 重新導向到本元件，
  // click 因此改派給兩者的共同祖先（也就是這裡），箭頭與指標就再也收不到點擊。
  if ((e.target as HTMLElement | null)?.closest?.(INTERACTIVE_SELECTOR)) return
  dragStart.value = {
    x: e.clientX,
    y: e.clientY,
  }
  dragOffset.value = 0
  // 指標移出元件範圍後仍要收得到事件，否則拖到一半離開就卡在半路。
  // 包 try：pointerId 已失效時會丟 NotFoundError，沒接住的話會中斷後續流程。
  setPointerCaptureSafely(e, true)
}

const onPointerMove = (e: PointerEvent) => {
  const start = dragStart.value
  if (!start) return
  const raw = isVertical.value ? e.clientY - start.y : e.clientX - start.x
  // 非 loop 時拖出頭尾給阻尼：讓「已經到底」有回饋，而不是完全不動
  const atEdge = !props.loop
    && ((raw > 0 && current.value === 0) || (raw < 0 && current.value === n.value - 1))
  dragOffset.value = atEdge ? raw * 0.35 : raw
}

const onPointerEnd = (e: PointerEvent) => {
  const start = dragStart.value
  const offset = dragOffset.value
  dragStart.value = null
  dragOffset.value = 0
  setPointerCaptureSafely(e, false)
  if (!start) return
  if (Math.abs(offset) < SWIPE_THRESHOLD) return
  if (offset < 0) next()
  else prev()
}

const arrowClass = computed(() => {
  switch (themeMode.value) {
    case 'aqua':
      return 'aqua-glass text-on-surface'
    case 'scifi':
      return 'border border-[color-mix(in_srgb,var(--cml-color-current-color)_40%,transparent)] bg-surface/70 text-[var(--cml-color-current-color)]'
    default:
      return 'bg-surface/80 text-on-surface shadow-md'
  }
})

defineExpose({
  next,
  prev,
  go,
})
</script>

<style scoped>
.cml-arrow-anchor {
  position: absolute;
  z-index: 200;
}
.cml-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 9999px;
  cursor: pointer;
  backdrop-filter: blur(6px);
  transition: opacity 0.2s ease;
}
.cml-arrow:hover {
  opacity: 0.85;
}
</style>

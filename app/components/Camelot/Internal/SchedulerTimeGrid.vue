<template>
  <div
    ref="scroller"
    class="relative max-h-[70vh] overflow-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
  >
    <!-- 標頭：星期與日期；黏在捲動區上緣，和下方的欄對齊 -->
    <div
      class="sticky top-0 z-20 flex border-b bg-surface"
      :class="lineClass"
    >
      <div class="w-14 shrink-0" />
      <button
        v-for="column in columns"
        :key="column.day.toISOString()"
        type="button"
        class="min-w-0 flex-1 cursor-pointer py-2 text-center outline-none focus-visible:tactile-ring"
        @click="emit('select-day', column.day)"
      >
        <div :class="headerTextClass">
          {{ weekdayLabel(column.day) }}
        </div>
        <div
          class="mx-auto mt-1 flex h-7 min-w-7 items-center justify-center px-1 text-sm font-semibold"
          :class="column.isToday ? [todayNumberClass, 'rounded-full'] : 'text-on-surface'"
        >
          {{ column.day.getDate() }}
        </div>
      </button>
    </div>

    <div class="flex">
      <!-- 時間刻度 -->
      <div
        class="relative w-14 shrink-0"
        :style="{ height: `${bodyHeight}px` }"
      >
        <span
          v-for="hour in labelHours"
          :key="hour"
          class="absolute right-2 -translate-y-1/2 tabular-nums"
          :class="headerTextClass"
          :style="{ top: `${(hour - startHour) * hourHeight}px` }"
        >{{ pad(hour) }}:00</span>
      </div>

      <!-- 每一天一欄 -->
      <div
        class="relative flex min-w-0 flex-1"
        :style="{ height: `${bodyHeight}px` }"
      >
        <div
          v-for="(column, index) in columns"
          :key="column.day.toISOString()"
          :ref="(element) => setColumnElement(element, index)"
          class="relative min-w-0 flex-1 touch-pan-y border-l first:border-l-0"
          :class="[lineClass, { [todayClass]: column.isToday }]"
          :style="gridStyle"
          @pointerdown="drag.startCreate($event)"
        >
          <CamelotInternalSchedulerEventChip
            v-for="item in column.items"
            :key="item.event.id"
            class="absolute touch-none"
            :style="item.style"
            :event="item.event"
            :color="color"
            :untitled="untitled"
            :readonly="readonly"
            :is-draft="drag.isDraftEvent(item.event)"
            resizable="bottom"
            @move-start="drag.startMove(item.event, $event)"
            @resize-start="drag.startResize(item.event, $event)"
            @open="emit('open', item.event)"
          />

          <!-- 目前時間 -->
          <div
            v-if="column.isToday && nowTop !== null"
            class="pointer-events-none absolute inset-x-0 z-10 h-0.5"
            :class="nowLineClass"
            :style="{ top: `${nowTop}px` }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isToday } from 'date-fns'

const props = withDefaults(
  defineProps<{
    /** 要顯示的每一天（週視圖 7 天、日視圖 1 天） */
    days?: Date[]
    events?: CamelotSchedulerEvent[]
    /** 可見範圍的起點（時） */
    startHour?: number
    /** 可見範圍的終點（時） */
    endHour?: number
    /** 每小時的高度（px） */
    hourHeight?: number
    /** 吸附單位（分鐘） */
    snapMinutes?: number
    /** 點一下空白處新增的事件長度（分鐘） */
    defaultMinutes?: number
    /** 開啟時捲動到這個小時 */
    scrollToHour?: number
    readonly?: boolean
    color?: CamelotColorRole
    locale?: string
    untitled?: string
  }>(),
  {
    days: () => [],
    events: () => [],
    startHour: 0,
    endHour: 24,
    hourHeight: 48,
    snapMinutes: 15,
    defaultMinutes: 60,
    scrollToHour: 8,
    readonly: false,
    color: 'primary',
    locale: undefined,
    untitled: '',
  },
)

const emit = defineEmits<{
  'change': [event: CamelotSchedulerEvent, previous: CamelotSchedulerEvent]
  'create': [event: CamelotSchedulerEvent]
  'open': [event: CamelotSchedulerEvent]
  'select-day': [day: Date]
}>()

// 再矮的事件也至少畫出這麼長（分鐘），才點得到
const MIN_VISIBLE_MINUTES = 15
// 事件色塊右側留的縫（px），並排時才看得出邊界
const EVENT_GAP = 2
const NOW_REFRESH_MS = 60_000

const {
  lineClass,
  headerTextClass,
  todayClass,
  todayNumberClass,
  nowLineClass,
} = useCamelotSchedulerTheme()

const {
  dateAtMinutes,
  minutesOfDay,
  eventsOnDay,
  rangeInDay,
  layoutColumns,
} = useCamelotSchedulerLayout()

const scroller = useTemplateRef<HTMLElement>('scroller')

const columnElements: (HTMLElement | null)[] = []

const setColumnElement = (element: unknown, index: number) => {
  columnElements[index] = element instanceof HTMLElement ? element : null
}

const dayStartMinutes = computed(() => props.startHour * 60)

const dayEndMinutes = computed(() => props.endHour * 60)

const bodyHeight = computed(() => (props.endHour - props.startHour) * props.hourHeight)

// 起點那條線不標數字
const labelHours = computed(() =>
  Array.from({ length: props.endHour - props.startHour - 1 }, (_, index) => props.startHour + index + 1),
)

const pad = (value: number): string => String(value).padStart(2, '0')

const weekdayFormatter = computed(() => new Intl.DateTimeFormat(props.locale, { weekday: 'short' }))

const weekdayLabel = (day: Date): string => weekdayFormatter.value.format(day)

// 每小時一條橫線，畫在欄的背景上
const gridStyle = computed(() => ({
  backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent ${props.hourHeight - 1}px, var(--color-border) ${props.hourHeight - 1}px, var(--color-border) ${props.hourHeight}px)`,
}))

const clamp = (value: number, lower: number, upper: number): number => Math.min(upper, Math.max(lower, value))

const locate = (clientX: number, clientY: number): CamelotSchedulerPoint | null => {
  const rects = columnElements.map(element => element?.getBoundingClientRect())
  const firstRect = rects[0]
  if (!firstRect) return null
  const hitIndex = rects.findIndex(rect => rect && clientX >= rect.left && clientX < rect.right)
  const index = hitIndex !== -1 ? hitIndex : (clientX < firstRect.left ? 0 : rects.length - 1)
  const rect = rects[index]
  const day = props.days[index]
  if (!rect || !day) return null
  const minutes = dayStartMinutes.value + ((clientY - rect.top) / props.hourHeight) * 60
  return { dateTime: dateAtMinutes(day, Math.round(clamp(minutes, dayStartMinutes.value, dayEndMinutes.value))) }
}

const drag = useCamelotSchedulerDrag({
  locate,
  granularity: 'minute',
  snapMinutes: () => props.snapMinutes,
  defaultMinutes: () => props.defaultMinutes,
  readonly: () => props.readonly,
  onChange: (event, previous) => emit('change', event, previous),
  onCreate: event => emit('create', event),
  onOpen: event => emit('open', event),
})

const displayEvents = computed(() => drag.applyDraft(props.events))

const columns = computed(() =>
  props.days.map((day) => {
    const clipped = eventsOnDay(displayEvents.value, day)
      .map((event) => {
        const range = rangeInDay(event, day)
        const start = Math.max(range.start, dayStartMinutes.value)
        const end = Math.max(Math.min(range.end, dayEndMinutes.value), start + MIN_VISIBLE_MINUTES)
        return {
          event,
          start,
          end,
        }
      })
      .filter(item => item.start < dayEndMinutes.value)

    const layoutByKey = new Map(
      layoutColumns(clipped.map(item => ({
        key: item.event.id,
        start: item.start,
        end: item.end,
      }))).map(layout => [layout.key, layout]),
    )

    return {
      day,
      isToday: isToday(day),
      items: clipped.map((item) => {
        const layout = layoutByKey.get(item.event.id)
        const columnIndex = layout?.column ?? 0
        const columnCount = layout?.columns ?? 1
        return {
          event: item.event,
          style: {
            top: `${((item.start - dayStartMinutes.value) / 60) * props.hourHeight}px`,
            height: `${((item.end - item.start) / 60) * props.hourHeight}px`,
            left: `${(columnIndex / columnCount) * 100}%`,
            width: `calc(${100 / columnCount}% - ${EVENT_GAP}px)`,
          },
        }
      }),
    }
  }),
)

const now = ref(new Date())

// 每分鐘更新一次，目前時間的紅線才會往下走
useIntervalFn(() => {
  now.value = new Date()
}, NOW_REFRESH_MS)

// 目前時間的線；不在可見範圍內就不畫
const nowTop = computed<number | null>(() => {
  const minutes = minutesOfDay(now.value)
  if (minutes < dayStartMinutes.value || minutes > dayEndMinutes.value) return null
  return ((minutes - dayStartMinutes.value) / 60) * props.hourHeight
})

onMounted(() => {
  const target = Math.max(0, props.scrollToHour - props.startHour) * props.hourHeight
  if (scroller.value) scroller.value.scrollTop = target
})
</script>

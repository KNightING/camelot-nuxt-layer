<template>
  <div>
    <!-- 星期標頭 -->
    <div
      class="grid grid-cols-7 border-b"
      :class="lineClass"
    >
      <div
        v-for="weekday in weekdays"
        :key="weekday"
        class="py-2 text-center"
        :class="headerTextClass"
      >
        {{ weekday }}
      </div>
    </div>

    <!-- 6 週 × 7 天 -->
    <div class="grid grid-cols-7">
      <div
        v-for="(cell, index) in cells"
        :key="cell.day.toISOString()"
        :ref="(element) => setCellElement(element, index)"
        class="min-h-24 min-w-0 touch-pan-y border-b border-l p-1"
        :class="[lineClass, { [todayClass]: cell.isToday, 'opacity-50': !cell.inMonth }]"
        @pointerdown="drag.startCreate($event)"
      >
        <button
          type="button"
          class="flex h-6 min-w-6 cursor-pointer items-center justify-center px-1 text-xs font-semibold outline-none focus-visible:tactile-ring"
          :class="cell.isToday ? [todayNumberClass, 'rounded-full'] : 'text-on-surface'"
          @pointerdown.stop
          @click="emit('select-day', cell.day)"
        >
          {{ cell.day.getDate() }}
        </button>

        <div class="mt-1 flex flex-col gap-0.5">
          <CamelotInternalSchedulerEventChip
            v-for="event in cell.visible"
            :key="event.id"
            class="touch-none"
            variant="chip"
            :event="event"
            :color="color"
            :untitled="untitled"
            :readonly="readonly"
            :is-draft="drag.isDraftEvent(event)"
            @move-start="drag.startMove(event, $event)"
            @open="emit('open', event)"
          />
          <button
            v-if="cell.hiddenCount > 0"
            type="button"
            class="cursor-pointer truncate px-1 text-left text-xs text-on-surface-variant outline-none hover:text-on-surface focus-visible:tactile-ring"
            @pointerdown.stop
            @click="emit('select-day', cell.day)"
          >
            {{ moreText.replace('{count}', String(cell.hiddenCount)) }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isSameMonth, isToday } from 'date-fns'

const props = withDefaults(
  defineProps<{
    /** 目前顯示的月份（月內任一天） */
    date?: Date
    events?: CamelotSchedulerEvent[]
    weekStartsOn?: 0 | 1
    defaultMinutes?: number
    /** 每一格最多顯示幾筆，超過的以「還有 N 筆」收合 */
    maxEvents?: number
    /** 收合文字，{count} 會換成數量 */
    moreText?: string
    readonly?: boolean
    color?: CamelotColorRole
    locale?: string
    untitled?: string
  }>(),
  {
    date: () => new Date(),
    events: () => [],
    weekStartsOn: 0,
    defaultMinutes: 60,
    maxEvents: 3,
    moreText: '還有 {count} 筆',
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

// 月視圖只能換日，吸附單位用不到，但拖移控制器需要一個值
const UNUSED_SNAP_MINUTES = 15

const {
  lineClass, headerTextClass, todayClass, todayNumberClass,
} = useCamelotSchedulerTheme()

const {
  dateAtMinutes,
  eventsOnDay,
  nearestRectIndex,
  buildMonthGrid,
} = useCamelotSchedulerLayout()

const cellElements: (HTMLElement | null)[] = []

const setCellElement = (element: unknown, index: number) => {
  cellElements[index] = element instanceof HTMLElement ? element : null
}

const days = computed(() => buildMonthGrid(props.date, props.weekStartsOn))

const weekdayFormatter = computed(() => new Intl.DateTimeFormat(props.locale, { weekday: 'short' }))

// 取表頭那 7 天的名稱
const weekdays = computed(() => days.value.slice(0, 7).map(day => weekdayFormatter.value.format(day)))

const locate = (clientX: number, clientY: number): CamelotSchedulerPoint | null => {
  const rects = cellElements.map(element => element?.getBoundingClientRect())
  const index = nearestRectIndex(rects, clientX, clientY)
  const day = days.value[index]
  return day ? { dateTime: dateAtMinutes(day, 0) } : null
}

const drag = useCamelotSchedulerDrag({
  locate,
  granularity: 'day',
  snapMinutes: () => UNUSED_SNAP_MINUTES,
  defaultMinutes: () => props.defaultMinutes,
  readonly: () => props.readonly,
  onChange: (event, previous) => emit('change', event, previous),
  onCreate: event => emit('create', event),
  onOpen: event => emit('open', event),
})

const displayEvents = computed(() => drag.applyDraft(props.events))

const cells = computed(() =>
  days.value.map((day) => {
    const dayEvents = [...eventsOnDay(displayEvents.value, day)].sort((a, b) => a.start.getTime() - b.start.getTime())
    return {
      day,
      inMonth: isSameMonth(day, props.date),
      isToday: isToday(day),
      visible: dayEvents.slice(0, props.maxEvents),
      hiddenCount: Math.max(0, dayEvents.length - props.maxEvents),
    }
  }),
)
</script>

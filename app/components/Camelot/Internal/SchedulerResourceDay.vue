<template>
  <div class="overflow-x-auto">
    <div :style="{ minWidth: `calc(${nameColumnWidth} + ${trackWidth}px)` }">
      <!-- 標頭：小時刻度 -->
      <div
        class="flex border-b"
        :class="lineClass"
      >
        <div
          class="sticky left-0 z-10 shrink-0 bg-surface"
          :style="{ width: nameColumnWidth }"
        />
        <div
          class="relative h-8"
          :style="{ width: `${trackWidth}px` }"
        >
          <span
            v-for="hour in hours"
            :key="hour"
            class="absolute top-1/2 -translate-y-1/2 pl-1 tabular-nums"
            :class="headerTextClass"
            :style="{ left: `${(hour - startHour) * hourWidth}px` }"
          >{{ pad(hour) }}:00</span>
        </div>
      </div>

      <!-- 每個人一列 -->
      <div
        v-for="(row, rowIndex) in rows"
        :key="row.resource.id"
        class="flex border-b last:border-b-0"
        :class="lineClass"
      >
        <div
          class="sticky left-0 z-10 flex shrink-0 items-center bg-surface px-3"
          :style="{ width: nameColumnWidth }"
        >
          <span class="min-w-0 truncate text-sm font-semibold text-on-surface">{{ row.resource.name }}</span>
        </div>
        <div
          :ref="(element) => setTrackElement(element, rowIndex)"
          class="relative shrink-0 touch-pan-y"
          :class="{ [todayClass]: dayIsToday }"
          :style="[trackStyle, { width: `${trackWidth}px`, height: `${row.height}px` }]"
          @pointerdown="drag.startCreate($event)"
        >
          <CamelotInternalSchedulerEventChip
            v-for="item in row.items"
            :key="item.event.id"
            class="absolute touch-none"
            variant="chip"
            :style="item.style"
            :event="item.event"
            :color="row.resource.color ?? color"
            :untitled="untitled"
            :readonly="readonly"
            :is-draft="drag.isDraftEvent(item.event)"
            resizable="right"
            @move-start="drag.startMove(item.event, $event)"
            @resize-start="drag.startResize(item.event, $event)"
            @open="emit('open', item.event)"
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
    /** 要顯示的那一天 */
    day?: Date
    resources?: CamelotSchedulerResource[]
    events?: CamelotSchedulerEvent[]
    startHour?: number
    endHour?: number
    /** 每小時的寬度（px） */
    hourWidth?: number
    snapMinutes?: number
    defaultMinutes?: number
    readonly?: boolean
    color?: CamelotColorRole
    untitled?: string
  }>(),
  {
    day: () => new Date(),
    resources: () => [],
    events: () => [],
    startHour: 0,
    endHour: 24,
    hourWidth: 72,
    snapMinutes: 15,
    defaultMinutes: 60,
    readonly: false,
    color: 'primary',
    untitled: '',
  },
)

const emit = defineEmits<{
  change: [event: CamelotSchedulerEvent, previous: CamelotSchedulerEvent]
  create: [event: CamelotSchedulerEvent]
  open: [event: CamelotSchedulerEvent]
}>()

const nameColumnWidth = '9rem'
// 一條事件的高度與條與條之間的距離（px）
const LANE_HEIGHT = 26
const LANE_GAP = 2
const ROW_PADDING = 6
const MIN_ROW_HEIGHT = 44
// 再短的事件也至少畫出這麼寬（px），才點得到、拖得到
const MIN_EVENT_WIDTH = 28

const {
  lineClass, headerTextClass, todayClass,
} = useCamelotSchedulerTheme()

const {
  dateAtMinutes,
  eventsOnDay,
  rangeInDay,
  layoutColumns,
  nearestRectIndex,
} = useCamelotSchedulerLayout()

const trackElements: (HTMLElement | null)[] = []

const setTrackElement = (element: unknown, index: number) => {
  trackElements[index] = element instanceof HTMLElement ? element : null
}

const dayStartMinutes = computed(() => props.startHour * 60)

const dayEndMinutes = computed(() => props.endHour * 60)

const trackWidth = computed(() => (props.endHour - props.startHour) * props.hourWidth)

const dayIsToday = computed(() => isToday(props.day))

const hours = computed(() => Array.from({ length: props.endHour - props.startHour }, (_, index) => props.startHour + index))

const pad = (value: number): string => String(value).padStart(2, '0')

// 每小時一條直線，畫在每一列的背景上
const trackStyle = computed(() => ({
  backgroundImage: `repeating-linear-gradient(to right, transparent 0, transparent ${props.hourWidth - 1}px, var(--color-border) ${props.hourWidth - 1}px, var(--color-border) ${props.hourWidth}px)`,
}))

const clamp = (value: number, lower: number, upper: number): number => Math.min(upper, Math.max(lower, value))

const locate = (clientX: number, clientY: number): CamelotSchedulerPoint | null => {
  const rects = trackElements.map(element => element?.getBoundingClientRect())
  const index = nearestRectIndex(rects, clientX, clientY)
  const rect = rects[index]
  const resource = props.resources[index]
  if (!rect || !resource) return null
  const minutes = dayStartMinutes.value + ((clientX - rect.left) / props.hourWidth) * 60
  return {
    dateTime: dateAtMinutes(props.day, Math.round(clamp(minutes, dayStartMinutes.value, dayEndMinutes.value))),
    resourceId: resource.id,
  }
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

const rows = computed(() =>
  props.resources.map((resource) => {
    const clipped = eventsOnDay(displayEvents.value.filter(event => event.resourceId === resource.id), props.day)
      .map((event) => {
        const range = rangeInDay(event, props.day)
        const start = Math.max(range.start, dayStartMinutes.value)
        const end = Math.min(range.end, dayEndMinutes.value)
        return {
          event,
          start,
          end: Math.max(end, start + 1),
        }
      })
      .filter(item => item.start < dayEndMinutes.value)

    const layouts = layoutColumns(clipped.map(item => ({
      key: item.event.id,
      start: item.start,
      end: item.end,
    })))
    const layoutByKey = new Map(layouts.map(layout => [layout.key, layout]))
    // 同一時段重疊的事件疊成多條，列高跟著最多的那一組長高
    const laneCount = Math.max(1, ...layouts.map(layout => layout.columns))

    return {
      resource,
      height: Math.max(MIN_ROW_HEIGHT, laneCount * (LANE_HEIGHT + LANE_GAP) + ROW_PADDING * 2),
      items: clipped.map((item) => {
        const lane = layoutByKey.get(item.event.id)?.column ?? 0
        return {
          event: item.event,
          style: {
            left: `${((item.start - dayStartMinutes.value) / 60) * props.hourWidth}px`,
            width: `${Math.max(MIN_EVENT_WIDTH, ((item.end - item.start) / 60) * props.hourWidth - LANE_GAP)}px`,
            top: `${ROW_PADDING + lane * (LANE_HEIGHT + LANE_GAP)}px`,
            height: `${LANE_HEIGHT}px`,
          },
        }
      }),
    }
  }),
)
</script>

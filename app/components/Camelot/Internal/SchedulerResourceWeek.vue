<template>
  <div class="overflow-x-auto">
    <div
      class="grid min-w-[44rem]"
      :style="{ gridTemplateColumns: `${nameColumnWidth} repeat(${days.length}, minmax(0, 1fr))` }"
    >
      <!-- 標頭 -->
      <div
        class="sticky left-0 z-10 border-b bg-surface"
        :class="lineClass"
      />
      <button
        v-for="column in headerDays"
        :key="column.day.toISOString()"
        type="button"
        class="cursor-pointer border-b py-2 text-center outline-none focus-visible:tactile-ring"
        :class="[lineClass, { [todayClass]: column.isToday }]"
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

      <!-- 每個人一列 -->
      <template
        v-for="(row, rowIndex) in rows"
        :key="row.resource.id"
      >
        <div
          class="sticky left-0 z-10 flex items-center border-b bg-surface px-3 py-2"
          :class="lineClass"
        >
          <span class="min-w-0 truncate text-sm font-semibold text-on-surface">{{ row.resource.name }}</span>
        </div>
        <div
          v-for="(cell, dayIndex) in row.cells"
          :key="cell.day.toISOString()"
          :ref="(element) => setCellElement(element, rowIndex * days.length + dayIndex)"
          class="min-h-14 min-w-0 touch-pan-y border-b border-l p-1"
          :class="[lineClass, { [todayClass]: cell.isToday }]"
          @pointerdown="drag.startCreate($event)"
        >
          <div class="flex flex-col gap-0.5">
            <CamelotInternalSchedulerEventChip
              v-for="event in cell.events"
              :key="event.id"
              class="touch-none"
              variant="chip"
              :event="event"
              :color="row.resource.color ?? color"
              :untitled="untitled"
              :readonly="readonly"
              :is-draft="drag.isDraftEvent(event)"
              @move-start="drag.startMove(event, $event)"
              @open="emit('open', event)"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isToday } from 'date-fns'

const props = withDefaults(
  defineProps<{
    /** 一週的 7 天 */
    days?: Date[]
    resources?: CamelotSchedulerResource[]
    events?: CamelotSchedulerEvent[]
    defaultMinutes?: number
    readonly?: boolean
    color?: CamelotColorRole
    locale?: string
    untitled?: string
  }>(),
  {
    days: () => [],
    resources: () => [],
    events: () => [],
    defaultMinutes: 60,
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

// 這個視圖只能換日與換人，吸附單位用不到，但拖移控制器需要一個值
const UNUSED_SNAP_MINUTES = 15
const nameColumnWidth = '9rem'

const {
  lineClass,
  headerTextClass,
  todayClass,
  todayNumberClass,
} = useCamelotSchedulerTheme()

const {
  dateAtMinutes,
  isEventOnDay,
  nearestRectIndex,
} = useCamelotSchedulerLayout()

const cellElements: (HTMLElement | null)[] = []

const setCellElement = (element: unknown, index: number) => {
  cellElements[index] = element instanceof HTMLElement ? element : null
}

const weekdayFormatter = computed(() => new Intl.DateTimeFormat(props.locale, { weekday: 'short' }))

const weekdayLabel = (day: Date): string => weekdayFormatter.value.format(day)

const headerDays = computed(() => props.days.map(day => ({
  day,
  isToday: isToday(day),
})))

const locate = (clientX: number, clientY: number): CamelotSchedulerPoint | null => {
  const rects = cellElements.map(element => element?.getBoundingClientRect())
  const index = nearestRectIndex(rects, clientX, clientY)
  if (index === -1 || props.days.length === 0) return null
  const day = props.days[index % props.days.length]
  const resource = props.resources[Math.floor(index / props.days.length)]
  if (!day || !resource) return null
  return {
    dateTime: dateAtMinutes(day, 0),
    resourceId: resource.id,
  }
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

const rows = computed(() =>
  props.resources.map(resource => ({
    resource,
    cells: props.days.map(day => ({
      day,
      isToday: isToday(day),
      events: displayEvents.value
        .filter(event => event.resourceId === resource.id && isEventOnDay(event, day))
        .sort((a, b) => a.start.getTime() - b.start.getTime()),
    })),
  })),
)
</script>

<template>
  <div
    class="cml-scheduler flex flex-col gap-3 text-base"
    :class="roleColorClass"
  >
    <!-- 工具列：導覽、標題、視圖切換 -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <CamelotButton
          :color="color"
          @click="shift(-1)"
        >
          <IMaterialSymbolsChevronLeftRounded class="text-xl" />
          <span class="sr-only">{{ mergedLabels.previous }}</span>
        </CamelotButton>
        <CamelotButton
          :label="mergedLabels.today"
          :color="color"
          @click="date = new Date()"
        />
        <CamelotButton
          :color="color"
          @click="shift(1)"
        >
          <IMaterialSymbolsChevronRightRounded class="text-xl" />
          <span class="sr-only">{{ mergedLabels.next }}</span>
        </CamelotButton>
      </div>

      <h2 class="min-w-0 flex-1 text-center text-lg font-bold text-on-surface sm:flex-none">
        {{ title }}
      </h2>

      <CamelotTabs
        v-model="viewTab"
        :options="viewOptions"
        :color="color"
      />
    </div>

    <!-- 視圖 -->
    <div
      class="overflow-hidden"
      :class="containerClass"
    >
      <CamelotInternalSchedulerMonthView
        v-if="activeView === 'month'"
        :date="date"
        :events="events"
        :week-starts-on="weekStartsOn"
        :default-minutes="defaultMinutes"
        :more-text="mergedLabels.more"
        :readonly="readonly"
        :color="color"
        :locale="resolvedLocale"
        :untitled="mergedLabels.untitled"
        @change="onChange"
        @create="onCreate"
        @open="onOpen"
        @select-day="onSelectDay"
      />

      <CamelotInternalSchedulerTimeGrid
        v-else-if="activeView === 'week' || activeView === 'day'"
        :days="visibleDays"
        :events="events"
        :start-hour="startHour"
        :end-hour="endHour"
        :hour-height="hourHeight"
        :scroll-to-hour="scrollToHour"
        :snap-minutes="snapMinutes"
        :default-minutes="defaultMinutes"
        :readonly="readonly"
        :color="color"
        :locale="resolvedLocale"
        :untitled="mergedLabels.untitled"
        @change="onChange"
        @create="onCreate"
        @open="onOpen"
        @select-day="onSelectDay"
      />

      <CamelotInternalSchedulerResourceWeek
        v-else-if="activeView === 'resourceWeek'"
        :days="visibleDays"
        :resources="resources"
        :events="events"
        :default-minutes="defaultMinutes"
        :readonly="readonly"
        :color="color"
        :locale="resolvedLocale"
        :untitled="mergedLabels.untitled"
        @change="onChange"
        @create="onCreate"
        @open="onOpen"
        @select-day="onSelectDay"
      />

      <CamelotInternalSchedulerResourceDay
        v-else
        :day="date"
        :resources="resources"
        :events="events"
        :start-hour="startHour"
        :end-hour="endHour"
        :snap-minutes="snapMinutes"
        :default-minutes="defaultMinutes"
        :readonly="readonly"
        :color="color"
        :untitled="mergedLabels.untitled"
        @change="onChange"
        @create="onCreate"
        @open="onOpen"
      />
    </div>

    <!-- 編輯面板：可用 editor slot 整個換掉 -->
    <slot
      name="editor"
      :event="editing"
      :is-new="isNewEvent"
      :open="isEditorOpen"
      :save="onSave"
      :remove="onRemove"
      :close="closeEditor"
    >
      <CamelotInternalSchedulerEditor
        v-model:open="isEditorOpen"
        :event="editing"
        :is-new="isNewEvent"
        :resources="resources"
        :labels="mergedLabels"
        :readonly="editing?.locked ?? false"
        :color="color"
        @save="onSave"
        @delete="onRemove"
      />
    </slot>
  </div>
</template>

<script setup lang="ts">
import IMaterialSymbolsChevronLeftRounded from '~icons/material-symbols/chevron-left-rounded'
import IMaterialSymbolsChevronRightRounded from '~icons/material-symbols/chevron-right-rounded'
import { addDays, addMonths, addWeeks } from 'date-fns'

const props = withDefaults(
  defineProps<{
    /** 排班視圖的列（人員、房間、設備）；沒有時排班視圖不會出現 */
    resources?: CamelotSchedulerResource[]
    /** 要提供的視圖，也決定切換列的順序 */
    views?: CamelotSchedulerView[]
    /** 週起始：0 週日、1 週一 */
    weekStartsOn?: 0 | 1
    /** BCP 47 語系，用來產生星期與標題；未指定時用繁體中文 */
    locale?: string
    /** 時間軸可見範圍的起點（時） */
    startHour?: number
    /** 時間軸可見範圍的終點（時） */
    endHour?: number
    /** 週與日視圖每小時的高度（px） */
    hourHeight?: number
    /** 週與日視圖打開時捲動到這個小時 */
    scrollToHour?: number
    /** 拖移與調整長度的吸附單位（分鐘） */
    snapMinutes?: number
    /** 點一下空白處新增的事件長度（分鐘） */
    defaultMinutes?: number
    /** 唯讀：不能新增、拖移、調整長度或編輯 */
    readonly?: boolean
    color?: CamelotColorRole
    /** 要覆蓋的顯示文字，沒給的欄位用預設繁體中文 */
    labels?: Partial<CamelotSchedulerLabels>
  }>(),
  {
    resources: () => [],
    views: () => ['month', 'week', 'day', 'resourceWeek', 'resourceDay'],
    weekStartsOn: 0,
    locale: undefined,
    startHour: 0,
    endHour: 24,
    hourHeight: 48,
    scrollToHour: 8,
    snapMinutes: 15,
    defaultMinutes: 60,
    readonly: false,
    color: 'primary',
    labels: () => ({}),
  },
)

const emit = defineEmits<{
  'create': [event: CamelotSchedulerEvent]
  'update': [event: CamelotSchedulerEvent, previous: CamelotSchedulerEvent]
  'delete': [event: CamelotSchedulerEvent]
  'event-click': [event: CamelotSchedulerEvent]
}>()

/** 事件清單；元件的新增、拖移、編輯、刪除都會產生新的陣列寫回這裡 */
const events = defineModel<CamelotSchedulerEvent[]>('events', { default: () => [] })

/** 目前顯示的日期（月視圖看它所在的月、週視圖看它所在的週） */
const date = defineModel<Date>('date', { default: () => new Date() })

const view = defineModel<CamelotSchedulerView>('view', { default: 'week' })

const DEFAULT_LABELS: CamelotSchedulerLabels = {
  today: '今天',
  month: '月',
  week: '週',
  day: '日',
  resourceWeek: '排班（週）',
  resourceDay: '排班（日）',
  previous: '上一頁',
  next: '下一頁',
  newEvent: '新增事件',
  editEvent: '編輯事件',
  title: '標題',
  start: '開始',
  end: '結束',
  resource: '人員',
  color: '顏色',
  save: '儲存',
  cancel: '取消',
  delete: '刪除',
  noResource: '未指派',
  more: '還有 {count} 筆',
  untitled: '（未命名）',
}

const DEFAULT_LOCALE = 'zh-TW'
const RESOURCE_VIEWS: CamelotSchedulerView[] = ['resourceWeek', 'resourceDay']

let eventIdCounter = 0

// 新增事件的識別值；消費端要用自己的 id 時，在 create 事件裡換掉即可
const createEventId = (): string => `scheduler-${Date.now().toString(36)}-${++eventIdCounter}`

const { containerClass } = useCamelotSchedulerTheme()

const { buildWeekDays } = useCamelotSchedulerLayout()

const roleColorClass = useCamelotRoleColorClass(() => props.color)

const mergedLabels = computed<CamelotSchedulerLabels>(() => ({
  ...DEFAULT_LABELS,
  ...props.labels,
}))

const resolvedLocale = computed(() => props.locale ?? DEFAULT_LOCALE)

// 沒有人員時不提供排班視圖
const availableViews = computed(() =>
  props.views.filter(item => props.resources.length > 0 || !RESOURCE_VIEWS.includes(item)),
)

// 目前的視圖不在可用清單時，退回清單的第一個
const activeView = computed<CamelotSchedulerView>(() =>
  availableViews.value.includes(view.value) ? view.value : (availableViews.value[0] ?? 'week'),
)

const viewOptions = computed(() =>
  availableViews.value.map(item => ({
    name: mergedLabels.value[item],
    value: item,
  })),
)

// Tabs 的 v-model 是 string | number；從可用視圖裡找出同名的那個再寫回，找不到就忽略
const viewTab = computed({
  get: () => activeView.value,
  set: (value) => {
    const nextView = availableViews.value.find(item => item === value)
    if (nextView) view.value = nextView
  },
})

const isWeekBased = computed(() => activeView.value === 'week' || activeView.value === 'resourceWeek')

const visibleDays = computed(() => (isWeekBased.value ? buildWeekDays(date.value, props.weekStartsOn) : [date.value]))

const title = computed(() => {
  const locale = resolvedLocale.value
  if (activeView.value === 'month') {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
    }).format(date.value)
  }
  if (isWeekBased.value) {
    const first = visibleDays.value[0] ?? date.value
    const last = visibleDays.value[visibleDays.value.length - 1] ?? date.value
    const startText = new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(first)
    const endText = new Intl.DateTimeFormat(locale, {
      month: 'long',
      day: 'numeric',
    }).format(last)
    return `${startText} – ${endText}`
  }
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(date.value)
})

const shift = (direction: 1 | -1) => {
  if (activeView.value === 'month') date.value = addMonths(date.value, direction)
  else if (isWeekBased.value) date.value = addWeeks(date.value, direction)
  else date.value = addDays(date.value, direction)
}

// 點月曆的日期或「還有 N 筆」：切到那一天的日視圖；沒有日視圖就只換日期
const onSelectDay = (day: Date) => {
  date.value = day
  if (availableViews.value.includes('day')) view.value = 'day'
}

/** 正在編輯的事件；null 表示面板沒開 */
const editing = ref<CamelotSchedulerEvent | null>(null)

const isNewEvent = ref(false)

const isEditorOpen = ref(false)

const closeEditor = () => {
  isEditorOpen.value = false
}

const onChange = (event: CamelotSchedulerEvent, previous: CamelotSchedulerEvent) => {
  events.value = events.value.map(item => (item.id === event.id ? event : item))
  emit('update', event, previous)
}

const onCreate = (draft: CamelotSchedulerEvent) => {
  if (props.readonly) return
  editing.value = {
    ...draft,
    id: createEventId(),
  }
  isNewEvent.value = true
  isEditorOpen.value = true
}

const onOpen = (event: CamelotSchedulerEvent) => {
  emit('event-click', event)
  if (props.readonly) return
  editing.value = event
  isNewEvent.value = false
  isEditorOpen.value = true
}

const onSave = (event: CamelotSchedulerEvent) => {
  if (isNewEvent.value) {
    events.value = [...events.value, event]
    emit('create', event)
  }
  else {
    const previous = events.value.find(item => item.id === event.id)
    events.value = events.value.map(item => (item.id === event.id ? event : item))
    if (previous) emit('update', event, previous)
  }
  closeEditor()
}

const onRemove = () => {
  const target = editing.value
  if (!target) return
  events.value = events.value.filter(item => item.id !== target.id)
  emit('delete', target)
  closeEditor()
}
</script>

<template>
  <div
    class="calendar-container select-none p-3"
    :class="pickerExpand && pickerMode !== 'calendar' ? 'w-full flex flex-col items-center' : 'w-fit min-w-[280px]'"
  >
    <!-- Month/Year Picker Header -->
    <div class="flex items-center justify-between mb-4 px-1">
      <div
        v-if="pickerMode === 'calendar' && !hidePrevArrow"
        class="flex items-center gap-1 group"
      >
        <button
          type="button"
          class="p-1.5 rounded-full hover:bg-surface-container transition-colors disabled:opacity-30 text-on-surface"
          @click="prevMonth"
        >
          <IMaterialSymbolsChevronLeftRounded class="w-6 h-6" />
        </button>
      </div>
      <div
        v-else
        class="w-9"
      />

      <div class="flex items-center gap-1">
        <button
          type="button"
          class="px-2 py-1 rounded-md hover:bg-surface-container font-medium text-lg transition-colors text-on-surface"
          @click="toggleYearPicker"
        >
          <slot
            name="year-label"
            :view-date="viewDate"
            :year="viewDate.getFullYear()"
          >
            {{ yearLabel }}
          </slot>
        </button>
        <button
          type="button"
          class="px-2 py-1 rounded-md hover:bg-surface-container font-medium text-lg transition-colors text-on-surface"
          @click="toggleMonthPicker"
        >
          <slot
            name="month-label"
            :view-date="viewDate"
            :month="viewDate.getMonth()"
          >
            {{ monthLabel }}
          </slot>
        </button>
      </div>

      <div
        v-if="pickerMode === 'calendar' && !hideNextArrow"
        class="flex items-center gap-1"
      >
        <button
          type="button"
          class="p-1.5 rounded-full hover:bg-surface-container transition-colors disabled:opacity-30 text-on-surface"
          @click="nextMonth"
        >
          <IMaterialSymbolsChevronRightRounded class="w-6 h-6" />
        </button>
      </div>
      <div
        v-else
        class="w-9"
      />
    </div>

    <!-- Calendar View -->
    <div
      v-if="pickerMode === 'calendar'"
      class="calendar-view animate-in fade-in duration-200"
    >
      <div class="grid grid-cols-7 gap-1 text-center">
        <!-- Weekday Headers -->
        <div
          v-for="(day, wi) in weekDays"
          :key="wi"
          class="w-10 aspect-square flex items-center justify-center text-sm font-medium text-outline"
        >
          <slot
            name="weekday"
            :day="day"
            :index="wi"
          >
            {{ day }}
          </slot>
        </div>

        <!-- Days -->
        <div
          v-for="{ date, isVisible, isSelected, isInRange, isToday, isDisabled, isRangeStart, isRangeEnd, dayLabel, dayLabelClass, isDot, dotColor, customClass, dayColorClass } in calendarDays"
          :key="date.toISOString()"
          class="relative w-10 p-0.5 flex flex-col items-center justify-start cursor-pointer group rounded-lg"
          :class="[
            showDayLabel ? 'min-h-[52px]' : 'min-h-9',
            (!isDisabled && isVisible) && 'hover:bg-surface-container',
            (isDisabled && isVisible) && 'cursor-not-allowed opacity-30',
            (isInRange && !isSelected && isVisible) && 'bg-[color-mix(in_srgb,var(--cml-color-current-color,var(--color-primary))_10%,transparent)]',
            (isRangeStart && isVisible) && 'bg-[color-mix(in_srgb,var(--cml-color-current-color,var(--color-primary))_10%,transparent)]',
            (isRangeEnd && isVisible) && 'bg-[color-mix(in_srgb,var(--cml-color-current-color,var(--color-primary))_10%,transparent)]',
            dayColorClass,
            customClass,
          ]"
          @click="(!isDisabled && isVisible) && selectDate(date)"
        >
          <span
            v-if="isVisible"
            class="h-6 aspect-square flex items-center justify-center text-sm transition-all rounded-full shrink-0"
            :class="[
              { 'font-bold': (isToday && !isSelected) || isSelected },
              isSelected ? selectedSurfaceClass : '',
            ]"
          >
            <slot
              name="day"
              :date="date"
              :day="Number(format(date, 'd'))"
              :is-selected="isSelected"
              :is-today="isToday"
            >{{ format(date, 'd') }}</slot>
          </span>
          <span
            v-if="isVisible && dayLabel && showDayLabel"
            class="text-[10px] items-center justify-center leading-[1.1] line-clamp-2 break-all text-center shrink-0"
            :class="dayLabelClass"
          >
            {{ dayLabel }}
          </span>
          <div
            v-if="isVisible && isDot"
            class="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
            :class="{ 'bg-[var(--cml-color-current-on-color)]': isSelected, 'bg-[var(--cml-color-current-color)]': !isSelected && !dotColor }"
            :style="dotColor ? { backgroundColor: dotColor } : {}"
          />
        </div>
      </div>

      <!-- Time Picker Section（可輸入亦可下拉選擇；時/分/秒由下往上關閉；12/24 小時制；數字跟隨 current-color） -->
      <div
        v-if="enableTime && !hideTime"
        class="border-t border-outline mt-4 pt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
      >
        <!-- 單選 -->
        <CamelotInternalTimeRow
          v-if="!isRange"
          v-model:hours="singleTime.t.h"
          v-model:minutes="singleTime.t.m"
          v-model:seconds="singleTime.t.s"
          :precision="timePrecision"
          :hour-format="hourFormat"
          @change="singleTime.apply"
        />
        <!-- 區間：起 / 迄 -->
        <template v-else>
          <div class="flex items-center gap-2">
            <span class="w-6 text-xs text-outline">起</span>
            <CamelotInternalTimeRow
              v-model:hours="startTime.t.h"
              v-model:minutes="startTime.t.m"
              v-model:seconds="startTime.t.s"
              :precision="timePrecision"
              :hour-format="hourFormat"
              @change="startTime.apply"
            />
          </div>
          <div class="flex items-center gap-2">
            <span class="w-6 text-xs text-outline">迄</span>
            <CamelotInternalTimeRow
              v-model:hours="endTime.t.h"
              v-model:minutes="endTime.t.m"
              v-model:seconds="endTime.t.s"
              :precision="timePrecision"
              :hour-format="hourFormat"
              @change="endTime.apply"
            />
          </div>
        </template>
      </div>
    </div>

    <!-- Month Picker View -->
    <div
      v-else-if="pickerMode === 'month'"
      class="month-view grid grid-cols-3 gap-2 px-2 animate-in slide-in-from-bottom-2 duration-200"
      :class="pickerExpand ? 'w-[300px]' : ''"
    >
      <button
        v-for="(month, index) in monthNames"
        :key="month"
        type="button"
        class="py-3 rounded-lg hover:bg-surface-container transition-colors font-medium"
        :class="index === viewDate.getMonth() ? selectedSurfaceClass : 'text-on-surface'"
        @click="selectMonth(index)"
      >
        <slot
          name="month-name"
          :month="month"
          :index="index"
        >
          {{ month }}
        </slot>
      </button>
    </div>

    <!-- Year Picker View -->
    <div
      v-else-if="pickerMode === 'year'"
      class="year-view overflow-hidden animate-in slide-in-from-bottom-2 duration-200"
      :class="pickerExpand ? 'w-[300px]' : ''"
    >
      <div class="flex items-center justify-between mb-2">
        <button
          type="button"
          class="p-1.5 rounded-full hover:bg-surface-container transition-colors disabled:opacity-30 text-on-surface"
          @click="yearPage--"
        >
          <IMaterialSymbolsChevronLeftRounded class="w-6 h-6" />
        </button>
        <span class="text-sm text-outline">{{ yearsRange[0] }} - {{ yearsRange[yearsRange.length - 1] }}</span>
        <button
          type="button"
          class="p-1.5 rounded-full hover:bg-surface-container transition-colors disabled:opacity-30 text-on-surface"
          @click="yearPage++"
        >
          <IMaterialSymbolsChevronRightRounded class="w-6 h-6" />
        </button>
      </div>
      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="year in yearsRange"
          :key="year"
          type="button"
          class="py-3 rounded-lg hover:bg-surface-container transition-colors font-medium text-sm"
          :class="year === viewDate.getFullYear() ? selectedSurfaceClass : 'text-on-surface'"
          @click="selectYear(year)"
        >
          {{ year }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import IMaterialSymbolsChevronLeftRounded from '~icons/material-symbols/chevron-left-rounded'
import IMaterialSymbolsChevronRightRounded from '~icons/material-symbols/chevron-right-rounded'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  format,
  isWithinInterval,
  isToday as isDateToday,
  startOfDay,
  isBefore,
  isAfter,
  addDays,
  setYear,
  setMonth,
  setHours,
  setMinutes,
  setSeconds,
  getHours,
  getMinutes,
  getSeconds,
  getDay,
} from 'date-fns'

export interface CalendarDayAttributes {
  isHoliday?: boolean
  label?: string | null
  labelClass?: string
  disabled?: boolean
  dot?: boolean
  dotColor?: string
  class?: string
}

const props = withDefaults(defineProps<{
  isRange?: boolean
  minDate?: Date | number
  maxDate?: Date | number
  hidePrevMonth?: boolean
  hideNextMonth?: boolean
  enableTime?: boolean
  /** 時間精細度（由下往上關閉）：hour 僅時、minute 時分、second 時分秒 */
  timePrecision?: 'hour' | 'minute' | 'second'
  /** 12 或 24 小時制 */
  hourFormat?: '12' | '24'
  /** 隱藏時間區（多月曆 range 時，只在其中一個月曆顯示時間） */
  hideTime?: boolean
  /** 進入月/年選擇時，撐滿容器寬度並置中（多月曆 range 用，讓選擇器橫跨兩個月曆） */
  pickerExpand?: boolean
  hidePrevArrow?: boolean
  hideNextArrow?: boolean
  getDayAttributes?: (date: Date, dayOfWeek: number) => CalendarDayAttributes | undefined | null
  /** 是否顯示日期下方的 label（節日名等）；關閉則不渲染、格高隨內容緊湊 */
  showDayLabel?: boolean
  /** BCP47 語系（如 en-US / ja-JP）；未給 → 預設中文。給了以 Intl 產生週/月/年月名 */
  locale?: string
  /** 週起始：0=週日、1=週一 */
  weekStartsOn?: 0 | 1
  /** 自訂週名（最高優先，覆蓋 locale/預設） */
  weekdayFormatter?: (date: Date, index: number) => string
  /** 自訂月名（月份選擇格 + 月標題） */
  monthFormatter?: (monthIndex: number) => string
  /** 自訂年標題 */
  yearFormatter?: (year: number) => string
}>(), {
  hidePrevMonth: false,
  hideNextMonth: false,
  enableTime: false,
  timePrecision: 'second',
  hourFormat: '24',
  hidePrevArrow: false,
  hideNextArrow: false,
  showDayLabel: true,
  weekStartsOn: 0,
})

const modelValue = defineModel<Date | number | null>('modelValue')
const rangeValue = defineModel<(Date | number | null)[] | null>('rangeValue')
const viewDate = defineModel<Date>('viewDate', { required: true })

const pickerMode = defineModel<'calendar' | 'month' | 'year'>('pickerMode', { default: 'calendar' })
const yearPage = ref(0)

// 預設中文（未給 locale 時）
const DEFAULT_WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']
const DEFAULT_MONTHS = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

// 參考週：2024-01-07 為週日（dayIndex 0），加 n 天即得對應星期的日期
const WEEKDAY_REF_SUNDAY = new Date(2024, 0, 7)

// 是否走 Intl：有 locale 且非中文。中文（含繁/簡）一律用預設中文格式
// （日一二…、一月…、yyyy年/MM月），避免 Intl 中文週名帶「週/周」等前綴。預設中文即繁中。
const useIntl = computed(() => !!props.locale && !props.locale.toLowerCase().startsWith('zh'))

// 週名（優先序：自訂 fn > Intl(非中文) > 預設中文），依 weekStartsOn 旋轉
const weekDays = computed(() =>
  Array.from({ length: 7 }).map((_, i) => {
    const dayIndex = (props.weekStartsOn + i) % 7
    const refDate = addDays(WEEKDAY_REF_SUNDAY, dayIndex)
    if (props.weekdayFormatter) return props.weekdayFormatter(refDate, i)
    if (useIntl.value) return new Intl.DateTimeFormat(props.locale, { weekday: 'short' }).format(refDate)
    return DEFAULT_WEEKDAYS[dayIndex] as string
  }),
)

// 月名（月份選擇格 + 月標題）
const monthNames = computed(() =>
  Array.from({ length: 12 }).map((_, i) => {
    if (props.monthFormatter) return props.monthFormatter(i)
    if (useIntl.value) return new Intl.DateTimeFormat(props.locale, { month: 'long' }).format(new Date(2024, i, 1))
    return DEFAULT_MONTHS[i] as string
  }),
)

// 年 / 月標題
const yearLabel = computed(() => {
  const year = viewDate.value.getFullYear()
  if (props.yearFormatter) return props.yearFormatter(year)
  if (useIntl.value) return new Intl.DateTimeFormat(props.locale, { year: 'numeric' }).format(viewDate.value)
  return `${format(viewDate.value, 'yyyy')}年`
})
const monthLabel = computed(() => {
  if (props.monthFormatter || useIntl.value) return monthNames.value[viewDate.value.getMonth()] ?? ''
  return `${format(viewDate.value, 'MM')}月`
})

// 各風格的「選中態」表面樣式（日期、月份、年份共用）
const { selectedSurfaceClass } = useCamelotPickerTheme()

// 時間狀態工廠：綁定到某個日期（單選或區間端點），回傳可雙向綁定的 h/m/s 與套用函式
const useTimeState = (
  getDate: () => Date | number | null | undefined,
  setDate: (d: Date) => void,
) => {
  const t = reactive({
    h: 0,
    m: 0,
    s: 0,
  })
  watch(getDate, (val) => {
    if (val) {
      const d = new Date(val)
      t.h = getHours(d)
      t.m = getMinutes(d)
      t.s = getSeconds(d)
    }
  }, { immediate: true })
  const apply = () => {
    const val = getDate()
    if (val) setDate(setSeconds(setMinutes(setHours(new Date(val), t.h), t.m), t.s))
  }
  return {
    t,
    apply,
  }
}

const singleTime = useTimeState(() => modelValue.value, (d) => {
  modelValue.value = d
})
const startTime = useTimeState(() => rangeValue.value?.[0], (d) => {
  rangeValue.value = [d, rangeValue.value?.[1] ?? null]
})
const endTime = useTimeState(() => rangeValue.value?.[1], (d) => {
  rangeValue.value = [rangeValue.value?.[0] ?? null, d]
})

const applyTime = (date: Date) => setSeconds(setMinutes(setHours(date, singleTime.t.h), singleTime.t.m), singleTime.t.s)

const yearsRange = computed(() => {
  const currentYear = new Date().getFullYear() + (yearPage.value * 12)
  return Array.from({ length: 12 }).map((_, i) => currentYear - 5 + i)
})

const calendarDays = computed(() => {
  const monthStart = startOfMonth(viewDate.value)
  const monthEnd = endOfMonth(viewDate.value)
  const start = startOfWeek(monthStart, { weekStartsOn: props.weekStartsOn })
  const days = Array.from({ length: 42 }).map((_, i) => addDays(start, i))

  const rangeStart = rangeValue.value?.[0] ? startOfDay(new Date(rangeValue.value[0])) : null
  const rangeEnd = rangeValue.value?.[1] ? startOfDay(new Date(rangeValue.value[1])) : null

  return days.map((day) => {
    const d = startOfDay(day)
    const isCurrentMonth = isSameMonth(d, viewDate.value)
    const isPrevMonth = isBefore(d, monthStart)
    const isNextMonth = isAfter(d, monthEnd)

    // Visibility logic
    let isVisible = isCurrentMonth
    if (isPrevMonth) isVisible = !props.hidePrevMonth
    if (isNextMonth) isVisible = !props.hideNextMonth

    const dayOfWeek = getDay(d)
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const attrs = props.getDayAttributes?.(d, dayOfWeek)

    const isHoliday = attrs?.isHoliday ?? false
    const dayLabel = attrs?.label ?? null
    const dayLabelClass = attrs?.labelClass ?? ''
    const isDot = attrs?.dot ?? false
    const dotColor = attrs?.dotColor ?? ''
    const customClass = attrs?.class ?? ''

    let isSelected = false
    let isInRange = false
    let isRangeStart = false
    let isRangeEnd = false

    if (props.isRange && rangeStart) {
      isRangeStart = isSameDay(d, rangeStart)
      isRangeEnd = rangeEnd ? isSameDay(d, rangeEnd) : false
      isSelected = isRangeStart || isRangeEnd

      if (rangeStart && rangeEnd) {
        isInRange = isWithinInterval(d, {
          start: rangeStart,
          end: rangeEnd,
        })
      }
    }
    else if (!props.isRange && modelValue.value) {
      isSelected = isSameDay(d, new Date(modelValue.value))
    }

    const isDisabled = attrs?.disabled
      || (props.minDate && isBefore(d, startOfDay(new Date(props.minDate))))
      || (props.maxDate && isAfter(d, startOfDay(new Date(props.maxDate))))

    const isToday = isDateToday(d)

    // Color logic unification
    let dayColorClass = ''

    if (isWeekend || isHoliday) {
      dayColorClass = 'text-error'
    }
    else if (isSelected) {
      dayColorClass = 'text-[var(--cml-color-current-color)]'
    }
    else if (isToday) {
      dayColorClass = 'text-[var(--cml-color-current-color)]'
    }
    else if (isCurrentMonth) {
      dayColorClass = 'text-on-surface'
    }
    else {
      dayColorClass = 'text-outline opacity-50'
    }

    return {
      date: d,
      isCurrentMonth,
      isVisible,
      isSelected,
      isInRange,
      isRangeStart,
      isRangeEnd,
      isToday,
      isDisabled,
      isWeekend,
      isDayHoliday: isHoliday,
      dayLabel,
      dayLabelClass,
      dayColorClass,
      isDot,
      dotColor,
      customClass,
    }
  })
})

const selectDate = (date: Date) => {
  let finalDate = date
  // 單選含時間：套用 time row 的時間；區間則由起/迄 time row 各自處理
  if (props.enableTime && !props.isRange) {
    finalDate = applyTime(date)
  }

  // If selecting a date from adjacent month, we might want to switch the view
  if (!isSameMonth(date, viewDate.value)) {
    viewDate.value = startOfMonth(date)
  }

  if (props.isRange) {
    let newRange: [Date, Date | null]
    const rangeStart = rangeValue.value?.[0] ? new Date(rangeValue.value[0]) : null
    const rangeEnd = rangeValue.value?.[1] ? new Date(rangeValue.value[1]) : null

    if (!rangeStart || rangeEnd) {
      newRange = [finalDate, null]
    }
    else {
      if (isBefore(finalDate, rangeStart)) {
        newRange = [finalDate, rangeStart]
      }
      else {
        newRange = [rangeStart, finalDate]
      }
    }
    rangeValue.value = newRange
  }
  else {
    modelValue.value = finalDate
  }
}

const toggleYearPicker = () => {
  pickerMode.value = pickerMode.value === 'year' ? 'calendar' : 'year'
}

const toggleMonthPicker = () => {
  pickerMode.value = pickerMode.value === 'month' ? 'calendar' : 'month'
}

const selectYear = (year: number) => {
  viewDate.value = setYear(viewDate.value, year)
  pickerMode.value = 'calendar'
}

const selectMonth = (month: number) => {
  viewDate.value = setMonth(viewDate.value, month)
  pickerMode.value = 'calendar'
}

const nextMonth = () => viewDate.value = addMonths(viewDate.value, 1)
const prevMonth = () => viewDate.value = subMonths(viewDate.value, 1)
</script>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
}
</style>

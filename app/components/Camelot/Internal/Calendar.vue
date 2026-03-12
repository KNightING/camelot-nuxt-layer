<template>
  <div class="calendar-container select-none p-3 w-fit min-w-[280px]">
    <!-- Month/Year Picker Header -->
    <div class="flex items-center justify-between mb-4 px-1">
      <div
        v-if="pickerMode === 'calendar' && !hidePrevArrow"
        class="flex items-center gap-1 group"
      >
        <button
          type="button"
          class="p-1.5 rounded-full hover:bg-surface-container transition-colors disabled:opacity-30"
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
          class="px-2 py-1 rounded-md hover:bg-surface-container font-medium text-lg transition-colors"
          @click="toggleYearPicker"
        >
          {{ format(viewDate, 'yyyy') }}年
        </button>
        <button
          type="button"
          class="px-2 py-1 rounded-md hover:bg-surface-container font-medium text-lg transition-colors"
          @click="toggleMonthPicker"
        >
          {{ format(viewDate, 'MM') }}月
        </button>
      </div>

      <div
        v-if="pickerMode === 'calendar' && !hideNextArrow"
        class="flex items-center gap-1"
      >
        <button
          type="button"
          class="p-1.5 rounded-full hover:bg-surface-container transition-colors disabled:opacity-30"
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
      <div class="grid grid-cols-7 gap-y-1 text-center">
        <!-- Weekday Headers -->
        <div
          v-for="day in weekDays"
          :key="day"
          class="h-9 flex items-center justify-center text-sm font-medium text-outline"
        >
          {{ day }}
        </div>

        <!-- Days -->
        <div
          v-for="{ date, isCurrentMonth, isVisible, isSelected, isInRange, isToday, isDisabled, isRangeStart, isRangeEnd } in calendarDays"
          :key="date.toISOString()"
          class="relative h-9 w-9 flex items-center justify-center cursor-pointer group"
          :class="[
            (!isDisabled && isVisible) && 'hover:bg-surface-container rounded-full',
            (isDisabled && isVisible) && 'cursor-not-allowed opacity-30',
            (isInRange && !isSelected && isVisible) && 'bg-primary/10 rounded-none!',
            (isRangeStart && isVisible) && 'bg-primary/10 rounded-l-full!',
            (isRangeEnd && isVisible) && 'bg-primary/10 rounded-r-full!',
          ]"
          @click="(!isDisabled && isVisible) && selectDate(date)"
        >
          <span
            v-if="isVisible"
            class="z-10 w-8 h-8 flex items-center justify-center text-sm transition-all rounded-full"
            :class="{
              'text-primary font-bold': isToday && !isSelected,
              'bg-primary text-on-primary font-bold shadow-sm': isSelected,
              'text-on-surface': !isSelected && !isToday && isCurrentMonth,
              'text-outline opacity-50': !isSelected && !isToday && !isCurrentMonth,
            }"
          >
            {{ format(date, 'd') }}
          </span>
        </div>
      </div>

      <!-- Time Picker Section -->
      <div
        v-if="enableTime"
        class="border-t border-outline mt-4 pt-4 flex items-center justify-center gap-4"
      >
        <label class="flex items-center gap-2">
          <IMaterialSymbolsScheduleRounded class="w-5 h-5 text-outline" />
          <div class="flex items-center bg-surface-container rounded-lg p-1">
            <input
              v-model="hours"
              type="number"
              min="0"
              max="23"
              class="w-10 bg-transparent text-center outline-none font-medium"
              @change="onTimeChange"
            >
            <span class="text-outline">:</span>
            <input
              v-model="minutes"
              type="number"
              min="0"
              max="59"
              class="w-10 bg-transparent text-center outline-none font-medium"
              @change="onTimeChange"
            >
          </div>
        </label>
      </div>
    </div>

    <!-- Month Picker View -->
    <div
      v-else-if="pickerMode === 'month'"
      class="month-view grid grid-cols-3 gap-2 px-2 animate-in slide-in-from-bottom-2 duration-200"
    >
      <button
        v-for="(month, index) in monthNames"
        :key="month"
        type="button"
        class="py-3 rounded-lg hover:bg-surface-container transition-colors font-medium"
        :class="index === viewDate.getMonth() ? 'bg-primary text-on-primary' : 'text-on-surface'"
        @click="selectMonth(index)"
      >
        {{ month }}
      </button>
    </div>

    <!-- Year Picker View -->
    <div
      v-else-if="pickerMode === 'year'"
      class="year-view overflow-hidden animate-in slide-in-from-bottom-2 duration-200"
    >
      <div class="flex items-center justify-between mb-2">
        <button
          type="button"
          class="p-1 hover:bg-surface-container rounded-full"
          @click="yearPage--"
        >
          <IMaterialSymbolsChevronLeftRounded class="w-5 h-5" />
        </button>
        <span class="text-sm text-outline">{{ yearsRange[0] }} - {{ yearsRange[yearsRange.length - 1] }}</span>
        <button
          type="button"
          class="p-1 hover:bg-surface-container rounded-full"
          @click="yearPage++"
        >
          <IMaterialSymbolsChevronRightRounded class="w-5 h-5" />
        </button>
      </div>
      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="year in yearsRange"
          :key="year"
          type="button"
          class="py-3 rounded-lg hover:bg-surface-container transition-colors font-medium text-sm"
          :class="year === viewDate.getFullYear() ? 'bg-primary text-on-primary' : 'text-on-surface'"
          @click="selectYear(year)"
        >
          {{ year }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
  getHours,
  getMinutes,
} from 'date-fns'

const props = withDefaults(defineProps<{
  modelValue?: Date | number | null
  rangeValue?: (Date | number | null)[] | null
  isRange?: boolean
  minDate?: Date | number
  maxDate?: Date | number
  viewDate: Date
  hidePrevMonth?: boolean
  hideNextMonth?: boolean
  enableTime?: boolean
  hidePrevArrow?: boolean
  hideNextArrow?: boolean
}>(), {
  hidePrevMonth: false,
  hideNextMonth: false,
  enableTime: false,
  hidePrevArrow: false,
  hideNextArrow: false,
})

const emit = defineEmits<{
  'update:modelValue': [date: Date]
  'update:rangeValue': [range: [Date, Date | null]]
  'update:viewDate': [date: Date]
}>()

const pickerMode = ref<'calendar' | 'month' | 'year'>('calendar')
const yearPage = ref(0)
const weekDays = ['日', '一', '二', '三', '四', '五', '六']
const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

const hours = ref(0)
const minutes = ref(0)

// Sync time from modelValue
watch(() => props.modelValue, (val) => {
  if (val) {
    const d = new Date(val)
    hours.value = getHours(d)
    minutes.value = getMinutes(d)
  }
}, { immediate: true })

const yearsRange = computed(() => {
  const currentYear = new Date().getFullYear() + (yearPage.value * 12)
  return Array.from({ length: 12 }).map((_, i) => currentYear - 5 + i)
})

const calendarDays = computed(() => {
  const monthStart = startOfMonth(props.viewDate)
  const monthEnd = endOfMonth(props.viewDate)
  const start = startOfWeek(monthStart)
  const days = Array.from({ length: 42 }).map((_, i) => addDays(start, i))

  const rangeStart = props.rangeValue?.[0] ? startOfDay(new Date(props.rangeValue[0])) : null
  const rangeEnd = props.rangeValue?.[1] ? startOfDay(new Date(props.rangeValue[1])) : null

  return days.map((day) => {
    const d = startOfDay(day)
    const isCurrentMonth = isSameMonth(d, props.viewDate)
    const isPrevMonth = isBefore(d, monthStart)
    const isNextMonth = isAfter(d, monthEnd)

    // Visibility logic
    let isVisible = isCurrentMonth
    if (isPrevMonth) isVisible = !props.hidePrevMonth
    if (isNextMonth) isVisible = !props.hideNextMonth

    let isSelected = false
    let isInRange = false
    let isRangeStart = false
    let isRangeEnd = false

    if (props.isRange && rangeStart) {
      isRangeStart = isSameDay(d, rangeStart)
      isRangeEnd = rangeEnd ? isSameDay(d, rangeEnd) : false
      isSelected = isRangeStart || isRangeEnd

      if (rangeStart && rangeEnd) {
        isInRange = isWithinInterval(d, { start: rangeStart, end: rangeEnd })
      }
    }
    else if (!props.isRange && props.modelValue) {
      isSelected = isSameDay(d, new Date(props.modelValue))
    }

    const isDisabled = (props.minDate && isBefore(d, startOfDay(new Date(props.minDate))))
      || (props.maxDate && isAfter(d, startOfDay(new Date(props.maxDate))))

    return {
      date: d,
      isCurrentMonth,
      isVisible,
      isSelected,
      isInRange,
      isRangeStart,
      isRangeEnd,
      isToday: isDateToday(d),
      isDisabled,
    }
  })
})

const selectDate = (date: Date) => {
  let finalDate = date
  if (props.enableTime) {
    finalDate = setHours(setMinutes(date, minutes.value), hours.value)
  }

  // If selecting a date from adjacent month, we might want to switch the view
  if (!isSameMonth(date, props.viewDate)) {
    emit('update:viewDate', startOfMonth(date))
  }

  if (props.isRange) {
    let newRange: [Date, Date | null]
    const rangeStart = props.rangeValue?.[0] ? new Date(props.rangeValue[0]) : null
    const rangeEnd = props.rangeValue?.[1] ? new Date(props.rangeValue[1]) : null

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
    emit('update:rangeValue', newRange)
  }
  else {
    emit('update:modelValue', finalDate)
  }
}

const onTimeChange = () => {
  if (!props.isRange && props.modelValue) {
    const date = setHours(setMinutes(new Date(props.modelValue), minutes.value), hours.value)
    emit('update:modelValue', date)
  }
}

const toggleYearPicker = () => {
  pickerMode.value = pickerMode.value === 'year' ? 'calendar' : 'year'
}

const toggleMonthPicker = () => {
  pickerMode.value = pickerMode.value === 'month' ? 'calendar' : 'month'
}

const selectYear = (year: number) => {
  emit('update:viewDate', setYear(props.viewDate, year))
  pickerMode.value = 'calendar'
}

const selectMonth = (month: number) => {
  emit('update:viewDate', setMonth(props.viewDate, month))
  pickerMode.value = 'calendar'
}

const nextMonth = () => emit('update:viewDate', addMonths(props.viewDate, 1))
const prevMonth = () => emit('update:viewDate', subMonths(props.viewDate, 1))
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

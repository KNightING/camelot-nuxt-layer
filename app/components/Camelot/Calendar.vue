<template>
  <div
    class="w-fit p-2 text-base"
    :class="[roleColorClass, panelClass]"
  >
    <CamelotInternalCalendar
      v-model="selectedDate"
      v-model:view-date="viewDate"
      :min-date="minDate"
      :max-date="maxDate"
      :get-day-attributes="getDayAttributes"
      :show-day-label="showDayLabel"
      :locale="locale"
      :week-starts-on="weekStartsOn"
      :weekday-formatter="weekdayFormatter"
      :month-formatter="monthFormatter"
      :year-formatter="yearFormatter"
    >
      <template
        v-for="(_, name) in $slots"
        #[name]="slotProps"
      >
        <slot
          :name="name"
          v-bind="slotProps"
        />
      </template>
    </CamelotInternalCalendar>
  </div>
</template>

<script setup lang="ts">
import type { CalendarDayAttributes } from './Internal/Calendar.vue'

const props = withDefaults(
  defineProps<{
    minDate?: Date | number
    maxDate?: Date | number
    /** 回傳某一天的標記：忙碌小點、節日標籤、停用等 */
    getDayAttributes?: (date: Date, dayOfWeek: number) => CalendarDayAttributes | undefined | null
    /** 是否顯示日期下方的標籤列；預設關閉，格子較緊湊 */
    showDayLabel?: boolean
    /** BCP 47 語系；未指定時週名與月名使用繁體中文 */
    locale?: string
    /** 週起始：0 週日、1 週一 */
    weekStartsOn?: 0 | 1
    weekdayFormatter?: (date: Date, index: number) => string
    monthFormatter?: (monthIndex: number) => string
    yearFormatter?: (year: number) => string
    color?: CamelotColorRole
  }>(),
  {
    minDate: undefined,
    maxDate: undefined,
    getDayAttributes: undefined,
    showDayLabel: false,
    locale: undefined,
    weekStartsOn: 0,
    weekdayFormatter: undefined,
    monthFormatter: undefined,
    yearFormatter: undefined,
    color: 'primary',
  },
)

/** 選中的日期；null 表示尚未選取 */
const selectedDate = defineModel<Date | null>({ default: null })

const { panelClass } = useCamelotPickerTheme()

const roleColorClass = useCamelotRoleColorClass(() => props.color)

// 目前顯示的月份由元件自己管理，起點是選中日期或今天
const viewDate = ref<Date>(selectedDate.value ?? new Date())

// 外部把選中日期改到別的月份時，顯示的月份跟著過去
watch(selectedDate, (nextDate) => {
  if (nextDate) viewDate.value = nextDate
})
</script>

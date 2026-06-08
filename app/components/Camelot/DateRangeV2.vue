<template>
  <CamelotPopupV2
    v-model:open="open"
    manual
    disabled-same-target-width
    disabled-close-when-scrolling
    :disabled="disabled"
    disabled-shadow
    :popup-class="popupShadowClass"
    :z-index="selectZIndex"
  >
    <slot
      name="default"
      :display-value="displayValue"
      :open="open"
      :disabled="disabled"
      :toggle="togglePopup"
    >
      <label
        ref="triggerRef"
        class="group flex w-fit cursor-pointer items-center gap-2 px-4 py-2 transition-colors"
        :class="[
          roleColorClass,
          triggerClass,
          {
            'border-primary': open && themeMode !== 'aqua',
            'aqua-glow': open && themeMode === 'aqua',
            'border-error!': isError,
            'bg-gray-200! opacity-50': disabled,
          },
        ]"
        @click="togglePopup"
      >
        <IMaterialSymbolsCalendarMonthRounded class="w-5 h-5 text-outline group-hover:text-primary transition-colors shrink-0" />
        <div class="flex items-center gap-1 overflow-hidden">
          <input
            v-bind="$attrs"
            :value="startDisplay"
            type="text"
            class="min-w-0 text-on-surface bg-transparent placeholder:text-on-surface/50 outline-none text-base caret-primary appearance-none cursor-pointer"
            :class="[{ 'text-black!': disabled }, startDisplay ? 'w-[10.5ch]' : 'w-[14ch]']"
            placeholder="請選擇開始日期"
            readonly
          >
          <div class="px-1 text-outline group-hover:text-primary">
            <span>~</span>
          </div>
          <input
            v-bind="$attrs"
            :value="endDisplay"
            type="text"
            class="min-w-0 text-on-surface bg-transparent placeholder:text-on-surface/50 outline-none text-base caret-primary appearance-none cursor-pointer"
            :class="[{ 'text-black!': disabled }, endDisplay ? 'w-[10.5ch]' : 'w-[14ch]']"
            placeholder="請選擇結束日期"
            readonly
          >
        </div>
      </label>
    </slot>

    <template #popup>
      <div
        ref="popupRef"
        class="flex flex-col sm:flex-row"
        :class="[roleColorClass, panelClass, popupPanelShadowFix]"
        @click.stop
      >
        <div class="flex flex-col sm:flex-row">
          <CamelotInternalCalendar
            v-model:range-value="internalValue"
            v-model:view-date="viewDate"
            is-range
            :hide-next-arrow="showSecondCalendar"
            :hide-next-month="showSecondCalendar"
            :min-date="minDate"
            :max-date="maxDate"
            :get-day-attributes="getDayAttributes"
            @update:range-value="onRangeSelect"
          />
          <CamelotInternalCalendar
            v-if="showSecondCalendar"
            v-model:range-value="internalValue"
            is-range
            hide-prev-arrow
            hide-prev-month
            :view-date="nextMonthViewDate"
            :min-date="minDate"
            :max-date="maxDate"
            :get-day-attributes="getDayAttributes"
            @update:view-date="onNextMonthViewDateUpdate"
            @update:range-value="onRangeSelect"
          />
        </div>

        <div
          v-if="!autoApply"
          class="p-3 border-t border-outline flex justify-end gap-2 bg-surface-container-lowest"
        >
          <button
            type="button"
            class="px-4 py-2 rounded-lg text-primary hover:bg-primary/5 transition-colors text-sm font-medium"
            @click="open = false"
          >
            取消
          </button>
          <button
            type="button"
            class="px-4 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary/90 transition-colors text-sm font-medium shadow-sm"
            @click="applyRange"
          >
            確定
          </button>
        </div>
      </div>
    </template>

    <CamelotBaseDialogV2
      v-if="showType === 'dialog'"
      v-model:open="open"
    >
      <!-- dialog 模式：BaseDialogV2 已提供主題外框，不再套 panelClass 以免雙層外框 -->
      <CamelotInternalCalendar
        v-model:range-value="internalValue"
        v-model:view-date="viewDate"
        :class="roleColorClass"
        is-range
        :min-date="minDate"
        :max-date="maxDate"
        :get-day-attributes="getDayAttributes"
        @update:range-value="onRangeSelect"
      />
    </CamelotBaseDialogV2>
  </CamelotPopupV2>
</template>

<script setup lang="ts">
import { format as formatDate, addMonths, subMonths, isSameDay } from 'date-fns'
import type { CalendarDayAttributes } from './Internal/Calendar.vue'

const props = withDefaults(defineProps<{
  minDate?: Date | number
  maxDate?: Date | number
  placeholder?: string
  disabled?: boolean
  isError?: boolean
  showType?: 'auto' | 'popup' | 'dialog'
  selectZIndex?: number
  multiCalendars?: boolean
  autoApply?: boolean
  displayFormat?: (dates: [Date, Date]) => string
  format?: string
  color?: CamelotColorRole
  getDayAttributes?: (date: Date, dayOfWeek: number) => CalendarDayAttributes | undefined | null
}>(), {
  showType: 'auto',
  placeholder: 'Select Date Range',
  multiCalendars: true,
  autoApply: true,
  format: 'yyyy-MM-dd',
  color: 'primary',
})

const roleColorClass = useCamelotRoleColorClass(() => props.color)

const model = defineModel<[Date, Date] | null>()
const open = ref(false)

const {
  themeMode, triggerClass, panelClass,
} = useCamelotPickerTheme()

// 落影改畫在 popup 外層容器（Expanded overflow-hidden 之外，不被方形裁切），圓角對齊面板；
// 面板自身落影移除以免裁切露出方形邊。
const popupShadowClass = computed(() => {
  switch (themeMode.value) {
    case 'aqua':
      return 'shadow-[0_12px_44px_-8px_rgba(0,0,0,0.30)] rounded-3xl'
    case 'cupertino':
      return 'shadow-2xl rounded-2xl'
    case 'scifi':
      return 'shadow-[0_0_24px_color-mix(in_srgb,var(--color-primary)_18%,transparent)] rounded-none'
    default:
      return 'shadow-lg rounded-xl'
  }
})

const popupPanelShadowFix = computed(() => {
  switch (themeMode.value) {
    case 'aqua':
      return 'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5)]!'
    case 'scifi':
      return 'shadow-none!'
    default:
      return ''
  }
})

const triggerRef = useTemplateRef('triggerRef')
const popupRef = useTemplateRef('popupRef')

// Use internal value for the picker state
const internalValue = ref<(Date | null)[]>(model.value ? [model.value[0], model.value[1]] : [null, null])
const viewDate = ref(new Date())
const nextMonthViewDate = computed(() => addMonths(viewDate.value, 1))

const togglePopup = () => {
  if (props.disabled) return
  open.value = !open.value
}

// Better outside click handling（dialog 模式由 BaseDialogV2 自行處理遮罩/Esc 關閉）
onClickOutside(triggerRef, () => {
  if (showType.value === 'popup') {
    open.value = false
  }
}, {
  ignore: [popupRef],
})

// Sync internal value and viewDate when model changes externally
watch(model, (newVal) => {
  if (newVal) {
    internalValue.value = [newVal[0], newVal[1]]
  }
  else {
    internalValue.value = [null, null]
  }
}, { deep: true })

// Sync viewDate when popup opens
watch(open, (isOpen) => {
  if (isOpen) {
    if (model.value && model.value[0]) {
      viewDate.value = new Date(model.value[0])
    }
    else {
      viewDate.value = new Date()
    }
    internalValue.value = model.value ? [model.value[0], model.value[1]] : [null, null]
  }
})

const startDisplay = computed(() => {
  if (!model.value || !model.value[0]) return ''
  return formatDate(new Date(model.value[0]), props.format)
})

const endDisplay = computed(() => {
  if (!model.value || !model.value[1]) return ''
  return formatDate(new Date(model.value[1]), props.format)
})

const displayValue = computed(() => {
  if (!model.value || !model.value[0] || !model.value[1]) {
    return props.placeholder
  }

  if (props.displayFormat) {
    return props.displayFormat(model.value as [Date, Date])
  }

  return `${startDisplay.value} ~ ${endDisplay.value}`
})

const onViewDateUpdate = (date: Date) => {
  viewDate.value = date
}

const onNextMonthViewDateUpdate = (date: Date) => {
  viewDate.value = subMonths(date, 1)
}

const onRangeSelect = (range: (Date | number | null)[] | null | undefined) => {
  if (!range || !Array.isArray(range)) return
  internalValue.value = [range[0] as Date | null, range[1] as Date | null]

  if (range[0] && range[1]) {
    if (props.autoApply) {
      applyRange()
    }
  }
}

const applyRange = () => {
  if (internalValue.value[0] && internalValue.value[1]) {
    model.value = [internalValue.value[0], internalValue.value[1]]
    open.value = false
  }
}

const { isMobile } = useDeviceBreakpoints()

const showType = computed<'popup' | 'dialog'>(() => {
  // auto：手機改用置中 modal（dialog），桌機用 popup
  if (props.showType === 'auto') {
    return isMobile.value ? 'dialog' : 'popup'
  }
  return props.showType ?? 'dialog'
})

// 第二個月曆是否顯示（多月曆且非手機）。決定第一個月曆是否要自行顯示「下個月」箭頭
const showSecondCalendar = computed(() => props.multiCalendars && !isMobile.value)
</script>

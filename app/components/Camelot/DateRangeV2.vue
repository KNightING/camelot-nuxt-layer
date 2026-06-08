<template>
  <div
    class="flex w-full flex-col gap-1.5"
    :class="roleColorClass"
  >
    <span
      v-if="label"
      class="pl-1 text-sm font-medium text-on-surface"
    >{{ label }}<span
      v-if="required"
      class="ml-0.5 text-error"
    >*</span></span>

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
          class="group flex w-full cursor-pointer items-center gap-2 px-4 py-2 transition-colors"
          :class="[
            triggerClass,
            {
              'border-[var(--cml-color-current-color)]': open && themeMode !== 'aqua',
              'aqua-glow': open && themeMode === 'aqua',
              'border-error!': isError,
              'bg-gray-200! opacity-50': disabled,
            },
          ]"
          @click="togglePopup"
        >
          <IMaterialSymbolsCalendarMonthRounded class="w-5 h-5 text-outline group-hover:text-[var(--cml-color-current-color)] transition-colors shrink-0" />
          <div class="flex items-center gap-1 overflow-hidden">
            <input
              v-bind="$attrs"
              :value="startDisplay"
              type="text"
              class="min-w-0 text-on-surface bg-transparent placeholder:text-on-surface/50 outline-none text-base caret-[var(--cml-color-current-color)] appearance-none cursor-pointer"
              :class="[{ 'text-black!': disabled }, startDisplay ? 'w-[10.5ch]' : 'w-[14ch]']"
              placeholder="請選擇起日"
              readonly
            >
            <div class="px-1 text-outline group-hover:text-[var(--cml-color-current-color)]">
              <span>~</span>
            </div>
            <input
              v-bind="$attrs"
              :value="endDisplay"
              type="text"
              class="min-w-0 text-on-surface bg-transparent placeholder:text-on-surface/50 outline-none text-base caret-[var(--cml-color-current-color)] appearance-none cursor-pointer"
              :class="[{ 'text-black!': disabled }, endDisplay ? 'w-[10.5ch]' : 'w-[14ch]']"
              placeholder="請選擇迄日"
              readonly
            >
          </div>
        </label>
      </slot>

      <template
        v-if="showType === 'popup'"
        #popup
      >
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
              :enable-time="enableTime"
              :time-precision="timePrecision"
              :hour-format="hourFormat"
              :hide-next-arrow="showSecondCalendar"
              :hide-next-month="showSecondCalendar"
              :min-date="minDate"
              :max-date="maxDate"
              :get-day-attributes="getDayAttributes"
              @update:range-value="onRangeSelect"
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
            <CamelotInternalCalendar
              v-if="showSecondCalendar"
              v-model:range-value="internalValue"
              is-range
              :enable-time="enableTime"
              :time-precision="timePrecision"
              :hour-format="hourFormat"
              hide-prev-arrow
              hide-prev-month
              :view-date="nextMonthViewDate"
              :min-date="minDate"
              :max-date="maxDate"
              :get-day-attributes="getDayAttributes"
              @update:view-date="onNextMonthViewDateUpdate"
              @update:range-value="onRangeSelect"
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

          <div
            v-if="!autoApply || enableTime"
            class="p-3 border-t border-outline flex justify-end gap-2 bg-surface-container-lowest"
          >
            <button
              type="button"
              class="px-4 py-2 rounded-lg text-[var(--cml-color-current-color)] hover:bg-[color-mix(in_srgb,var(--cml-color-current-color)_8%,transparent)] transition-colors text-sm font-medium"
              @click="open = false"
            >
              取消
            </button>
            <button
              type="button"
              class="px-4 py-2 rounded-lg bg-[var(--cml-color-current-color)] text-[var(--cml-color-current-on-color)] hover:opacity-90 transition-colors text-sm font-medium shadow-sm"
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
          :enable-time="enableTime"
          :time-precision="timePrecision"
          :hour-format="hourFormat"
          :min-date="minDate"
          :max-date="maxDate"
          :get-day-attributes="getDayAttributes"
          @update:range-value="onRangeSelect"
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
      </CamelotBaseDialogV2>
    </CamelotPopupV2>
  </div>
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
  enableTime?: boolean
  timePrecision?: 'hour' | 'minute' | 'second'
  hourFormat?: '12' | '24'
  color?: CamelotColorRole
  label?: string
  required?: boolean
  getDayAttributes?: (date: Date, dayOfWeek: number) => CalendarDayAttributes | undefined | null
}>(), {
  showType: 'auto',
  placeholder: 'Select Date Range',
  multiCalendars: true,
  autoApply: true,
  format: 'yyyy-MM-dd',
  enableTime: false,
  timePrecision: 'second',
  hourFormat: '24',
  color: 'primary',
})

// 含時間時自動延伸顯示格式
const effectiveFormat = computed(() => {
  if (!props.enableTime) return props.format
  let t = props.hourFormat === '12' ? 'hh' : 'HH'
  if (props.timePrecision !== 'hour') t += ':mm'
  if (props.timePrecision === 'second') t += ':ss'
  if (props.hourFormat === '12') t += ' a'
  return `${props.format} ${t}`
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
  return formatDate(new Date(model.value[0]), effectiveFormat.value)
})

const endDisplay = computed(() => {
  if (!model.value || !model.value[1]) return ''
  return formatDate(new Date(model.value[1]), effectiveFormat.value)
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
    // 含時間時不自動套用，讓使用者調整起/迄時間後再確定
    if (props.autoApply && !props.enableTime) {
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

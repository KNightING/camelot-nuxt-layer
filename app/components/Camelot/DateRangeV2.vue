<template>
  <CamelotPopupV2
    v-model:open="open"
    manual
    disabled-same-target-width
    disabled-close-when-scrolling
    :disabled="disabled"
    disabled-shadow
    :z-index="selectZIndex"
    popup-class="shadow-xl rounded-xl"
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
        class="w-fit border border-outline bg-surface-container-lowest has-focus:border-primary rounded-lg px-4 flex items-center gap-2 group cursor-pointer transition-colors hover:border-primary"
        :class="{
          'border-primary': open,
          'border-error!': isError,
          'bg-gray-200! opacity-50': disabled,
        }"
        @click="togglePopup"
      >
        <IMaterialSymbolsCalendarMonthRounded class="w-5 h-5 text-outline group-hover:text-primary transition-colors shrink-0" />
        <div class="flex-1 flex items-center gap-1 overflow-hidden ">
          <input
            v-bind="$attrs"
            :value="startDisplay"
            type="text"
            class=" min-w-0 w-[14ch] flex-1 text-on-surface bg-transparent placeholder:text-on-surface/50 outline-none text-base caret-primary appearance-none cursor-pointer"
            :class="{ 'text-black!': disabled }"
            placeholder="請選擇開始日期"
            readonly
          >
          <div class="py-2 px-1  text-outline group-hover:text-primary">
            <span>~</span>
          </div>
          <input
            v-bind="$attrs"
            :value="endDisplay"
            type="text"
            class=" min-w-0 w-[14ch] flex-1 text-on-surface bg-transparent placeholder:text-on-surface/50 outline-none text-base caret-primary appearance-none cursor-pointer"
            :class="{ 'text-black!': disabled }"
            placeholder="請選擇結束日期"
            readonly
          >
        </div>
      </label>
    </slot>

    <template #popup>
      <div
        ref="popupRef"
        class="bg-surface flex flex-col sm:flex-row rounded-xl"
        @click.stop
      >
        <div class="flex flex-col sm:flex-row">
          <CamelotInternalCalendar
            v-model:range-value="internalValue"
            v-model:view-date="viewDate"
            is-range
            hide-next-arrow
            hide-next-month
            :min-date="minDate"
            :max-date="maxDate"
            :get-day-attributes="getDayAttributes"
            @update:range-value="onRangeSelect"
          />
          <CamelotInternalCalendar
            v-if="multiCalendars"
            v-model:range-value="internalValue"
            is-range
            hide-prev-arrow
            hide-prev-month
            class="hidden sm:block"
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
      <div class="bg-surface rounded-xl overflow-hidden">
        <CamelotInternalCalendar
          v-model:range-value="internalValue"
          v-model:view-date="viewDate"
          is-range
          :min-date="minDate"
          :max-date="maxDate"
          :get-day-attributes="getDayAttributes"
          @update:range-value="onRangeSelect"
        />
      </div>
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
  getDayAttributes?: (date: Date, dayOfWeek: number) => CalendarDayAttributes | undefined | null
}>(), {
  showType: 'auto',
  placeholder: 'Select Date Range',
  multiCalendars: true,
  autoApply: true,
  format: 'yyyy-MM-dd',
})

const model = defineModel<[Date, Date] | null>()
const open = ref(false)

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

// Better outside click handling
onClickOutside(triggerRef, () => {
  open.value = false
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

const showType = computed<'popup' | 'dialog'>(() => {
  if (props.showType === 'auto') {
    return 'popup'
  }
  return props.showType ?? 'dialog'
})
</script>

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
      <div
        ref="triggerRef"
        class="min-w-[16ch] border border-outline bg-surface-container-lowest has-focus:border-primary rounded-lg px-4 py-2 flex items-center gap-2 group cursor-pointer transition-colors"
        :class="{
          'border-primary': open,
          'border-error!': isError,
          'bg-gray-200! opacity-50': disabled,
        }"
        @click="togglePopup"
      >
        <IMaterialSymbolsCalendarMonthRounded class="w-5 h-5 text-outline group-hover:text-primary transition-colors shrink-0" />
        <span class="flex-1 text-on-surface text-base truncate">
          {{ displayValue }}
        </span>
      </div>
    </slot>

    <template #popup>
      <div
        ref="popupRef"
        class="bg-surface flex flex-col sm:flex-row rounded-xl"
        @click.stop
      >
        <div class="flex flex-col sm:flex-row">
          <CamelotInternalCalendar
            is-range
            hide-next-arrow
            hide-next-month
            :range-value="internalValue"
            :view-date="viewDate"
            :min-date="minDate"
            :max-date="maxDate"
            @update:view-date="onViewDateUpdate"
            @update:range-value="onRangeSelect"
          />
          <CamelotInternalCalendar
            v-if="multiCalendars"
            is-range
            hide-prev-arrow
            hide-prev-month
            class="hidden sm:block"
            :range-value="internalValue"
            :view-date="nextMonthViewDate"
            :min-date="minDate"
            :max-date="maxDate"
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
          is-range
          :range-value="internalValue"
          :view-date="viewDate"
          :min-date="minDate"
          :max-date="maxDate"
          @update:view-date="onViewDateUpdate"
          @update:range-value="onRangeSelect"
        />
      </div>
    </CamelotBaseDialogV2>
  </CamelotPopupV2>
</template>

<script setup lang="ts">
import { format as formatDate, addMonths, subMonths, isSameDay } from 'date-fns'

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

const displayValue = computed(() => {
  if (!model.value || !model.value[0] || !model.value[1]) {
    return props.placeholder
  }

  if (props.displayFormat) {
    return props.displayFormat(model.value as [Date, Date])
  }

  try {
    const start = formatDate(new Date(model.value[0]), props.format)
    const end = formatDate(new Date(model.value[1]), props.format)
    return `${start} - ${end}`
  }
  catch (e) {
    return props.placeholder
  }
})

const onViewDateUpdate = (date: Date) => {
  viewDate.value = date
}

const onNextMonthViewDateUpdate = (date: Date) => {
  viewDate.value = subMonths(date, 1)
}

const onRangeSelect = (range: [Date, Date | null]) => {
  internalValue.value = [range[0], range[1]]

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

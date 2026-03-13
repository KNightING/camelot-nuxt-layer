<template>
  <CamelotPopupV2
    v-model:open="open"
    manual
    disabled-same-target-width
    :disabled="disabled"
    disabled-shadow
    :z-index="selectZIndex"
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
        class="border-[1.5px] border-outline rounded-lg flex items-center px-5 py-[12px] gap-3 cursor-pointer hover:border-primary transition-colors bg-surface"
        :class="{
          'border-primary': open,
          'border-error!': isError,
          'bg-gray-200! opacity-50': disabled,
        }"
        @click="togglePopup"
      >
        <IMaterialSymbolsCalendarMonthRounded class="w-6 h-6 text-on-surface shrink-0" />
        <span class="flex-1 text-on-surface text-[16px] truncate">
          {{ displayValue }}
        </span>
      </div>
    </slot>

    <template #popup>
      <div
        ref="popupRef"
        class="bg-surface shadow-xl rounded-xl border border-outline overflow-hidden"
        @click.stop
      >
        <VueDatePicker
          v-model="internalValue"
          range
          inline
          :multi-calendars="multiCalendars"
          :auto-apply="autoApply"
          :time-config="{ enableTimePicker: false }"
          :week-start="0"
          :min-date="minDate"
          :max-date="maxDate"
          :format="internalFormat"
          @update:model-value="onUpdate"
        />
      </div>
    </template>

    <CamelotBaseDialogV2
      v-if="showType === 'dialog'"
      v-model:open="open"
    >
      <VueDatePicker
        v-model="internalValue"
        range
        inline
        :multi-calendars="multiCalendars"
        :auto-apply="autoApply"
        :time-config="{ enableTimePicker: false }"
        :week-start="0"
        :min-date="minDate"
        :max-date="maxDate"
        :format="internalFormat"
        @update:model-value="onUpdate"
      />
    </CamelotBaseDialogV2>
  </CamelotPopupV2>
</template>

<script setup lang="ts">
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { format as formatDate } from 'date-fns'

const props = withDefaults(defineProps<{
  minDate?: Date
  maxDate?: Date
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
const internalValue = ref<[Date, Date] | null>(model.value ? [...model.value] : null)

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

// Sync internal value when model changes externally
watch(model, (newVal) => {
  if (newVal) {
    internalValue.value = [...newVal]
  }
}, { deep: true })

// Sync internal value when popup opens
watch(open, (isOpen) => {
  if (isOpen) {
    internalValue.value = model.value ? [...model.value] : null
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
    const start = formatDate(model.value[0], props.format)
    const end = formatDate(model.value[1], props.format)
    return `${start} - ${end}`
  }
  catch (e) {
    return props.placeholder
  }
})

const internalFormat = (dates: (Date | null)[]) => {
  if (!dates || dates.length < 2 || !dates[0] || !dates[1]) return ''
  try {
    const start = formatDate(dates[0], props.format)
    const end = formatDate(dates[1], props.format)
    return `${start} - ${end}`
  }
  catch (e) {
    return ''
  }
}

const onUpdate = (val: any) => {
  if (val && val[0] && val[1]) {
    model.value = [val[0], val[1]]
    // Only close if autoApply is enabled
    if (props.autoApply) {
      open.value = false
    }
  }
}
</script>

<style scoped>
input[type="date"]::-webkit-inner-spin-button,
input[type="date"]::-webkit-calendar-picker-indicator {
    display: none;
    -webkit-appearance: none;
}

:deep(.dp__theme_light),
:deep(.dp__theme_dark) {
  --dp-primary-color: rgb(var(--cml-c-m3-primary));
  --dp-background-color: #fff;
  --dp-text-color: #212121;
  --dp-hover-color: #f3f3f3;
  --dp-hover-text-color: #212121;
  --dp-hover-icon-color: #959595;
  --dp-primary-disabled-color: #6bacea;
  --dp-primary-text-color: #f8f5f5;
  --dp-secondary-color: #c0c4cc;
  --dp-border-color: #ddd;
  --dp-menu-border-color: #ddd;
  --dp-border-color-hover: #aaaeb7;
  --dp-border-color-focus: #aaaeb7;
  --dp-disabled-color: #f6f6f6;
  --dp-scroll-bar-background: #f3f3f3;
  --dp-scroll-bar-color: #959595;
  --dp-success-color: #76d275;
  --dp-success-color-disabled: #a3d9b1;
  --dp-icon-color: #959595;
  --dp-danger-color: #ff6f60;
  --dp-marker-color: #ff6f60;
  --dp-tooltip-color: #fafafa;
  --dp-disabled-color-text: #8e8e8e;
  --dp-highlight-color: rgb(25 118 210 / 10%);
  --dp-range-between-dates-background-color: var(--dp-hover-color, #f3f3f3);
  --dp-range-between-dates-text-color: var(--dp-hover-text-color, #212121);
  --dp-range-between-border-color: var(--dp-hover-color, #f3f3f3);
}
:deep(.dp__main) {
  font-family: inherit;
}

:deep(.dp__input_wrap) {
  display: none;
}
</style>

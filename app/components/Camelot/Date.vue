<template>
  <CamelotPopupV2
    v-model:open="open"
    disable-width-with-target
    class="!w-full"
    :disabled="disabled"
    :z-index="selectZIndex"
  >
    <label
      class="min-w-[16ch] w-full border bg-surface-container-lowest border-outline has-[:focus]:border-primary rounded-lg px-4 py-2 flex gap-2"
      :class="{
        'border-input-focus': isFocus,
        '!border-error': isError,
        '!bg-gray-200': disabled,
      }"
    >
      <input
        v-bind="$attrs"
        v-model="inputModel"
        type="text"
        class="min-w-0 w-0 flex-1 bg-transparent placeholder:text-gray-700 outline-none text-base caret-primary-focus appearance-none"
        :class="{
          '!text-black': disabled,
        }"
        :maxlength="10"
        :placeholder="placeholder"
        readonly
        @focus="isFocus = true"
        @blur="isFocus = false"
      >
      <!-- <img
        class="ml-1"
        src="/assets/images/calendar.svg"
        @click="open = true"
      > -->
    </label>

    <CamelotBaseDialogV2
      v-if="showType === 'dialog'"
      v-model:open="open"
    >
      <VueDatePicker
        v-model="model"
        inline
        auto-apply
        :enable-time-picker="false"
        :min-date="minDate"
        :max-date="maxDate"
        :week-start="0"
        :disabled-dates="disabledDates"
        :allowed-dates="allowedDates"
      />
    </CamelotBaseDialogV2>

    <template
      v-if="showType === 'popup'"
      #popup
    >
      <VueDatePicker
        v-model="model"
        inline
        auto-apply
        :enable-time-picker="false"
        :min-date="minDate"
        :max-date="maxDate"
        :week-start="0"
        :disabled-dates="disabledDates"
        :allowed-dates="allowedDates"
      />
    </template>
  </CamelotPopupV2>
</template>

<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { format, toDate, getDay } from 'date-fns'

const props = withDefaults(defineProps<{
  minDate?: Date
  maxDate?: Date
  disableDaysOfWeekList?: number[]
  isError?: boolean
  placeholder?: string
  allowedDates?: string[] | Date[]
  disabled?: boolean
  showType?: 'auto' | 'popup' | 'dialog'
  selectZIndex?: number
}>(), {
  showType: 'auto',
})

const model = defineModel<Date | number>()

const open = ref(false)

const inputModel = defineModel<string>('input')

watch(model, (nV) => {
  if (nV instanceof Date || typeof nV === 'number') {
    try {
      inputModel.value = format(nV, 'yyyy-MM-dd')
    } catch (e) {
      inputModel.value = ''
    }
  }
  open.value = false
  // if (pickerValue.value === 0) {
  //   if (nV instanceof Date) {
  //     pickerValue.value = nV.getTime()
  //   } else if (typeof nV === 'number') {
  //     pickerValue.value = nV
  //   }
  // }
}, { immediate: true })

const isFocus = ref(false)

const disabledDates = (data: Date) => {
  return false
}

const showType = computed<'popup' | 'dialog'>(() => {
  if (props.showType === 'auto') {
    return 'popup'
  }
  return props.showType ?? 'dialog'
})
</script>

<style scoped>
input[type="date"]::-webkit-inner-spin-button,
input[type="date"]::-webkit-calendar-picker-indicator {
    display: none;
    -webkit-appearance: none;
}

:deep(.dp__theme_light),
:deep(.dp__theme_dark) {
  --dp-primary-color: rgb(var(--camelot-m3-primary));
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
</style>

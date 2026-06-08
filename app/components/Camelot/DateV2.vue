<template>
  <CamelotPopupV2
    v-model:open="open"
    manual
    disabled-same-target-width
    disabled-close-when-scrolling
    :disabled="disabled"
    disabled-shadow
    popup-class="shadow-xl rounded-xl"
    :z-index="selectZIndex"
  >
    <label
      ref="triggerRef"
      class="group flex w-full min-w-[16ch] cursor-pointer items-center gap-2 px-4 py-2 transition-colors"
      :class="[
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
      <IMaterialSymbolsCalendarMonthRounded
        class="w-5 h-5 text-outline group-hover:text-primary transition-colors"
        @click.stop="open = true"
      />
      <input
        v-bind="$attrs"
        v-model="inputModel"
        type="text"
        class="min-w-0 w-0 flex-1 text-on-surface bg-transparent placeholder:text-on-surface outline-none text-base caret-primary appearance-none cursor-pointer"
        :class="{
          'text-black!': disabled,
        }"
        :maxlength="10"
        :placeholder="placeholder"
        readonly
      >

    </label>

    <CamelotBaseDialogV2
      v-if="showType === 'dialog'"
      v-model:open="open"
    >
      <div
        class="overflow-hidden shadow-sm"
        :class="panelClass"
      >
        <CamelotInternalCalendar
          v-model="model"
          v-model:view-date="viewDate"
          :min-date="minDate"
          :max-date="maxDate"
          :enable-time="enableTime"
          :get-day-attributes="getDayAttributes"
          @update:model-value="onDateSelect"
        />
      </div>
    </CamelotBaseDialogV2>

    <template
      v-if="showType === 'popup'"
      #popup
    >
      <div
        ref="popupRef"
        :class="panelClass"
      >
        <CamelotInternalCalendar
          v-model="model"
          v-model:view-date="viewDate"
          :min-date="minDate"
          :max-date="maxDate"
          :enable-time="enableTime"
          :get-day-attributes="getDayAttributes"
          @update:model-value="onDateSelect"
        />
      </div>
    </template>
  </CamelotPopupV2>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import type { CalendarDayAttributes } from './Internal/Calendar.vue'

const props = withDefaults(defineProps<{
  minDate?: Date | number
  maxDate?: Date | number
  disableDaysOfWeekList?: number[]
  isError?: boolean
  placeholder?: string
  allowedDates?: string[] | Date[]
  disabled?: boolean
  showType?: 'auto' | 'popup' | 'dialog'
  selectZIndex?: number
  enableTime?: boolean
  getDayAttributes?: (date: Date, dayOfWeek: number) => CalendarDayAttributes | undefined | null
}>(), {
  showType: 'auto',
  placeholder: 'YYYY-MM-DD',
  enableTime: false,
})

const model = defineModel<Date | number>()
const inputModel = defineModel<string>('input')

const open = ref(false)
const viewDate = ref(new Date())

const {
  themeMode, triggerClass, panelClass,
} = useCamelotPickerTheme()

const triggerRef = useTemplateRef('triggerRef')
const popupRef = useTemplateRef('popupRef')

// Better outside click handling
onClickOutside(triggerRef, () => {
  open.value = false
}, {
  ignore: [popupRef],
})

// Sync viewDate with model when opened
watch(open, (isOpen) => {
  if (isOpen && model.value) {
    viewDate.value = new Date(model.value)
  }
})

watch(model, (nV) => {
  if (nV) {
    try {
      const formatStr = props.enableTime ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd'
      inputModel.value = format(new Date(nV), formatStr)
    }
    catch (e) {
      inputModel.value = ''
    }
  }
}, { immediate: true })

const togglePopup = () => {
  if (!props.disabled) {
    open.value = !open.value
  }
}

const onDateSelect = (date: Date | number | null | undefined) => {
  if (!date) return
  model.value = date
  if (!props.enableTime) {
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

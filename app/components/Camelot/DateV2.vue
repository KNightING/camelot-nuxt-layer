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
    <label
      ref="triggerRef"
      class="group flex w-full min-w-[16ch] cursor-pointer items-center gap-2 px-4 py-2 transition-colors"
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
      <!-- dialog 模式：BaseDialogV2 已提供主題外框，不再套 panelClass 以免雙層外框 -->
      <CamelotInternalCalendar
        v-model="model"
        v-model:view-date="viewDate"
        :class="roleColorClass"
        :min-date="minDate"
        :max-date="maxDate"
        :enable-time="enableTime"
        :get-day-attributes="getDayAttributes"
        @update:model-value="onDateSelect"
      />
    </CamelotBaseDialogV2>

    <template
      v-if="showType === 'popup'"
      #popup
    >
      <div
        ref="popupRef"
        :class="[roleColorClass, panelClass, popupPanelShadowFix]"
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
  color?: CamelotColorRole
  getDayAttributes?: (date: Date, dayOfWeek: number) => CalendarDayAttributes | undefined | null
}>(), {
  showType: 'auto',
  placeholder: 'YYYY-MM-DD',
  enableTime: false,
  color: 'primary',
})

const roleColorClass = useCamelotRoleColorClass(() => props.color)

const model = defineModel<Date | number>()
const inputModel = defineModel<string>('input')

const open = ref(false)
const viewDate = ref(new Date())

const {
  themeMode, triggerClass, panelClass,
} = useCamelotPickerTheme()

// 落影改畫在 popup 外層容器（位於 Expanded 的 overflow-hidden 之外，不會被方形裁切），
// 圓角需與面板一致；面板自身的落影則移除，避免被裁切後露出方形邊。
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

// Better outside click handling（dialog 模式由 BaseDialogV2 自行處理遮罩/Esc 關閉，
// 不可由 triggerRef 的 onClickOutside 介入，否則開啟當下即被關閉）
onClickOutside(triggerRef, () => {
  if (showType.value === 'popup') {
    open.value = false
  }
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

const { isMobile } = useDeviceBreakpoints()

const showType = computed<'popup' | 'dialog'>(() => {
  // auto：手機改用置中 modal（dialog），桌機用 popup
  if (props.showType === 'auto') {
    return isMobile.value ? 'dialog' : 'popup'
  }
  return props.showType ?? 'dialog'
})
</script>

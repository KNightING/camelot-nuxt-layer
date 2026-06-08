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
              :class="{ 'text-black!': disabled }"
              :style="{ width: startInputWidth }"
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
              :class="{ 'text-black!': disabled }"
              :style="{ width: endInputWidth }"
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
          class="flex flex-col"
          :class="[roleColorClass, panelClass, popupPanelShadowFix]"
          @click.stop
        >
          <div
            ref="calRowRef"
            class="flex flex-col sm:flex-row"
            :style="anyPicking && pinnedRowWidth ? { width: pinnedRowWidth + 'px' } : undefined"
          >
            <CamelotInternalCalendar
              v-show="picker2 === 'calendar'"
              v-model:range-value="internalValue"
              v-model:view-date="viewDate"
              v-model:picker-mode="picker1"
              is-range
              hide-time
              :picker-expand="showSecondCalendar"
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
              v-show="picker1 === 'calendar'"
              v-model:range-value="internalValue"
              v-model:picker-mode="picker2"
              is-range
              :picker-expand="showSecondCalendar"
              :enable-time="enableTime"
              :time-precision="timePrecision"
              :hour-format="hourFormat"
              hide-time
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

          <!-- 起/迄時間：置中於月曆之下；雙月曆並排、單月曆垂直堆疊 -->
          <div
            v-if="enableTime"
            class="mt-1 flex items-center justify-center border-t border-outline px-3 py-3"
            :class="showSecondCalendar ? 'flex-wrap gap-x-8 gap-y-2' : 'flex-col gap-2'"
          >
            <div class="flex items-center gap-2">
              <span class="w-6 text-xs text-outline">起</span>
              <CamelotInternalTimeRow
                v-model:hours="startTime.t.h"
                v-model:minutes="startTime.t.m"
                v-model:seconds="startTime.t.s"
                :precision="timePrecision"
                :hour-format="hourFormat"
                @change="startTime.apply"
              />
            </div>
            <div class="flex items-center gap-2">
              <span class="w-6 text-xs text-outline">迄</span>
              <CamelotInternalTimeRow
                v-model:hours="endTime.t.h"
                v-model:minutes="endTime.t.m"
                v-model:seconds="endTime.t.s"
                :precision="timePrecision"
                :hour-format="hourFormat"
                @change="endTime.apply"
              />
            </div>
            <CamelotButton
              label="確認"
              :color="color"
              @click="confirmRange"
            />
          </div>
        </div>
      </template>

      <CamelotBaseDialogV2
        v-if="showType === 'dialog'"
        v-model:open="open"
      >
        <!-- dialog 模式：BaseDialogV2 已提供主題外框；小螢幕/橫向時可捲動避免被裁切 -->
        <div class="max-h-[82dvh] overflow-y-auto overscroll-contain">
          <CamelotInternalCalendar
            v-model:range-value="internalValue"
            v-model:view-date="viewDate"
            :class="roleColorClass"
            is-range
            hide-time
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

          <!-- 單月曆（手機）：起/迄垂直置中於月曆之下 -->
          <div
            v-if="enableTime"
            class="mt-1 flex flex-col items-center gap-2 border-t border-outline px-3 py-3"
          >
            <div class="flex items-center gap-2">
              <span class="w-6 text-xs text-outline">起</span>
              <CamelotInternalTimeRow
                v-model:hours="startTime.t.h"
                v-model:minutes="startTime.t.m"
                v-model:seconds="startTime.t.s"
                :precision="timePrecision"
                :hour-format="hourFormat"
                @change="startTime.apply"
              />
            </div>
            <div class="flex items-center gap-2">
              <span class="w-6 text-xs text-outline">迄</span>
              <CamelotInternalTimeRow
                v-model:hours="endTime.t.h"
                v-model:minutes="endTime.t.m"
                v-model:seconds="endTime.t.s"
                :precision="timePrecision"
                :hour-format="hourFormat"
                @change="endTime.apply"
              />
            </div>
            <CamelotButton
              label="確認"
              :color="color"
              @click="confirmRange"
            />
          </div>
        </div>
      </CamelotBaseDialogV2>
    </CamelotPopupV2>
  </div>
</template>

<script setup lang="ts">
import {
  format as formatDate, addMonths, subMonths, isSameDay,
  setHours, setMinutes, setSeconds, getHours, getMinutes, getSeconds,
} from 'date-fns'
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

// 月/年選擇模式：任一月曆進入選擇時，隱藏另一個，讓選擇器橫跨兩個月曆並置中
const picker1 = ref<'calendar' | 'month' | 'year'>('calendar')
const picker2 = ref<'calendar' | 'month' | 'year'>('calendar')
const anyPicking = computed(() => picker1.value !== 'calendar' || picker2.value !== 'calendar')

// 選擇器要橫跨兩個月曆：隱藏另一個月曆後版面會收縮，故記住雙月曆時的列寬並在選擇期間釘住
const calRowRef = useTemplateRef('calRowRef')
const { width: calRowWidth } = useElementSize(calRowRef)
const pinnedRowWidth = ref(0)
watch(calRowWidth, (w) => {
  if (!anyPicking.value && w) pinnedRowWidth.value = Math.round(w)
})
const nextMonthViewDate = computed(() => addMonths(viewDate.value, 1))

// 起/迄時間狀態（綁定到 internalValue 端點），時間區塊渲染於兩個月曆之下而非月曆內
const makeTime = (idx: 0 | 1) => {
  const t = reactive({
    h: 0,
    m: 0,
    s: 0,
  })
  watch(() => internalValue.value[idx], (val) => {
    if (val) {
      const d = new Date(val)
      t.h = getHours(d)
      t.m = getMinutes(d)
      t.s = getSeconds(d)
    }
  }, { immediate: true })
  const apply = () => {
    const val = internalValue.value[idx]
    if (!val) return
    const nd = setSeconds(setMinutes(setHours(new Date(val), t.h), t.m), t.s)
    const arr = [...internalValue.value]
    arr[idx] = nd
    internalValue.value = arr
    if (arr[0] && arr[1]) model.value = [arr[0], arr[1]]
  }
  return {
    t,
    apply,
  }
}
const startTime = makeTime(0)
const endTime = makeTime(1)

const togglePopup = () => {
  if (props.disabled) return
  open.value = !open.value
}

// 時間模式的「確認」：model 已即時 commit，這裡負責關閉浮層作為明確完成入口
const confirmRange = () => {
  open.value = false
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
    // 每次開啟回到月曆視圖，避免殘留在月/年選擇
    picker1.value = 'calendar'
    picker2.value = 'calendar'
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

// 觸發器 input 寬度依顯示內容自適應（含時間時字串較長，避免被裁切）；無值時用 placeholder 寬度
const startInputWidth = computed(() => `${Math.max(startDisplay.value.length + 1, 14)}ch`)
const endInputWidth = computed(() => `${Math.max(endDisplay.value.length + 1, 14)}ch`)

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
    // 即時套用（無確定按鈕）；含時間時不自動關閉，讓使用者調整起/迄時間，點外面再關
    model.value = [range[0] as Date, range[1] as Date]
    if (props.autoApply && !props.enableTime) {
      open.value = false
    }
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

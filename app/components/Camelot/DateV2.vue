<template>
  <div
    class="flex w-full flex-col gap-1.5 text-base"
    :class="roleColorClass"
  >
    <CamelotFieldLabel
      :label="label"
      :required="required"
      class="pl-1"
    />

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
      <!-- .prevent：點在 icon／分隔符等非 input 子元素時，label 的啟用行為會再對內層 input 補發一次 click，
           冒泡回來把剛開的浮層又關掉；阻止預設即可（input 為 readonly，無其他副作用） -->
      <CamelotInternalFieldFrame
        :focused="open"
        :disabled="disabled"
      >
        <label
          ref="triggerRef"
          class="group flex w-full min-w-[16ch] cursor-pointer items-center gap-2 px-4 py-2 transition-colors"
          :class="[
            triggerClass,
            open ? triggerOpenClass : '',
            {
              'border-error!': isError,
              'bg-gray-200! opacity-50': disabled,
            },
          ]"
          @click.prevent="togglePopup"
        >
          <IMaterialSymbolsCalendarMonthRounded
            class="size-[1.25em] text-outline group-hover:text-[var(--cml-color-current-color)] transition-colors"
          />
          <input
            v-bind="$attrs"
            v-model="inputModel"
            type="text"
            class="min-w-0 w-0 flex-1 text-on-surface bg-transparent placeholder:text-on-surface outline-none caret-[var(--cml-color-current-color)] appearance-none cursor-pointer"
            :class="{
              'text-black!': disabled,
            }"
            :maxlength="enableTime ? 25 : 10"
            :placeholder="placeholder"
            readonly
          >

        </label>
      </CamelotInternalFieldFrame>

      <CamelotBaseDialogV2
        v-if="showType === 'dialog'"
        v-model:open="open"
      >
        <!-- dialog 模式：BaseDialogV2 已提供主題外框；小螢幕/橫向時可捲動避免被裁切 -->
        <div class="max-h-[82dvh] overflow-y-auto overscroll-contain">
          <CamelotInternalCalendar
            v-model="model"
            v-model:view-date="viewDate"
            :class="roleColorClass"
            :min-date="minDate"
            :max-date="maxDate"
            :enable-time="enableTime"
            hide-time
            :time-precision="timePrecision"
            :hour-format="hourFormat"
            :get-day-attributes="resolveDayAttributes"
            :show-day-label="showDayLabel"
            :locale="locale"
            :week-starts-on="weekStartsOn"
            :weekday-formatter="weekdayFormatter"
            :month-formatter="monthFormatter"
            :year-formatter="yearFormatter"
            @update:model-value="onDateSelect"
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

          <!-- 時間 + 確認：置中於月曆下，同一區塊（與 DateRangeV2 一致） -->
          <div
            v-if="enableTime"
            class="mt-1 flex flex-col items-center gap-2 border-t border-outline px-3 py-3"
          >
            <CamelotInternalTimeRow
              v-model:hours="timeH"
              v-model:minutes="timeM"
              v-model:seconds="timeS"
              :precision="timePrecision"
              :hour-format="hourFormat"
              @change="applyTime"
            />
            <CamelotButton
              label="確認"
              :color="color"
              @click="confirmTime"
            />
          </div>
        </div>
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
            hide-time
            :time-precision="timePrecision"
            :hour-format="hourFormat"
            :get-day-attributes="resolveDayAttributes"
            :show-day-label="showDayLabel"
            :locale="locale"
            :week-starts-on="weekStartsOn"
            :weekday-formatter="weekdayFormatter"
            :month-formatter="monthFormatter"
            :year-formatter="yearFormatter"
            @update:model-value="onDateSelect"
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

          <!-- 時間 + 確認：置中於月曆下，同一區塊（與 DateRangeV2 一致） -->
          <div
            v-if="enableTime"
            class="mt-1 flex flex-col items-center gap-2 border-t border-outline px-3 py-3"
          >
            <CamelotInternalTimeRow
              v-model:hours="timeH"
              v-model:minutes="timeM"
              v-model:seconds="timeS"
              :precision="timePrecision"
              :hour-format="hourFormat"
              @change="applyTime"
            />
            <CamelotButton
              label="確認"
              :color="color"
              @click="confirmTime"
            />
          </div>
        </div>
      </template>
    </CamelotPopupV2>
  </div>
</template>

<script setup lang="ts">
import IMaterialSymbolsCalendarMonthRounded from '~icons/material-symbols/calendar-month-rounded'
import {
  format, isValid, parseISO, setHours, setMinutes, setSeconds, getHours, getMinutes, getSeconds,
} from 'date-fns'
import type { CalendarDayAttributes } from './Internal/Calendar.vue'

const props = withDefaults(defineProps<{
  minDate?: Date | number
  maxDate?: Date | number
  /** 停用星期幾（0 = 星期日 … 6 = 星期六） */
  disableDaysOfWeekList?: number[]
  isError?: boolean
  placeholder?: string
  /** 只允許選擇這些日期（字串為 yyyy-MM-dd）；未設定時不限制 */
  allowedDates?: string[] | Date[]
  disabled?: boolean
  showType?: 'auto' | 'popup' | 'dialog'
  selectZIndex?: number
  enableTime?: boolean
  /** 時間精細度（由下往上關閉）：hour 僅時、minute 時分、second 時分秒 */
  timePrecision?: 'hour' | 'minute' | 'second'
  /** 12 或 24 小時制（預設 24） */
  hourFormat?: '12' | '24'
  color?: CamelotColorRole
  label?: string
  required?: boolean
  getDayAttributes?: (date: Date, dayOfWeek: number) => CalendarDayAttributes | undefined | null
  /** 是否顯示日期下方 label；關閉則不渲染、格高緊湊 */
  showDayLabel?: boolean
  /** BCP47 語系（未給→預設中文；給了走 Intl 產生週/月/年月名） */
  locale?: string
  /** 週起始：0=週日、1=週一 */
  weekStartsOn?: 0 | 1
  /** 自訂週名（覆蓋 locale/預設） */
  weekdayFormatter?: (date: Date, index: number) => string
  /** 自訂月名 */
  monthFormatter?: (monthIndex: number) => string
  /** 自訂年標題 */
  yearFormatter?: (year: number) => string
}>(), {
  showType: 'auto',
  placeholder: 'YYYY-MM-DD',
  enableTime: false,
  timePrecision: 'second',
  hourFormat: '24',
  color: 'primary',
  showDayLabel: true,
  weekStartsOn: 0,
})

const roleColorClass = useCamelotRoleColorClass(() => props.color)

const model = defineModel<Date | number>()

const DATE_KEY_FORMAT = 'yyyy-MM-dd'

// allowedDates 正規化成日期字串集合，逐日比對時不受時分秒與時區影響
const allowedDateKeys = computed(() => {
  if (!props.allowedDates) return undefined
  // 無法解析的日期直接略過，避免 format 拋錯導致整個日曆無法渲染
  const dates = props.allowedDates
    .map(date => (typeof date === 'string' ? parseISO(date) : date))
    .filter(date => isValid(date))
  return new Set(dates.map(date => format(date, DATE_KEY_FORMAT)))
})

// 合成日曆的每日屬性：使用端的 getDayAttributes，再疊加停用星期與允許日期
const resolveDayAttributes = (date: Date, dayOfWeek: number): CalendarDayAttributes | undefined => {
  const attributes = props.getDayAttributes?.(date, dayOfWeek) ?? undefined
  const isDisabledWeekday = props.disableDaysOfWeekList?.includes(dayOfWeek) ?? false
  const isNotAllowed = allowedDateKeys.value !== undefined && !allowedDateKeys.value.has(format(date, DATE_KEY_FORMAT))
  return isDisabledWeekday || isNotAllowed
    ? {
        ...attributes,
        disabled: true,
      }
    : attributes
}
const inputModel = defineModel<string>('input')

const open = ref(false)
const viewDate = ref(new Date())

const {
  themeMode, triggerClass, triggerOpenClass, panelClass,
} = useCamelotPickerTheme()

// 落影改畫在 popup 外層容器（位於 Expanded 的 overflow-hidden 之外，不會被方形裁切），
// 圓角需與面板一致；面板自身的落影則移除，避免被裁切後露出方形邊。
const popupShadowClass = computed(() => {
  switch (themeMode.value) {
    case 'aqua':
      return 'shadow-[0_12px_44px_-8px_rgba(0,0,0,0.30)] rounded-aqua-panel'
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
      return 'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.16)]!'
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

// 依 enableTime / 精細度 / 12-24 制組出顯示格式
const displayFormat = computed(() => {
  if (!props.enableTime) return 'yyyy-MM-dd'
  let t = props.hourFormat === '12' ? 'hh' : 'HH'
  if (props.timePrecision !== 'hour') t += ':mm'
  if (props.timePrecision === 'second') t += ':ss'
  if (props.hourFormat === '12') t += ' a'
  return `yyyy-MM-dd ${t}`
})

watch([model, displayFormat], ([nV]) => {
  if (nV) {
    try {
      inputModel.value = format(new Date(nV), displayFormat.value)
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

// 時間模式的「確認」：model 已即時更新，這裡負責關閉浮層作為明確完成入口
const confirmTime = () => {
  open.value = false
}

// 時間狀態：抽出時間列至月曆下方，與確認鈕同一區塊（與 DateRangeV2 一致）。月曆設 hide-time。
const timeH = ref(0)
const timeM = ref(0)
const timeS = ref(0)
watch(model, (v) => {
  if (v) {
    const d = new Date(v)
    timeH.value = getHours(d)
    timeM.value = getMinutes(d)
    timeS.value = getSeconds(d)
  }
}, { immediate: true })
const applyTime = () => {
  if (!model.value) return
  model.value = setSeconds(setMinutes(setHours(new Date(model.value), timeH.value), timeM.value), timeS.value)
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

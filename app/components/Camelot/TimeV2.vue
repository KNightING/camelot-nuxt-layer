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
      <label
        ref="triggerRef"
        class="group flex w-full min-w-[12ch] cursor-pointer items-center gap-2 px-4 py-2 transition-colors"
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
        <IMaterialSymbolsScheduleRounded
          class="w-5 h-5 text-outline group-hover:text-[var(--cml-color-current-color)] transition-colors shrink-0"
          @click.stop="open = true"
        />
        <input
          v-bind="$attrs"
          :value="displayValue"
          type="text"
          class="min-w-0 w-0 flex-1 text-on-surface bg-transparent placeholder:text-on-surface/50 outline-none text-base caret-[var(--cml-color-current-color)] appearance-none cursor-pointer"
          :class="{ 'text-black!': disabled }"
          :placeholder="placeholder"
          readonly
        >
      </label>

      <CamelotBaseDialogV2
        v-if="showType === 'dialog'"
        v-model:open="open"
      >
        <div
          :class="roleColorClass"
          class="flex flex-col items-center gap-3 px-3 py-4"
        >
          <CamelotInternalTimeRow
            v-model:hours="timeH"
            v-model:minutes="timeM"
            v-model:seconds="timeS"
            :precision="timePrecision"
            :hour-format="hourFormat"
            @change="apply"
          />
          <CamelotButton
            label="確認"
            :color="color"
            @click="confirm"
          />
        </div>
      </CamelotBaseDialogV2>

      <template
        v-if="showType === 'popup'"
        #popup
      >
        <div
          ref="popupRef"
          :class="[roleColorClass, panelClass, popupPanelShadowFix]"
          @click.stop
        >
          <div class="flex flex-col items-center gap-3 px-3 py-4">
            <CamelotInternalTimeRow
              v-model:hours="timeH"
              v-model:minutes="timeM"
              v-model:seconds="timeS"
              :precision="timePrecision"
              :hour-format="hourFormat"
              @change="apply"
            />
            <CamelotButton
              label="確認"
              :color="color"
              @click="confirm"
            />
          </div>
        </div>
      </template>
    </CamelotPopupV2>
  </div>
</template>

<script setup lang="ts">
import IMaterialSymbolsScheduleRounded from '~icons/material-symbols/schedule-rounded'
import {
  format, setHours, setMinutes, setSeconds,
} from 'date-fns'

const props = withDefaults(defineProps<{
  color?: CamelotColorRole
  label?: string
  required?: boolean
  disabled?: boolean
  isError?: boolean
  placeholder?: string
  showType?: 'auto' | 'popup' | 'dialog'
  selectZIndex?: number
  /** 精細度（由下往上關閉）：hour 僅時、minute 時分、second 時分秒 */
  timePrecision?: 'hour' | 'minute' | 'second'
  /** 12 或 24 小時制（預設 24） */
  hourFormat?: '12' | '24'
}>(), {
  color: 'primary',
  showType: 'auto',
  placeholder: 'HH:mm',
  timePrecision: 'minute',
  hourFormat: '24',
})

// v-model：純時間字串（24 制標準值）"HH:mm" 或 "HH:mm:ss"
const model = defineModel<string>()

const roleColorClass = useCamelotRoleColorClass(() => props.color)
const {
  themeMode, triggerClass, panelClass,
} = useCamelotPickerTheme()

const open = ref(false)
const triggerRef = useTemplateRef('triggerRef')
const popupRef = useTemplateRef('popupRef')

// 內部時分秒（24 制）
const timeH = ref(0)
const timeM = ref(0)
const timeS = ref(0)
const hasValue = ref(false)

const clamp = (n: number, max: number) => (Number.isFinite(n) ? Math.min(Math.max(0, n), max) : 0)

// model 字串 → h/m/s
watch(model, (v) => {
  if (!v) {
    hasValue.value = false
    return
  }
  const [h, m, s] = v.split(':').map(x => parseInt(x, 10))
  timeH.value = clamp(h ?? 0, 23)
  timeM.value = clamp(m ?? 0, 59)
  timeS.value = clamp(s ?? 0, 59)
  hasValue.value = true
}, { immediate: true })

const pad = (n: number) => String(n).padStart(2, '0')

// h/m/s → model 字串（依精細度）
const apply = () => {
  let str = `${pad(timeH.value)}:${pad(timeM.value)}`
  if (props.timePrecision === 'second') str += `:${pad(timeS.value)}`
  hasValue.value = true
  model.value = str
}

// trigger 顯示（依 hourFormat / precision；12 制 hh:mm a）
const displayValue = computed(() => {
  if (!hasValue.value) return ''
  const d = setSeconds(setMinutes(setHours(new Date(), timeH.value), timeM.value), timeS.value)
  let pattern = props.hourFormat === '12' ? 'hh' : 'HH'
  if (props.timePrecision !== 'hour') pattern += ':mm'
  if (props.timePrecision === 'second') pattern += ':ss'
  if (props.hourFormat === '12') pattern += ' a'
  return format(d, pattern)
})

const togglePopup = () => {
  if (!props.disabled) open.value = !open.value
}

const confirm = () => {
  // 首次開啟未動時間就按確認 → 視為選定當前（0:0:0 或既有）
  if (!hasValue.value) apply()
  open.value = false
}

onClickOutside(triggerRef, () => {
  if (showType.value === 'popup') open.value = false
}, { ignore: [popupRef] })

const { isMobile } = useDeviceBreakpoints()
const showType = computed<'popup' | 'dialog'>(() => {
  if (props.showType === 'auto') return isMobile.value ? 'dialog' : 'popup'
  return props.showType ?? 'dialog'
})

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
      return 'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.16)]!'
    case 'scifi':
      return 'shadow-none!'
    default:
      return ''
  }
})
</script>

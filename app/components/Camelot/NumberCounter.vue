<template>
  <div
    class="flex w-fit min-w-10 flex-col gap-1.5 text-base"
    :class="[roleColorClass, { 'cursor-not-allowed opacity-50': disabled }]"
  >
    <slot
      name="label"
      :label="label"
    >
      <CamelotFieldLabel
        :label="label"
        :required="required"
        class="pl-1"
      />
    </slot>

    <CamelotInternalFieldFrame
      :focused="isFocus"
      :disabled="disabled"
    >
      <!-- 高度公式與 Input 相同（行高 1.5em + 上下 1rem + 框線）：± 按鈕 1.5em + 0.5rem，容器 py-1 補足另外 0.5rem，字級放大時等高 -->
      <div
        class="flex min-w-fit items-center px-1 py-1 transition-colors"
        :class="[containerThemeClass, { 'pointer-events-none': disabled }]"
      >
        <button
          type="button"
          class="outline-none"
          :disabled="disabled"
          @click="onMinusClick"
        >
          <slot name="minus">
            <CamelotRippleEffect
              class="flex h-[calc(1.5em+0.5rem)] aspect-square flex-col items-center justify-center text-[var(--cml-color-current-color)]"
              :class="themeMode === 'scifi' ? 'rounded-none' : 'rounded-full'"
            >
              <span class="font-bold select-none">-</span>
            </CamelotRippleEffect>
          </slot>
        </button>

        <input
          ref="input"
          v-model="model"
          type="number"
          class="m-0 min-w-[4ch] flex-1 appearance-none bg-transparent text-center text-on-surface caret-[var(--cml-color-current-color)] outline-none"
          :placeholder="placeholder"
          :step="step"
          :min="min"
          :max="max"
          :disabled="disabled"
          :inputmode="inputmode"
          @blur="isFocus = false"
          @focus="isFocus = true"
          @click="onInputClick"
        >

        <button
          type="button"
          class="outline-none"
          :disabled="disabled"
          @click="onPlusClick"
        >
          <slot name="plus">
            <CamelotRippleEffect
              class="flex h-[calc(1.5em+0.5rem)] aspect-square flex-col items-center justify-center text-[var(--cml-color-current-color)]"
              :class="themeMode === 'scifi' ? 'rounded-none' : 'rounded-full'"
            >
              <span class="font-bold select-none">+</span>
            </CamelotRippleEffect>
          </slot>
        </button>
      </div>
    </CamelotInternalFieldFrame>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  step?: number
  min?: number
  max?: number
  placeholder?: string
  label?: string
  required?: boolean
  disabled?: boolean
  color?: CamelotColorRole
  isContainer?: boolean
  /**
   * 是否使用目前value的最小單位當成step, 如果有設定step會優先此設定
   * 例如目前值為0.2, step則會使用0.1
   * 例如目前值為0.03, step則會使用0.01
   **/
  minStepByValue?: boolean
  /**
   * 是否使用曾經value的最小單位當成step, minStepByValue需為true
   * 例如曾經step為0.01, 現在值為0.2, step不會更新成0.1, 會繼續使用0.01
   **/
  usedMinStepByValue?: boolean
}>()

const model = defineModel<number>({ default: 0 })

const { themeMode } = useCamelotTheme()

const roleColorClass = useCamelotRoleColorClass(() => props.color ?? 'primary', () => props.isContainer ?? false)

const input = ref<HTMLInputElement>()

const isFocus = ref(false)

const containerThemeClass = computed(() => {
  switch (themeMode.value) {
    case 'aqua':
      return [
        'min-h-10.5 aqua-track rounded-aqua-control backdrop-blur-md',
        isFocus.value ? 'aqua-glow' : '',
      ]
    case 'cupertino':
      return [
        // 與 Cupertino Input 相同：無可見框線，聚焦時轉亮底並加 inset 主色框
        'min-h-10.5 rounded-[10px] border border-transparent',
        isFocus.value
          ? 'bg-surface shadow-[inset_0_0_0_1px_var(--cml-color-current-color)]'
          : 'bg-surface-container-highest',
      ]
    case 'scifi':
      // 外框與聚焦效果交給 CamelotScifiFrame，內容區扣掉 Frame 上下各 1px 外框
      return ['min-h-10']
    default:
      // Material：與 Material Input / Select 同為 Filled 欄位
      return [
        'min-h-10.5 rounded-t-[4px] bg-surface-container-highest border-y border-t-transparent',
        isFocus.value
          ? 'border-b-[var(--cml-color-current-color)] shadow-[inset_0_-1px_0_var(--cml-color-current-color)]'
          : 'border-b-outline',
      ]
  }
})

const inputmode = ref<'none' | 'text' | 'search' | 'email' | 'tel' | 'url' | 'numeric' | 'decimal' | undefined>('none')

const onInputClick = () => {
  if (isFocus.value) {
    inputmode.value = 'decimal'
  }
}

watch(isFocus, (isFocus) => {
  if (!isFocus) {
    inputmode.value = 'none'
  }
})

const absStep = ref(1)

watch(props, (props) => {
  if (props.step) {
    absStep.value = Math.abs(props.step)
  }
  else if (!props.minStepByValue) {
    absStep.value = 1
  }

  if (props.minStepByValue) {
    const absValue = Math.abs(model.value)
    const stepString = absValue.toString()
    const dotIndex = stepString.indexOf('.')
    const usedStep = absStep.value

    if (dotIndex > 0) {
      const calcStep = 1 / Math.pow(10, stepString.length - dotIndex - 1)
      if (props.usedMinStepByValue && usedStep && calcStep > usedStep) {
        absStep.value = usedStep
      }
      else {
        absStep.value = calcStep
      }
    }
    else if (props.usedMinStepByValue && usedStep) {
      absStep.value = usedStep
    }
  }
}, { immediate: true })

const calc = (value: number, isPlus: boolean) => {
  const step = absStep.value
  const plusStep = isPlus ? step : step * -1
  return useFloat().plus(value, plusStep).value
}

const doCalc = (isPlus: boolean) => {
  let calcValue = calc(model.value, isPlus)
  if (isPlus && props.max !== undefined && calcValue >= props.max) {
    calcValue = props.max
  }
  if (!isPlus && props.min !== undefined && calcValue <= props.min) {
    calcValue = props.min
  }
  model.value = calcValue
  input.value?.focus()
}

const onMinusClick = () => {
  doCalc(false)
}

const onPlusClick = () => {
  doCalc(true)
}
</script>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>

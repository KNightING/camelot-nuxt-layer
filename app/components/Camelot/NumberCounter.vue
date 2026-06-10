<template>
  <div
    class="flex w-fit min-w-10 flex-col gap-1.5"
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

    <div
      class="flex h-8 min-w-fit items-center px-1 transition-colors"
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
            class="flex h-6 aspect-square flex-col items-center justify-center text-[var(--cml-color-current-color)]"
            :class="themeMode === 'scifi' ? 'rounded-none' : 'rounded-full'"
          >
            <span class="text-base font-bold select-none">-</span>
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
            class="flex h-6 aspect-square flex-col items-center justify-center text-[var(--cml-color-current-color)]"
            :class="themeMode === 'scifi' ? 'rounded-none' : 'rounded-full'"
          >
            <span class="text-base font-bold select-none">+</span>
          </CamelotRippleEffect>
        </slot>
      </button>
    </div>
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
        'aqua-track rounded-full backdrop-blur-md',
        isFocus.value ? 'aqua-glow' : '',
      ]
    case 'cupertino':
      return [
        'rounded-[10px] bg-surface-container-highest border',
        isFocus.value ? 'border-[var(--cml-color-current-color)]' : 'border-outline-variant',
      ]
    case 'scifi':
      return [
        'bg-[color-mix(in_srgb,var(--cml-color-current-color)_5%,transparent)] border',
        isFocus.value
          ? 'border-[var(--cml-color-current-color)] shadow-[0_0_10px_color-mix(in_srgb,var(--cml-color-current-color)_20%,transparent)]'
          : 'border-[color-mix(in_srgb,var(--cml-color-current-color)_30%,transparent)]',
      ]
    default:
      return [
        'rounded-full bg-surface border',
        isFocus.value ? 'border-[var(--cml-color-current-color)]' : 'border-outline-variant',
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

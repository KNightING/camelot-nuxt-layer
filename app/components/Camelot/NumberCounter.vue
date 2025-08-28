<template>
  <div
    class="container "
    :class="{
      'container-focus': isFocus,
    }"
  >
    <button
      type="button"
      class="outline-none"
      @click="onMinusClick"
    >
      <slot name="minus">
        <CamelotRippleEffect class="controller">
          <span>-</span>
        </CamelotRippleEffect>
      </slot>
    </button>

    <input
      ref="input"
      v-model="model"
      type="number"
      :placeholder="placeholder"
      :step="step"
      :min="min"
      :max="max"
      :inputmode="inputmode"
      @blur="isFocus = false"
      @focus="isFocus = true"
      @click="onInputClick"
    >

    <button
      type="button"
      class="outline-none"
      @click="onPlusClick"
    >
      <slot name="plus">
        <CamelotRippleEffect class="controller">
          <span>+</span>
        </CamelotRippleEffect>
      </slot>
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  step?: number
  min?: number
  max?: number
  placeholder?: string
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

const input = ref<HTMLInputElement>()

const isFocus = ref(false)

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

const absStep = ref(0)

watch(props, (props) => {
  if (props.step) {
    absStep.value = Math.abs(props.step)
  }

  if (props.minStepByValue) {
    const absValue = Math.abs(model.value)
    const stepString = absValue.toString()
    const dotIndex = stepString.indexOf('.')
    const usedStep = absStep.value as number

    if (dotIndex > 0) {
      const calcStep = 1 / Math.pow(10, stepString.length - dotIndex - 1)
      if (props.usedMinStepByValue && usedStep && calcStep > usedStep) {
        absStep.value = usedStep
      } else {
        absStep.value = calcStep
      }
    } else if (props.usedMinStepByValue && usedStep) {
      absStep.value = usedStep
    }
  }
  absStep.value = 1
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
.container {
  display: flex;
  padding-left: 0.25rem;
  padding-right: 0.25rem;
  align-items: center;
  height: 28px;
  border-radius: 9999px;
  border-width: 1px;
  min-width: fit-content;
  background-color: #ffffff;
}

.container:active {
  border-color: rgba(from var(--camelot-m3-primary) r g b / 1);
}

.container-focus {
  border-color: rgba(from var(--camelot-m3-primary) r g b / 1);
}

input {
  margin: 0;
  flex: 1 1 0%;
  outline-style: none;
  text-align: center;
  background-color: transparent;
  appearance: none;
  min-width: 4ch;
}

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

.controller {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 9999px;
  height: 24px;
  aspect-ratio: 1 / 1;
}

.controller span {
  font-size: 1rem;
  font-weight: 700;
  user-select: none;
}
</style>

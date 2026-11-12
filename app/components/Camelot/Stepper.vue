<template>
  <div
    class="flex w-full min-w-40 items-center justify-between gap-3 p-1.5 text-base"
    :class="[roleColorClass, containerClass, { 'cursor-not-allowed opacity-50': disabled }]"
    role="group"
    :aria-label="label"
  >
    <button
      type="button"
      class="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center outline-none focus-visible:tactile-ring disabled:cursor-not-allowed disabled:opacity-40"
      :class="buttonClass"
      :disabled="disabled || !canDecrease"
      :aria-label="labels.decrease"
      @click="step(-1)"
    >
      <slot name="minus">
        <IMaterialSymbolsRemoveRounded class="text-lg" />
      </slot>
    </button>

    <output
      class="min-w-0 flex-1 truncate text-center font-semibold text-on-surface tabular-nums select-none"
      aria-live="polite"
    >
      <slot :value="model">
        {{ model }}<span
          v-if="unit"
          class="ml-1"
        >{{ unit }}</span>
      </slot>
    </output>

    <button
      type="button"
      class="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center outline-none focus-visible:tactile-ring disabled:cursor-not-allowed disabled:opacity-40"
      :class="buttonClass"
      :disabled="disabled || !canIncrease"
      :aria-label="labels.increase"
      @click="step(1)"
    >
      <slot name="plus">
        <IMaterialSymbolsAddRounded class="text-lg" />
      </slot>
    </button>
  </div>
</template>

<script setup lang="ts">
import IMaterialSymbolsAddRounded from '~icons/material-symbols/add-rounded'
import IMaterialSymbolsRemoveRounded from '~icons/material-symbols/remove-rounded'

const props = withDefaults(
  defineProps<{
    /** 最小值；未指定表示沒有下限 */
    min?: number
    /** 最大值；未指定表示沒有上限 */
    max?: number
    /** 每次增減的量，必須是整數（只做整數運算） */
    step?: number
    /** 顯示在數值後面的單位，例如「小時」 */
    unit?: string
    /** 群組的無障礙名稱 */
    label?: string
    /** 兩顆按鈕的無障礙名稱 */
    labels?: CamelotStepperLabels
    disabled?: boolean
    color?: CamelotColorRole
  }>(),
  {
    min: undefined,
    max: undefined,
    step: 1,
    unit: '',
    label: '',
    labels: () => ({
      decrease: '減少',
      increase: '增加',
    }),
    disabled: false,
    color: 'primary',
  },
)

const emit = defineEmits<{
  change: [value: number]
}>()

const model = defineModel<number>({ default: 0 })

const { themeMode } = useCamelotTheme()

const roleColorClass = useCamelotRoleColorClass(() => props.color)

const canDecrease = computed(() => props.min === undefined || model.value > props.min)

const canIncrease = computed(() => props.max === undefined || model.value < props.max)

const clamp = (value: number): number => {
  const lowerBounded = props.min === undefined ? value : Math.max(props.min, value)
  return props.max === undefined ? lowerBounded : Math.min(props.max, lowerBounded)
}

const step = (direction: 1 | -1) => {
  if (props.disabled) return
  model.value = clamp(model.value + direction * props.step)
  emit('change', model.value)
}

const containerClass = computed(() => {
  switch (themeMode.value) {
    case 'tactile':
      return 'tactile-well rounded-full'
    case 'aqua':
      return 'aqua-track rounded-full backdrop-blur-md'
    case 'scifi':
      return 'rounded-none border border-[color-mix(in_srgb,var(--cml-color-current-color)_35%,transparent)] bg-surface-container-lowest font-mono'
    case 'cupertino':
      return 'rounded-xl bg-surface-container-highest'
    default:
      return 'rounded-full bg-surface-container-high'
  }
})

const buttonClass = computed(() => {
  switch (themeMode.value) {
    case 'tactile':
      return 'tactile-surface rounded-full text-on-surface transition-transform duration-500 ease-tactile active:scale-85 motion-reduce:transition-none'
    case 'aqua':
      return 'aqua-fill rounded-full text-[var(--cml-color-current-on-color)] transition-transform duration-200 ease-spring active:scale-90'
    case 'scifi':
      return 'rounded-none border border-[var(--cml-color-current-color)] text-[var(--cml-color-current-color)] transition-colors hover:bg-[color-mix(in_srgb,var(--cml-color-current-color)_18%,transparent)]'
    case 'cupertino':
      return 'rounded-lg bg-surface text-[var(--cml-color-current-color)] shadow-sm transition-[transform,opacity] duration-200 active:scale-95 active:opacity-60'
    default:
      return 'rounded-full bg-[var(--cml-color-current-color)] text-[var(--cml-color-current-on-color)] shadow-sm transition-[filter,box-shadow] duration-200 hover:brightness-110'
  }
})
</script>

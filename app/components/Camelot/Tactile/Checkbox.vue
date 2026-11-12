<template>
  <button
    type="button"
    role="checkbox"
    class="relative inline-grid h-[22px] w-[22px] shrink-0 cursor-pointer place-items-center align-middle outline-none transition-[transform,background-color,box-shadow] duration-500 ease-tactile focus-visible:tactile-ring active:scale-85 disabled:cursor-not-allowed disabled:opacity-40 disabled:grayscale motion-reduce:transition-none"
    :class="{
      'rounded-full': shape === 'circle',
      'rounded-lg': shape !== 'circle',
      'tactile-fill': isFilled,
      'shadow-[inset_0_0_0_1.5px_var(--color-outline)]': !isFilled,
    }"
    :aria-checked="ariaChecked"
    :disabled="disabled"
    @click="toggle"
  >
    <!-- 勾選以描線出現：stroke-dashoffset 從整段長度收到 0 -->
    <svg
      class="col-start-1 row-start-1 h-3 w-3 fill-none stroke-[var(--cml-color-current-on-color)] stroke-[2.6] transition-[stroke-dashoffset] duration-300 [stroke-dasharray:18] [stroke-linecap:round] [stroke-linejoin:round] motion-reduce:transition-none"
      :class="{
        '[stroke-dashoffset:0]': modelValue,
        '[stroke-dashoffset:18]': !modelValue,
      }"
      viewBox="0 0 12 12"
      aria-hidden="true"
    >
      <path d="m2 6.5 2.7 2.7L10 3.5" />
    </svg>
    <span
      class="col-start-1 row-start-1 h-0.5 w-2.5 rounded-full bg-[var(--cml-color-current-on-color)] transition-opacity duration-200"
      :class="{
        'opacity-100': isIndeterminateShown,
        'opacity-0': !isIndeterminateShown,
      }"
    />
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    disabled?: boolean
    shape?: 'square' | 'circle'
    indeterminate?: boolean
  }>(),
  {
    disabled: false,
    shape: 'square',
    indeterminate: false,
  },
)

const emit = defineEmits<{
  change: [checked: boolean]
}>()

const modelValue = defineModel<boolean>({ default: false })

const isIndeterminateShown = computed(() => props.indeterminate && !modelValue.value)

const isFilled = computed(() => modelValue.value || props.indeterminate)

const ariaChecked = computed(() => (isIndeterminateShown.value ? 'mixed' : modelValue.value))

const toggle = () => {
  modelValue.value = !modelValue.value
  emit('change', modelValue.value)
}
</script>

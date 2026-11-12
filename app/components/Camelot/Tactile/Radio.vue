<template>
  <button
    type="button"
    role="radio"
    class="inline-flex h-[22px] w-[22px] shrink-0 cursor-pointer items-center justify-center rounded-full align-middle outline-none transition-[transform,background-color,box-shadow] duration-500 ease-tactile focus-visible:tactile-ring active:scale-85 disabled:cursor-not-allowed disabled:opacity-40 disabled:grayscale motion-reduce:transition-none"
    :class="{
      'tactile-fill': modelValue,
      'shadow-[inset_0_0_0_1.5px_var(--color-outline)]': !modelValue,
    }"
    :aria-checked="modelValue"
    :disabled="disabled"
    @click="toggle"
  >
    <!-- 滿版 + scale 縮小：transform 以中心對稱取樣，避免固定 px 圓點在非整數 DPR 下的半像素偏移 -->
    <span
      class="h-full w-full rounded-full bg-[var(--cml-color-current-on-color)] transition-transform duration-500 ease-tactile motion-reduce:transition-none"
      :class="{
        'scale-[0.42]': modelValue,
        'scale-0': !modelValue,
      }"
    />
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    disabled?: boolean
    /** 點擊已選取項可取消選取（非必填情境） */
    deselectable?: boolean
  }>(),
  {
    disabled: false,
    deselectable: false,
  },
)

const emit = defineEmits<{
  change: [checked: boolean]
}>()

const modelValue = defineModel<boolean>({ default: false })

const toggle = () => {
  if (modelValue.value && !props.deselectable) return
  modelValue.value = !modelValue.value
  emit('change', modelValue.value)
}
</script>

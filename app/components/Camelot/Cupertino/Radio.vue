<template>
  <span
    class="inline-flex h-[22px] w-[22px] shrink-0 cursor-pointer items-center justify-center rounded-full border align-middle transition-[background-color,border-color] duration-200"
    :class="[
      modelValue
        ? 'border-[var(--cml-color-current-color)] bg-[var(--cml-color-current-color)]'
        : 'border-outline-variant',
      { 'pointer-events-none cursor-not-allowed opacity-30 grayscale': disabled },
    ]"
    @click="toggle"
  >
    <!-- 滿版 + scale 縮小：以中心對稱取樣，避免半像素偏移（內容盒 20px × 0.4 = 8px） -->
    <span
      class="h-full w-full scale-[0.4] rounded-full bg-white transition-opacity duration-200"
      :class="modelValue ? 'opacity-100' : 'opacity-0'"
    />
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    disabled?: boolean
  }>(),
  {
    disabled: false,
  },
)

const emit = defineEmits<{
  change: [checked: boolean]
}>()

const modelValue = defineModel<boolean>({ default: false })

const toggle = () => {
  if (props.disabled || modelValue.value) return
  modelValue.value = true
  emit('change', true)
}
</script>

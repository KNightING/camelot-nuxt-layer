<template>
  <span
    class="inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 align-middle transition-colors duration-200"
    :class="[
      modelValue ? 'border-[var(--cml-color-current-color)]' : 'border-outline',
      { 'pointer-events-none cursor-not-allowed opacity-[0.38]': disabled },
    ]"
    @click="toggle"
  >
    <!-- 滿版 + scale 縮小：以中心對稱取樣，避免半像素偏移（內容盒 16px × 0.625 = 10px） -->
    <span
      class="h-full w-full rounded-full bg-[var(--cml-color-current-color)] transition-transform duration-200"
      :class="modelValue ? 'scale-[0.625]' : 'scale-0'"
    />
  </span>
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
  if (props.disabled) return
  if (modelValue.value && !props.deselectable) return
  modelValue.value = !modelValue.value
  emit('change', modelValue.value)
}
</script>

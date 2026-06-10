<template>
  <span
    class="inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full border align-middle transition-all duration-200 ease-spring"
    :class="[
      modelValue ? 'aqua-fill border-transparent' : 'aqua-track',
      { 'pointer-events-none cursor-not-allowed opacity-40 grayscale': disabled },
    ]"
    @click="toggle"
  >
    <!-- 滿版 + scale 縮小：transform 以中心對稱取樣，避免固定 px 圓點在非整數 DPR 下的半像素偏移 -->
    <span
      class="h-full w-full rounded-full bg-white transition-transform duration-200 ease-spring"
      :class="modelValue ? 'scale-[0.56]' : 'scale-0'"
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

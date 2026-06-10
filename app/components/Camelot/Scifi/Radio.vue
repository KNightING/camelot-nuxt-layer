<template>
  <span
    class="radio-scifi"
    :class="{ checked: modelValue, disabled }"
    @click="toggle"
  >
    <span class="indicator" />
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

<style scoped>
.radio-scifi {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 9999px;
  flex-shrink: 0;
  cursor: pointer;
  border: 1px solid color-mix(in srgb, var(--cml-color-current-color) 30%, transparent);
  background: color-mix(in srgb, var(--cml-color-current-color) 5%, transparent);
  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
  --cml-scifi-color: var(--cml-color-current-color);
}
.radio-scifi.checked {
  border-color: var(--cml-scifi-color);
  box-shadow: 0 0 10px color-mix(in srgb, var(--cml-scifi-color) 25%, transparent);
}
/* 滿版 + scale 縮小：以中心對稱取樣，避免半像素偏移（內容盒 16px × 0.5 = 8px） */
.radio-scifi .indicator {
  width: 100%;
  height: 100%;
  border-radius: 9999px;
  background: var(--cml-scifi-color);
  transform: scale(0);
  transition: transform 0.3s cubic-bezier(0.19, 1, 0.22, 1);
  box-shadow: 0 0 12px var(--cml-scifi-color);
}
.radio-scifi.checked .indicator {
  transform: scale(0.5);
}
.radio-scifi.disabled {
  cursor: not-allowed;
  pointer-events: none;
  opacity: 0.3;
  filter: grayscale(1);
}
</style>

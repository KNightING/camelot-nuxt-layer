<template>
  <div
    class="checkbox-scifi-wrapper"
    :class="{ checked: modelValue || indeterminate, disabled }"
    @click="toggle"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div
      class="container"
      :class="{ checked: modelValue || indeterminate, disabled }"
    >
      <CamelotScifiReticle :active="isHovered" />
      <div class="checkbox-box">
        <div class="indicator" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    disabled?: boolean
    indeterminate?: boolean
  }>(),
  {
    disabled: false,
    indeterminate: false,
  },
)

const emit = defineEmits<{
  change: [checked: boolean]
}>()

const modelValue = defineModel<boolean>({ default: false })

const isHovered = ref(false)

const toggle = () => {
  if (props.disabled) return
  modelValue.value = !modelValue.value
  emit('change', modelValue.value)
}
</script>

<style scoped>
.checkbox-scifi-wrapper {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  font-family: inherit;
  --cml-scifi-color: var(--cml-color-current-color);
}
.checkbox-scifi-wrapper .container {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  gap: 12px;
  min-height: 36px;
  box-sizing: border-box;
  transition: all 0.2s;
  position: relative;
}
.checkbox-scifi-wrapper .container:hover:not(.disabled) {
  background: color-mix(in srgb, var(--cml-scifi-color) 5%, transparent);
}
.checkbox-box {
  position: relative;
  width: 18px;
  height: 18px;
  border: 1px solid color-mix(in srgb, var(--cml-scifi-color) 20%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  flex-shrink: 0;
  overflow: hidden;
}
.checkbox-box::before, .checkbox-box::after {
  content: '';
  position: absolute;
  width: 4px;
  height: 100%;
  border-color: color-mix(in srgb, var(--cml-scifi-color) 40%, transparent);
  border-style: solid;
  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
}
.checkbox-box::before {
  left: 0;
  border-width: 1px 0 1px 1px;
}
.checkbox-box::after {
  right: 0;
  border-width: 1px 1px 1px 0;
}
.checked .checkbox-box::before, .checked .checkbox-box::after {
  border-color: var(--cml-scifi-color);
  box-shadow: 0 0 10px color-mix(in srgb, var(--cml-scifi-color) 20%, transparent);
}
.indicator {
  width: 10px;
  height: 10px;
  background: var(--cml-scifi-color);
  transform: scale(0);
  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
  box-shadow: 0 0 15px var(--cml-scifi-color);
  position: relative;
}
.checked .indicator {
  transform: scale(1);
}
.indicator::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.8);
  animation: check-scan 1s linear infinite;
}
@keyframes check-scan {
  0% { top: 0; }
  100% { top: 100%; }
}
.disabled {
  opacity: 0.3;
  cursor: not-allowed;
  pointer-events: none;
  filter: grayscale(1);
}
.checkbox-scifi-wrapper :deep(.camelot-scifi-reticle) {
  inset: 2px;
}
</style>

<template>
  <div
    ref="switchRef"
    class="switch-scifi"
    :class="{ checked: modelValue, disabled }"
    @click="toggle"
  >
    <CamelotScifiReticle :active="true" />
    <div class="thumb" />
    <span class="status-text">{{ modelValue ? 'ON' : 'OFF' }}</span>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    disabled?: boolean
  }>(),
  {
    disabled: false,
  }
)

const emit = defineEmits<{
  change: [checked: boolean]
}>()

const modelValue = defineModel<boolean>({ default: false })

const switchRef = useTemplateRef<HTMLElement>('switchRef')

const toggle = () => {
  if (props.disabled) return
  modelValue.value = !modelValue.value
  emit('change', modelValue.value)

  if (switchRef.value) {
    switchRef.value.animate([
      { filter: 'brightness(1)' },
      { filter: 'brightness(2)', boxShadow: `0 0 20px var(--cml-color-current-color)` },
      { filter: 'brightness(1)' }
    ], { duration: 200 })
  }
}
</script>

<style scoped>
.switch-scifi {
  position: relative;
  width: 60px;
  height: 24px;
  background: color-mix(in srgb, var(--cml-color-current-color) 5%, transparent);
  border: 1px solid color-mix(in srgb, var(--cml-color-current-color) 30%, transparent);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
  display: inline-block;
  vertical-align: middle;
  --cml-scifi-color: var(--cml-color-current-color);
}
.switch-scifi::before {
  content: '';
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  bottom: -1px;
  background: linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--cml-scifi-color) 20%, transparent) 50%, transparent 100%);
  background-size: 200% 100%;
  animation: scan 3s linear infinite;
  pointer-events: none;
  opacity: 0;
}
@keyframes scan {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.switch-scifi.checked {
  background: color-mix(in srgb, var(--cml-scifi-color) 15%, transparent);
  border-color: var(--cml-scifi-color);
  box-shadow: 0 0 10px color-mix(in srgb, var(--cml-scifi-color) 20%, transparent);
}
.switch-scifi.checked::before {
  opacity: 1;
}
.switch-scifi .thumb {
  position: absolute;
  top: 50%;
  left: 6px;
  width: 14px;
  height: 14px;
  background-color: color-mix(in srgb, var(--cml-scifi-color) 50%, transparent);
  transform: translateY(-50%) rotate(45deg);
  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
  box-shadow: 0 0 5px color-mix(in srgb, var(--cml-scifi-color) 30%, transparent);
  z-index: 2;
}
.switch-scifi.checked .thumb {
  left: 40px;
  background-color: var(--cml-scifi-color);
  box-shadow: 0 0 15px var(--cml-scifi-color);
}
.switch-scifi .thumb::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}
.switch-scifi.disabled {
  cursor: not-allowed;
  opacity: 0.3;
  filter: grayscale(1);
}
.status-text {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 8px;
  color: var(--cml-scifi-color);
  opacity: 0.5;
  pointer-events: none;
  z-index: 1;
}
.switch-scifi.checked .status-text {
  left: 4px;
  right: auto;
}
.switch-scifi :deep(.camelot-scifi-reticle) {
  inset: -2px;
  opacity: 0.3;
  transition: opacity 0.3s;
}
.switch-scifi:hover :deep(.camelot-scifi-reticle),
.switch-scifi.checked :deep(.camelot-scifi-reticle) {
  opacity: 1;
}
</style>

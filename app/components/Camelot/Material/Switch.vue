<template>
  <div
    class="switch-material"
    :class="{ checked: modelValue, disabled }"
    @click="toggle"
  >
    <div class="thumb" />
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

const toggle = () => {
  if (props.disabled) return
  modelValue.value = !modelValue.value
  emit('change', modelValue.value)
}
</script>

<style scoped>
.switch-material {
  position: relative;
  width: 52px;
  height: 32px;
  background-color: var(--cml-c-m3-surface-container-highest, var(--color-surface-container-highest, #e6e0e9));
  border: 2px solid var(--cml-c-m3-outline, var(--color-outline, #79747e));
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-block;
  vertical-align: middle;
}
.switch-material.checked {
  background-color: var(--cml-color-current-color);
  border-color: var(--cml-color-current-color);
}
.switch-material .thumb {
  position: absolute;
  top: 50%;
  left: 4px;
  width: 16px;
  height: 16px;
  background-color: var(--cml-c-m3-outline, var(--color-outline, #79747e));
  border-radius: 50%;
  transform: translateY(-50%);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.switch-material.checked .thumb {
  left: 26px;
  width: 24px;
  height: 24px;
  background-color: var(--cml-color-current-on-color);
}
.switch-material.disabled {
  cursor: not-allowed;
  opacity: 0.38;
  background-color: rgba(0,0,0,0.12);
  border-color: rgba(0,0,0,0.12);
}
</style>

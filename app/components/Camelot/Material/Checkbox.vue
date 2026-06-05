<template>
  <div
    class="checkbox-material-wrapper"
    :class="{ checked: modelValue, disabled }"
    @click="toggle"
  >
    <div class="checkbox-container" />
    <span
      v-if="label"
      class="label-text"
    >{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label?: string
    disabled?: boolean
  }>(),
  {
    label: '',
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
.checkbox-material-wrapper {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}
.checkbox-material-wrapper .checkbox-container {
  position: relative;
  width: 18px;
  height: 18px;
  margin-right: 8px;
  border: 2px solid var(--cml-c-m3-outline, #79747e);
  border-radius: 2px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
.checked .checkbox-container {
  background-color: var(--cml-color-current-color);
  border-color: var(--cml-color-current-color);
}
.checkbox-material-wrapper .checkbox-container::after {
  content: '';
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg) translate(-1px, -1px);
  opacity: 0;
  transition: opacity 0.2s;
}
.checked .checkbox-container::after {
  opacity: 1;
}
.checkbox-material-wrapper .label-text {
  font-size: 0.875rem;
  color: var(--cml-c-m3-on-surface, #1c1b1f);
}
.disabled {
  opacity: 0.38;
  cursor: not-allowed;
  pointer-events: none;
}
</style>

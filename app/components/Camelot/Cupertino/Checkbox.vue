<template>
  <div
    class="checkbox-cupertino-wrapper"
    :class="{ checked: modelValue, disabled }"
    @click="toggle"
  >
    <div
      class="checkbox-container"
      :class="`shape-${shape}`"
    >
      <div class="check-icon" />
    </div>
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
    shape?: 'square' | 'circle'
  }>(),
  {
    label: '',
    disabled: false,
    shape: 'square',
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
.checkbox-cupertino-wrapper {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}
.checkbox-cupertino-wrapper .checkbox-container {
  width: 22px;
  height: 22px;
  border: 1px solid var(--cml-c-m3-outline-variant, #c4c7c5);
  margin-right: 8px;
  transition: background-color 0.2s, border-color 0.2s, border-radius 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
.shape-square {
  border-radius: 5px;
}
.shape-circle {
  border-radius: 50%;
}
.checked .checkbox-container {
  background-color: var(--cml-color-current-color);
  border-color: var(--cml-color-current-color);
}
.check-icon {
  width: 10px;
  height: 6px;
  border-left: 2px solid white;
  border-bottom: 2px solid white;
  transform: rotate(-45deg) translateY(-1px);
  opacity: 0;
  transition: opacity 0.2s;
}
.checked .check-icon {
  opacity: 1;
}
.checkbox-cupertino-wrapper .label-text {
  font-size: 0.875rem;
  color: var(--cml-c-m3-on-surface, #1c1b1f);
}
.disabled {
  opacity: 0.3;
  cursor: not-allowed;
  pointer-events: none;
  filter: grayscale(1);
}
</style>

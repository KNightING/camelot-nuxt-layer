<template>
  <div
    class="cupertino-input-inner"
    :class="{ focused: isFocused }"
  >
    <slot name="before" />
    
    <input
      ref="input"
      v-model="modelValue"
      class="flex-1 outline-none border-none min-w-0 w-full bg-transparent"
      :placeholder="placeholder"
      :disabled="disabled"
      @focus="onFocus"
      @blur="onBlur"
    >
    
    <slot name="after" />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    placeholder?: string
    disabled?: boolean
  }>(),
  {
    placeholder: '',
    disabled: false,
  }
)

const modelValue = defineModel<string | number>()

const isFocused = ref(false)

const onFocus = () => {
  isFocused.value = true
}
const onBlur = () => {
  isFocused.value = false
}
</script>

<style scoped>
.cupertino-input-inner {
  display: flex;
  align-items: center;
  width: 100%;
  height: 44px;
  padding: 0 16px;
  border-radius: 10px;
  background-color: var(--cml-c-m3-surface-container-highest, var(--color-surface-container-highest, #e6e0e9));
  transition: all 0.2s ease-in-out;
}
.cupertino-input-inner.focused {
  background-color: var(--cml-c-m3-surface, #fef7ff);
  box-shadow: inset 0 0 0 1px var(--cml-color-current-color, var(--color-primary));
}
</style>

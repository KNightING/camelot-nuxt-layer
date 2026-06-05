<template>
  <div
    class="material-input-inner"
    :class="{ 'floating': isFocused || (modelValue !== undefined && modelValue !== '') }"
  >
    <slot name="before" />
    
    <input
      ref="input"
      v-model="modelValue"
      class="flex-1 outline-none border-none min-w-0 w-full bg-transparent"
      :placeholder="isFocused ? placeholder : ''"
      :disabled="disabled"
      @focus="onFocus"
      @blur="onBlur"
    >
    
    <span
      v-if="label"
      class="floating-label"
    >
      {{ label }}<span
        v-if="required"
        class="text-app-error ml-0.5"
      >*</span>
    </span>
    
    <slot name="after" />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
    placeholder?: string
    disabled?: boolean
    required?: boolean
  }>(),
  {
    label: '',
    placeholder: '',
    disabled: false,
    required: false,
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
.material-input-inner {
  position: relative;
  background-color: var(--cml-c-m3-surface-container-highest, var(--color-surface-container-highest, #e6e0e9));
  border-radius: 4px 4px 0 0;
  border-bottom: 1px solid var(--cml-c-m3-outline, var(--color-outline, #79747e));
  height: 56px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  width: 100%;
}
.material-input-inner:focus-within {
  border-bottom-width: 2px;
  border-bottom-color: var(--cml-color-current-color, var(--color-primary));
}
.material-input-inner input {
  padding-top: 16px;
  padding-bottom: 4px;
}
.floating-label {
  position: absolute;
  left: 16px;
  top: 18px;
  pointer-events: none;
  font-size: 1rem;
  color: var(--cml-c-m3-on-surface-variant, #49454e);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.floating .floating-label {
  transform: translateY(-12px);
  font-size: 0.75rem;
  color: var(--cml-color-current-color, var(--color-primary));
}
</style>

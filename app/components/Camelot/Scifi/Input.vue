<template>
  <CamelotScifiFrame
    :focused="isFocused"
    :show-scanline="!disabled"
    :show-shine="isHovered && !disabled"
    :active-reticle="isFocused || isHovered"
    :show-grid="false"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="scifi-input-inner">
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
  </CamelotScifiFrame>
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

const isHovered = ref(false)
const isFocused = ref(false)

const onFocus = () => {
  isFocused.value = true
}
const onBlur = () => {
  isFocused.value = false
}
</script>

<style scoped>
.scifi-input-inner {
  display: flex;
  align-items: center;
  width: 100%;
  height: 36px;
  padding: 0 8px;
  box-sizing: border-box;
}
input {
  color: var(--cml-color-on-surface, #1c1b1f);
  font-family: inherit;
  font-size: 14px;
  transition: color 0.2s ease;
}
input::placeholder {
  color: color-mix(in srgb, var(--cml-color-current-color) 40%, var(--cml-color-on-surface, #1c1b1f));
  opacity: 0.5;
}
</style>

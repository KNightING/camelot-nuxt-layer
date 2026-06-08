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
    <div class="flex h-9 w-full items-center px-2">
      <slot name="before" />

      <input
        ref="input"
        v-model="modelValue"
        class="w-full min-w-0 flex-1 border-none bg-transparent text-sm text-on-surface outline-none transition-colors duration-200 placeholder:text-[color-mix(in_srgb,var(--cml-color-current-color)_40%,var(--color-on-surface))] placeholder:opacity-50"
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
  },
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

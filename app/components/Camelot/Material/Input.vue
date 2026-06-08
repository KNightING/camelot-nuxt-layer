<template>
  <div
    class="relative flex h-14 w-full items-center rounded-t-[4px] border-b border-outline bg-surface-container-highest px-4 transition-all duration-200 focus-within:border-b-2 focus-within:border-b-[var(--cml-color-current-color)]"
  >
    <slot name="before" />

    <input
      ref="input"
      v-model="modelValue"
      class="w-full min-w-0 flex-1 border-none bg-transparent pt-4 pb-1 outline-none"
      :placeholder="isFocused ? placeholder : ''"
      :disabled="disabled"
      @focus="onFocus"
      @blur="onBlur"
    >

    <span
      v-if="label"
      class="pointer-events-none absolute top-[18px] left-4 text-base text-on-surface-variant transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
      :class="{ '-translate-y-3 text-xs text-[var(--cml-color-current-color)]': isFloating }"
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
  },
)

const modelValue = defineModel<string | number>()

const isFocused = ref(false)

const isFloating = computed(() => isFocused.value || (modelValue.value !== undefined && modelValue.value !== ''))

const onFocus = () => {
  isFocused.value = true
}
const onBlur = () => {
  isFocused.value = false
}
</script>

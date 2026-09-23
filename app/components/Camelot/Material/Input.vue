<template>
  <div
    class="relative flex w-full items-center rounded-t-[4px] border-y border-t-transparent border-b-outline bg-surface-container-highest px-4 transition-all duration-200 focus-within:border-b-[var(--cml-color-current-color)] focus-within:shadow-[inset_0_-1px_0_var(--cml-color-current-color)]"
    :class="label ? 'min-h-14' : 'min-h-10.5'"
  >
    <slot name="before" />

    <input
      ref="input"
      v-model="modelValue"
      class="w-full min-w-0 flex-1 border-none bg-transparent outline-none"
      :class="label ? 'pt-4 pb-1' : 'py-2'"
      :placeholder="!label || isFocused ? placeholder : ''"
      :type="type"
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
    type?: CamelotInputType
  }>(),
  {
    label: '',
    placeholder: '',
    disabled: false,
    required: false,
    type: 'text',
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

const inputEl = useTemplateRef<HTMLInputElement>('input')

// 供 CamelotInput 轉接出去，讓消費端能取得原生 input 做 focus()/select() 等操作
defineExpose({
  inputEl,
})
</script>

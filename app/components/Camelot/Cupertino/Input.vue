<template>
  <div
    class="flex h-11 w-full items-center rounded-[10px] bg-surface-container-highest px-4 transition-all duration-200 ease-in-out"
    :class="{ 'bg-surface shadow-[inset_0_0_0_1px_var(--cml-color-current-color)]': isFocused }"
  >
    <slot name="before" />

    <input
      ref="input"
      v-model="modelValue"
      class="w-full min-w-0 flex-1 border-none bg-transparent outline-none"
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
  },
)

const modelValue = defineModel<string | number>()

const isFocused = ref(false)

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

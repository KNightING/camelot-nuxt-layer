<template>
  <div
    class="flex h-11 w-full items-center rounded-full px-4 transition-all duration-200 ease-spring aqua-track"
    :class="{ 'aqua-glow': isFocused }"
  >
    <slot name="before" />

    <input
      ref="input"
      v-model="modelValue"
      class="w-full min-w-0 flex-1 border-none bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant"
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

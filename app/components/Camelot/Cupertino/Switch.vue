<template>
  <div
    class="relative inline-block h-[31px] w-[51px] cursor-pointer rounded-[15.5px] align-middle transition-colors duration-300"
    :class="[
      modelValue ? 'bg-[var(--cml-color-current-color)]' : 'bg-[rgba(120,120,128,0.16)]',
      { 'cursor-not-allowed opacity-30 grayscale': disabled },
    ]"
    @click="toggle"
  >
    <div
      class="absolute top-0.5 left-0.5 h-[27px] w-[27px] rounded-full bg-white shadow-[0_3px_8px_rgba(0,0,0,0.15),0_3px_1px_rgba(0,0,0,0.06)] transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
      :class="{ 'translate-x-5': modelValue }"
    />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    disabled?: boolean
  }>(),
  {
    disabled: false,
  },
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

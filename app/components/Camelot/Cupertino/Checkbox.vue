<template>
  <div
    class="inline-flex cursor-pointer items-center gap-2 select-none"
    :class="{ 'pointer-events-none cursor-not-allowed opacity-30 grayscale': disabled }"
    @click="toggle"
  >
    <div
      class="relative inline-block h-[22px] w-[22px] shrink-0 border align-middle transition-[background-color,border-color,border-radius] duration-200"
      :class="[
        shape === 'circle' ? 'rounded-full' : 'rounded-[5px]',
        (modelValue || indeterminate)
          ? 'border-[var(--cml-color-current-color)] bg-[var(--cml-color-current-color)]'
          : 'border-outline-variant',
      ]"
    >
      <div
        class="absolute top-1/2 left-1/2 h-2 w-3 border-b-2 border-l-2 border-white transition-opacity duration-200 [transform:translate(-50%,-65%)_rotate(-45deg)]"
        :class="modelValue ? 'opacity-100' : 'opacity-0'"
      />
      <div
        class="absolute top-1/2 left-1/2 h-0.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-opacity duration-200"
        :class="(indeterminate && !modelValue) ? 'opacity-100' : 'opacity-0'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    disabled?: boolean
    shape?: 'square' | 'circle'
    indeterminate?: boolean
  }>(),
  {
    disabled: false,
    shape: 'square',
    indeterminate: false,
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

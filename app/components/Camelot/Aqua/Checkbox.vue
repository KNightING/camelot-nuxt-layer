<template>
  <div
    class="inline-flex cursor-pointer items-center gap-2 select-none"
    :class="{ 'pointer-events-none cursor-not-allowed opacity-40 grayscale': disabled }"
    @click="toggle"
  >
    <span
      class="relative inline-block h-5 w-5 shrink-0 border align-middle transition-all duration-200 ease-spring"
      :class="[
        shape === 'circle' ? 'rounded-full' : 'rounded-md',
        (modelValue || indeterminate) ? 'aqua-fill border-transparent' : 'aqua-track',
      ]"
    >
      <span
        class="absolute top-1/2 left-1/2 h-2.5 w-1.5 border-r-2 border-b-2 border-white transition-opacity duration-200 [transform:translate(-50%,-60%)_rotate(45deg)]"
        :class="modelValue ? 'opacity-100' : 'opacity-0'"
      />
      <span
        class="absolute top-1/2 left-1/2 h-0.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-opacity duration-200"
        :class="(indeterminate && !modelValue) ? 'opacity-100' : 'opacity-0'"
      />
    </span>
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

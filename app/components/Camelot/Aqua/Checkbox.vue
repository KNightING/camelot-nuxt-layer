<template>
  <div
    class="inline-flex cursor-pointer items-center gap-2 select-none"
    :class="{ 'pointer-events-none cursor-not-allowed opacity-40 grayscale': disabled }"
    @click="toggle"
  >
    <span
      class="flex h-5 w-5 items-center justify-center border transition-all duration-200 ease-spring"
      :class="[
        shape === 'circle' ? 'rounded-full' : 'rounded-md',
        modelValue ? 'aqua-fill border-transparent' : 'aqua-track',
      ]"
    >
      <span
        class="h-2 w-1 rotate-45 border-r-2 border-b-2 border-white transition-opacity duration-200"
        :class="modelValue ? 'opacity-100' : 'opacity-0'"
      />
    </span>
    <span
      v-if="label"
      class="text-sm text-on-surface"
    >{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label?: string
    disabled?: boolean
    shape?: 'square' | 'circle'
  }>(),
  {
    label: '',
    disabled: false,
    shape: 'square',
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

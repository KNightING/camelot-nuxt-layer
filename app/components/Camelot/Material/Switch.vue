<template>
  <div
    class="relative inline-block h-8 w-[52px] cursor-pointer rounded-2xl border-2 align-middle transition-all duration-200"
    :class="[
      modelValue
        ? 'border-[var(--cml-color-current-color)] bg-[var(--cml-color-current-color)]'
        : 'border-outline bg-surface-container-highest',
      { 'cursor-not-allowed border-black/[0.12]! bg-black/[0.12]! opacity-[0.38]': disabled },
    ]"
    @click="toggle"
  >
    <div
      class="absolute top-1/2 -translate-y-1/2 rounded-full transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
      :class="modelValue
        ? 'left-5 h-6 w-6 bg-[var(--cml-color-current-on-color)]'
        : 'left-1 h-4 w-4 bg-outline'"
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

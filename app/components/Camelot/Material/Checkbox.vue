<template>
  <div
    class="inline-flex cursor-pointer items-center select-none"
    :class="{ 'pointer-events-none cursor-not-allowed opacity-[0.38]': disabled }"
    @click="toggle"
  >
    <span
      class="relative mr-2 flex h-[18px] w-[18px] items-center justify-center rounded-[2px] border-2 transition-all duration-200 after:h-2 after:w-1 after:border-r-2 after:border-b-2 after:border-white after:opacity-0 after:[transform:rotate(45deg)_translate(-1px,-1px)] after:content-['']"
      :class="modelValue
        ? 'border-[var(--cml-color-current-color)] bg-[var(--cml-color-current-color)] after:opacity-100'
        : 'border-outline'"
    />
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
  }>(),
  {
    label: '',
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

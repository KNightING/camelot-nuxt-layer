<template>
  <div
    class="inline-flex cursor-pointer items-center gap-2 select-none"
    :class="{ 'pointer-events-none cursor-not-allowed opacity-[0.38]': disabled }"
    @click="toggle"
  >
    <span
      class="relative inline-block h-[18px] w-[18px] shrink-0 rounded-[2px] border-2 align-middle transition-all duration-200"
      :class="(modelValue || indeterminate)
        ? 'border-[var(--cml-color-current-color)] bg-[var(--cml-color-current-color)]'
        : 'border-outline'"
    >
      <span
        class="absolute top-1/2 left-1/2 h-2 w-1 border-r-2 border-b-2 border-white transition-opacity duration-200 [transform:translate(-50%,-60%)_rotate(45deg)]"
        :class="modelValue ? 'opacity-100' : 'opacity-0'"
      />
      <span
        class="absolute top-1/2 left-1/2 h-0.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-opacity duration-200"
        :class="(indeterminate && !modelValue) ? 'opacity-100' : 'opacity-0'"
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
    indeterminate?: boolean
  }>(),
  {
    label: '',
    disabled: false,
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

<template>
  <div
    class="inline-flex cursor-pointer items-center select-none"
    :class="{ 'pointer-events-none cursor-not-allowed opacity-30 grayscale': disabled }"
    @click="toggle"
  >
    <div
      class="mr-2 flex h-[22px] w-[22px] items-center justify-center border transition-[background-color,border-color,border-radius] duration-200"
      :class="[
        shape === 'circle' ? 'rounded-full' : 'rounded-[5px]',
        modelValue
          ? 'border-[var(--cml-color-current-color)] bg-[var(--cml-color-current-color)]'
          : 'border-outline-variant',
      ]"
    >
      <div
        class="h-1.5 w-2.5 border-b-2 border-l-2 border-white opacity-0 transition-opacity duration-200 [transform:rotate(-45deg)_translateY(-1px)]"
        :class="{ 'opacity-100': modelValue }"
      />
    </div>
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

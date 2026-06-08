<template>
  <div
    class="relative inline-block h-[31px] w-[51px] cursor-pointer rounded-full align-middle backdrop-blur-md transition-colors duration-300 ease-spring"
    :class="[
      modelValue ? 'aqua-fill' : 'aqua-track',
      { 'pointer-events-none cursor-not-allowed opacity-30 grayscale': disabled },
    ]"
    @click="toggle"
  >
    <div
      class="aqua-thumb absolute top-[2px] left-[2px] h-[27px] w-[27px] rounded-full transition-transform duration-300 ease-spring"
      :class="{ 'translate-x-[20px]': modelValue }"
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

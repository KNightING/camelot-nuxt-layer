<template>
  <button
    type="button"
    role="switch"
    class="group relative inline-block h-7 w-[46px] shrink-0 cursor-pointer rounded-full align-middle outline-none transition-colors duration-300 focus-visible:tactile-ring disabled:cursor-not-allowed disabled:opacity-40 disabled:grayscale"
    :class="{
      'tactile-fill': modelValue,
      'bg-surface-container-highest': !modelValue,
    }"
    :aria-checked="modelValue"
    :disabled="disabled"
    @click="toggle"
  >
    <!-- 按住時拇指橫向拉伸；開啟狀態下同時左移，讓拉伸往軌道內側長 -->
    <span
      class="tactile-thumb absolute top-[3px] h-[22px] w-[22px] rounded-full transition-[left,width] duration-500 ease-tactile group-active:w-7 motion-reduce:transition-none"
      :class="{
        'left-[21px] group-active:left-[15px]': modelValue,
        'left-[3px]': !modelValue,
      }"
    />
  </button>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  change: [checked: boolean]
}>()

withDefaults(
  defineProps<{
    disabled?: boolean
  }>(),
  {
    disabled: false,
  },
)

const modelValue = defineModel<boolean>({ default: false })

const toggle = () => {
  modelValue.value = !modelValue.value
  emit('change', modelValue.value)
}
</script>

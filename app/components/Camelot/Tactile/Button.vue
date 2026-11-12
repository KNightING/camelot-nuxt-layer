<template>
  <button
    class="relative inline-flex min-h-10.5 cursor-pointer items-center justify-center gap-2 rounded-tactile-control px-6 py-2 font-semibold whitespace-nowrap text-[var(--cml-color-current-on-color)] tactile-fill outline-none transition-transform duration-500 ease-tactile hover:brightness-105 focus-visible:tactile-ring active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:grayscale motion-reduce:transition-none"
    :disabled="disabled"
    :aria-busy="loading"
    :class="{ 'pointer-events-none': loading }"
    @click="emit('click', $event)"
  >
    <span
      class="inline-flex items-center justify-center gap-2 transition-opacity duration-200"
      :class="{ 'opacity-0': loading }"
    >
      <slot />
    </span>
    <span
      v-if="loading"
      class="cml-button-spinner"
      aria-hidden="true"
    />
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    disabled?: boolean
    /** 處理中：顯示轉圈並擋下點擊，按鈕寬度不變 */
    loading?: boolean
  }>(),
  {
    disabled: false,
    loading: false,
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

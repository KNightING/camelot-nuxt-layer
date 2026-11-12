<template>
  <button
    class="relative inline-flex cursor-pointer items-center justify-center gap-2 min-h-10.5 rounded-xl border border-transparent bg-[var(--cml-color-current-color)] px-5 py-2 font-normal text-[var(--cml-color-current-on-color)] outline-none transition-[opacity,transform] duration-200 enabled:active:scale-[0.97] enabled:active:opacity-60 disabled:cursor-not-allowed disabled:opacity-30 disabled:grayscale"
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

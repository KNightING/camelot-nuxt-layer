<template>
  <button
    class="inline-flex cursor-pointer items-center justify-center gap-2 min-h-10.5 rounded-xl border border-transparent bg-[var(--cml-color-current-color)] px-5 py-2 font-normal text-[var(--cml-color-current-on-color)] outline-none transition-[opacity,transform] duration-200 enabled:active:scale-[0.97] enabled:active:opacity-60 disabled:cursor-not-allowed disabled:opacity-30 disabled:grayscale"
    :disabled="disabled"
    @click="emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    disabled?: boolean
  }>(),
  {
    disabled: false,
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    class="inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold whitespace-nowrap text-[var(--cml-color-current-on-color)] aqua-fill transition-transform duration-200 ease-spring outline-none hover:brightness-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:grayscale"
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

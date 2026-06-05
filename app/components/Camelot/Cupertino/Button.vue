<template>
  <button
    class="btn-cupertino"
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
  }
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<style scoped>
.btn-cupertino {
  font-family: inherit;
  font-weight: 400;
  font-size: 1.0625rem;
  padding: 12px 20px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: var(--cml-color-current-color);
  color: var(--cml-color-current-on-color);
  outline: none;
}
.btn-cupertino:disabled {
  cursor: not-allowed;
  opacity: 0.3;
  filter: grayscale(1);
}
.btn-cupertino:active:not(:disabled) {
  opacity: 0.6;
  transform: scale(0.97);
}
</style>

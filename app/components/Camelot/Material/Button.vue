<template>
  <button
    class="btn-material"
    :disabled="disabled"
    @click="emit('click', $event)"
  >
    <CamelotRippleEffect
      class="ripple-container"
      :ripple-color="rippleColor"
    >
      <div class="btn-material-inner">
        <slot />
      </div>
    </CamelotRippleEffect>
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    disabled?: boolean
    color?: string
    isContainer?: boolean
  }>(),
  {
    disabled: false,
    color: 'primary',
    isContainer: false,
  }
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const rippleColor = computed(() => {
  return props.isContainer ? `var(--color-on-${props.color}-container)` : '#ffffff'
})
</script>

<style scoped>
.btn-material {
  display: inline-block;
  padding: 0;
  border: none;
  background: none;
  outline: none;
  cursor: pointer;
}
.ripple-container {
  display: block;
  border-radius: 100px;
}
.btn-material-inner {
  font-family: inherit;
  font-weight: 500;
  font-size: 0.875rem;
  padding: 10px 24px;
  border-radius: 100px;
  transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: var(--cml-color-current-color);
  color: var(--cml-color-current-on-color);
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
}
.btn-material:disabled .btn-material-inner {
  cursor: not-allowed;
  opacity: 0.38;
  box-shadow: none !important;
}
.btn-material:hover:not(:disabled) .btn-material-inner {
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  filter: brightness(1.08);
}
</style>

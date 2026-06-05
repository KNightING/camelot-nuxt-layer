<template>
  <div
    class="camelot-button-scifi-wrapper"
    :disabled="disabled ? true : undefined"
  >
    <CamelotScifiFrame
      :filled="isActive && !disabled"
      :show-scanline="!disabled"
      :show-shine="isHovered && !disabled"
      :active-reticle="isActive || isFocused || isHovered"
      :focused="isFocused"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      @mousedown="isActive = true"
      @mouseup="isActive = false"
      @focus="isFocused = true"
      @blur="isFocused = false"
      :tabindex="disabled ? -1 : 0"
    >
      <button
        class="btn-scifi"
        :disabled="disabled"
        @click="emit('click', $event)"
      >
        <slot />
      </button>
    </CamelotScifiFrame>
  </div>
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

const isHovered = ref(false)
const isFocused = ref(false)
const isActive = ref(false)
</script>

<style scoped>
.camelot-button-scifi-wrapper {
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
  outline: none;
}
.camelot-button-scifi-wrapper[disabled] {
  cursor: not-allowed;
  opacity: 0.6;
  pointer-events: none;
}
.btn-scifi {
  padding: 8px 24px;
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: color-mix(in srgb, var(--cml-color-current-color) 80%, white);
  font-family: inherit;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  transition: all 0.2s ease;
  position: relative;
  z-index: 10;
  outline: none;
  width: 100%;
}
.camelot-button-scifi-wrapper:active .btn-scifi {
  color: var(--cml-color-current-on-color);
}
</style>

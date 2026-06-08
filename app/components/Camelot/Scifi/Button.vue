<template>
  <div
    class="group inline-block cursor-pointer align-middle outline-none [&[disabled]]:pointer-events-none [&[disabled]]:cursor-not-allowed [&[disabled]]:opacity-60"
    :disabled="disabled ? true : undefined"
  >
    <CamelotScifiFrame
      :filled="isActive && !disabled"
      :show-scanline="!disabled"
      :show-shine="isHovered && !disabled"
      :active-reticle="isActive || isFocused || isHovered"
      :focused="isFocused"
      :tabindex="disabled ? -1 : 0"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      @mousedown="isActive = true"
      @mouseup="isActive = false"
      @focus="isFocused = true"
      @blur="isFocused = false"
    >
      <button
        class="relative z-10 flex w-full min-w-[120px] cursor-pointer items-center justify-center gap-2 border-none bg-transparent px-6 py-2 font-bold tracking-[0.15em] text-[color-mix(in_srgb,var(--cml-color-current-color)_80%,white)] uppercase outline-none transition-all duration-200 group-active:text-[var(--cml-color-current-on-color)]"
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
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const isHovered = ref(false)
const isFocused = ref(false)
const isActive = ref(false)
</script>

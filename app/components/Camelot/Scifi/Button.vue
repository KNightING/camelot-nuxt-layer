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
        class="relative z-10 flex min-h-10 w-full min-w-[120px] cursor-pointer items-center justify-center gap-2 border-none bg-transparent px-6 py-2 font-bold tracking-[0.15em] text-[color-mix(in_srgb,var(--cml-color-current-color)_80%,white)] uppercase outline-none transition-all duration-200 group-active:text-[var(--cml-color-current-on-color)]"
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
    </CamelotScifiFrame>
  </div>
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

const isHovered = ref(false)
const isFocused = ref(false)
const isActive = ref(false)
</script>

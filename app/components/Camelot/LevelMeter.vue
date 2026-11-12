<template>
  <div
    class="flex w-full items-center gap-2 text-xs text-on-surface-variant"
    :class="roleColorClass"
    role="meter"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-valuenow="levelPercent"
    :aria-label="label"
  >
    <span
      v-if="label || $slots.label"
      class="shrink-0"
    >
      <slot name="label">{{ label }}</slot>
    </span>
    <div class="flex min-w-0 flex-1 gap-[3px]">
      <span
        v-for="segment in segmentStates"
        :key="segment.index"
        class="h-1.5 min-w-0 flex-1 transition-colors duration-100"
        :class="[
          shapeClass,
          {
            'bg-warning': segment.isLit && segment.isPeak,
            [litClass]: segment.isLit && !segment.isPeak,
            [idleClass]: !segment.isLit,
          },
        ]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** 目前音量，0–1 */
    level?: number
    /** 分段數 */
    segments?: number
    /** 超過這個比例（0–1）的分段視為峰值區，亮起時改用警示色 */
    peakFrom?: number
    /** 聲道名稱等標籤，例如 L / R */
    label?: string
    color?: CamelotColorRole
  }>(),
  {
    level: 0,
    segments: 16,
    peakFrom: 0.85,
    label: '',
    color: 'primary',
  },
)

const FULL_PERCENT = 100

const { themeMode } = useCamelotTheme()

const roleColorClass = useCamelotRoleColorClass(() => props.color)

const clampedLevel = computed(() => Math.min(1, Math.max(0, props.level)))

const levelPercent = computed(() => Math.round(clampedLevel.value * FULL_PERCENT))

const litSegmentCount = computed(() => Math.round(clampedLevel.value * props.segments))

const firstPeakIndex = computed(() => Math.round(props.peakFrom * props.segments))

const segmentStates = computed(() =>
  Array.from({ length: props.segments }, (_, index) => ({
    index,
    isLit: index < litSegmentCount.value,
    isPeak: index >= firstPeakIndex.value,
  })),
)

const shapeClass = computed(() => {
  switch (themeMode.value) {
    case 'scifi':
      return 'rounded-none'
    case 'aqua':
    case 'cupertino':
      return 'rounded-full'
    default:
      return 'rounded-[2px]'
  }
})

const litClass = computed(() => {
  switch (themeMode.value) {
    case 'aqua':
      return 'aqua-fill [--cml-aqua-fill-gloss:transparent]'
    case 'scifi':
      return 'bg-[var(--cml-color-current-color)] shadow-[0_0_6px_color-mix(in_srgb,var(--cml-color-current-color)_70%,transparent)]'
    default:
      return 'bg-[var(--cml-color-current-color)]'
  }
})

const idleClass = computed(() => {
  switch (themeMode.value) {
    case 'tactile':
      return 'bg-surface-container-highest'
    case 'aqua':
      return 'bg-[color-mix(in_srgb,var(--cml-color-current-color)_14%,transparent)]'
    case 'scifi':
      return 'bg-[color-mix(in_srgb,var(--cml-color-current-color)_25%,transparent)]'
    default:
      return 'bg-outline-variant'
  }
})
</script>

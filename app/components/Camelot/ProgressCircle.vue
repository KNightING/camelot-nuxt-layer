<template>
  <div
    class="relative inline-flex items-center justify-center"
    :class="roleColorClass"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <svg
      :width="size"
      :height="size"
      :viewBox="`0 0 ${size} ${size}`"
      class="-rotate-90 overflow-visible"
      :class="{ 'animate-spin motion-reduce:animate-none': indeterminate }"
    >
      <defs v-if="themeMode === 'aqua'">
        <linearGradient
          :id="gradId"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop
            offset="0%"
            stop-color="var(--cml-color-current-color)"
          />
          <stop
            offset="100%"
            stop-color="color-mix(in srgb, var(--cml-color-current-color) 70%, white)"
          />
        </linearGradient>
      </defs>

      <!-- track -->
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke-width="strokeWidth"
        :class="trackStrokeClass"
      />
      <!-- progress -->
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke="progressStroke"
        :stroke-width="strokeWidth"
        :stroke-linecap="linecap"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashoffset"
        class="transition-[stroke-dashoffset] duration-500 ease-spring motion-reduce:transition-none"
        :style="progressStyle"
      />
    </svg>

    <span
      v-if="showLabel && !indeterminate"
      class="absolute font-semibold text-on-surface tabular-nums"
      :style="{ fontSize: `${Math.round(size * 0.26)}px` }"
    >{{ labelText }}</span>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    value?: number
    max?: number
    color?: CamelotColorRole
    indeterminate?: boolean
    showLabel?: boolean
    labelMode?: 'percent' | 'fraction'
    size?: number
    strokeWidth?: number
  }>(),
  {
    value: 0,
    max: 100,
    color: 'primary',
    indeterminate: false,
    showLabel: false,
    labelMode: 'percent',
    size: 64,
    strokeWidth: 6,
  },
)

const { themeMode } = useCamelotTheme()
const roleColorClass = useCamelotRoleColorClass(() => props.color)
const gradId = useId()

const center = computed(() => props.size / 2)
const radius = computed(() => (props.size - props.strokeWidth) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)

const percent = computed(() => {
  if (props.max <= 0) return 0
  return Math.max(0, Math.min(100, (props.value / props.max) * 100))
})

const dashoffset = computed(() =>
  props.indeterminate
    ? circumference.value * 0.7
    : circumference.value * (1 - percent.value / 100),
)

const labelText = computed(() =>
  props.labelMode === 'fraction'
    ? `${props.value} / ${props.max}`
    : `${Math.round(percent.value)}%`,
)

const linecap = computed<'round' | 'butt'>(() => (themeMode.value === 'scifi' ? 'butt' : 'round'))

const progressStroke = computed(() =>
  themeMode.value === 'aqua' ? `url(#${gradId})` : 'var(--cml-color-current-color)',
)

const trackStrokeClass = computed(() => {
  switch (themeMode.value) {
    case 'aqua':
      return 'stroke-[color-mix(in_srgb,var(--cml-color-current-color)_14%,transparent)]'
    case 'scifi':
      return 'stroke-[color-mix(in_srgb,var(--cml-color-current-color)_18%,transparent)]'
    default:
      return 'stroke-outline-variant'
  }
})

const progressStyle = computed(() =>
  themeMode.value === 'scifi'
    ? { filter: 'drop-shadow(0 0 4px color-mix(in srgb, var(--cml-color-current-color) 70%, transparent))' }
    : {},
)
</script>

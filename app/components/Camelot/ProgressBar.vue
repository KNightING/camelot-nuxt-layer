<template>
  <div
    class="flex w-full items-center gap-3"
    :class="roleColorClass"
  >
    <div
      class="relative w-full overflow-hidden"
      :class="[trackClass, radiusClass]"
      :style="{ height }"
    >
      <!-- determinate -->
      <div
        v-if="!indeterminate"
        class="h-full transition-[width] duration-500 ease-spring motion-reduce:transition-none"
        :class="[fillClass, radiusClass]"
        :style="{ width: `${percent}%` }"
      />
      <!-- indeterminate sweep -->
      <div
        v-else
        class="h-full w-[40%] animate-progress-sweep motion-reduce:animate-none"
        :class="[fillClass, radiusClass]"
      />
    </div>

    <span
      v-if="showLabel && !indeterminate"
      class="shrink-0 text-xs font-medium text-on-surface tabular-nums"
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
    height?: string
    rounded?: boolean
  }>(),
  {
    value: 0,
    max: 100,
    color: 'primary',
    indeterminate: false,
    showLabel: false,
    labelMode: 'percent',
    height: '8px',
    rounded: true,
  },
)

const { themeMode } = useCamelotTheme()
const roleColorClass = useCamelotRoleColorClass(() => props.color)

const percent = computed(() => {
  if (props.max <= 0) return 0
  return Math.max(0, Math.min(100, (props.value / props.max) * 100))
})

const labelText = computed(() =>
  props.labelMode === 'fraction'
    ? `${props.value} / ${props.max}`
    : `${Math.round(percent.value)}%`,
)

const radiusClass = computed(() =>
  props.rounded && themeMode.value !== 'scifi' ? 'rounded-full' : 'rounded-none',
)

const trackClass = computed(() => {
  switch (themeMode.value) {
    case 'aqua':
      return 'aqua-track backdrop-blur-md'
    case 'scifi':
      return 'border border-[color-mix(in_srgb,var(--cml-color-current-color)_30%,transparent)] bg-[color-mix(in_srgb,var(--cml-color-current-color)_8%,transparent)]'
    default:
      return 'bg-surface-container-highest'
  }
})

const fillClass = computed(() => {
  switch (themeMode.value) {
    case 'aqua':
      return 'aqua-fill'
    case 'scifi':
      return 'bg-[var(--cml-color-current-color)] shadow-[0_0_8px_color-mix(in_srgb,var(--cml-color-current-color)_70%,transparent)]'
    default:
      return 'bg-[var(--cml-color-current-color)]'
  }
})
</script>

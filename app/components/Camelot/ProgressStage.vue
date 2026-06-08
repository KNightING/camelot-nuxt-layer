<template>
  <div
    class="relative inline-block"
    :class="roleColorClass"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <svg
      :width="size"
      :height="size"
      :viewBox="`0 0 ${size} ${size}`"
      class="overflow-visible"
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

      <!-- track (帶左上破口的弧) -->
      <path
        :d="arcPath"
        fill="none"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        :class="trackStrokeClass"
      />
      <!-- progress -->
      <path
        :d="arcPath"
        fill="none"
        :stroke="progressStroke"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        :stroke-dasharray="arcLength"
        :stroke-dashoffset="dashoffset"
        class="transition-[stroke-dashoffset] duration-500 ease-spring motion-reduce:transition-none"
        :style="progressStyle"
      />
    </svg>

    <!-- 破口處（左上）：當前階段數字「突破」而出，總階段斜下方（朝中心），視為一體 -->
    <!-- 當前階段：文字靠右、最小 3 字元寬、向左上突破 -->
    <span
      class="absolute block text-right leading-none font-extrabold text-[var(--cml-color-current-color)] italic"
      :style="{ right: '62px', top: '4px', minWidth: '3ch', fontSize: `${currentFontPx}px` }"
    >{{ current }}</span>
    <!-- 斜線：圓心靠左上 -->
    <span
      class="absolute leading-none font-bold text-on-surface/35"
      :style="{ left: `${size * 0.46}px`, top: `${size * 0.44}px`, transform: 'translate(-50%, -50%) rotate(30deg)', fontSize: `${Math.round(size * 0.36)}px` }"
    >/</span>
    <!-- 全部階段：圓心靠右下 -->
    <span
      class="absolute leading-none font-semibold text-on-surface/45 italic"
      :style="{ left: `${size * 0.6}px`, top: `${size * 0.62}px`, transform: 'translate(-50%, -50%)', fontSize: `${Math.round(size * 0.26)}px` }"
    >{{ total }}</span>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    current?: number
    total?: number
    color?: CamelotColorRole
    size?: number
    strokeWidth?: number
  }>(),
  {
    current: 1,
    total: 1,
    color: 'primary',
    size: 96,
    strokeWidth: 7,
  },
)

const { themeMode } = useCamelotTheme()
const roleColorClass = useCamelotRoleColorClass(() => props.color)
const gradId = useId()

// 左上破口：破口中心在 225°（左上）。開口寬度先統一固定為「十位數（2 位）」一致。
const GAP_CENTER_DEG = 225
const gapDeg = computed(() => 98)
const startDeg = computed(() => GAP_CENTER_DEG + gapDeg.value / 2)
const sweepDeg = computed(() => 360 - gapDeg.value)

const center = computed(() => props.size / 2)
const radius = computed(() => (props.size - props.strokeWidth) / 2)
const arcLength = computed(() => radius.value * (sweepDeg.value * Math.PI) / 180)

const fraction = computed(() => {
  if (props.total <= 0) return 0
  return Math.max(0, Math.min(1, props.current / props.total))
})

const dashoffset = computed(() => arcLength.value * (1 - fraction.value))

// 當前數字字級：3 位數（含）以下固定 51px；千位數（4 位以上）降一階為 40px
const currentFontPx = computed(() => {
  const digits = String(props.current ?? '').length
  return digits <= 3 ? 51 : 40
})

const polar = (cx: number, cy: number, r: number, deg: number) => {
  const a = (deg * Math.PI) / 180
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const
}

const arcPath = computed(() => {
  const c = center.value
  const r = radius.value
  const [x0, y0] = polar(c, c, r, startDeg.value)
  const [x1, y1] = polar(c, c, r, startDeg.value + sweepDeg.value)
  const large = sweepDeg.value > 180 ? 1 : 0
  return `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`
})

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

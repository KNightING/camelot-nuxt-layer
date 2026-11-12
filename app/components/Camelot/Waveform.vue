<template>
  <div
    ref="track"
    class="flex w-full touch-none items-center gap-[3px] outline-none focus-visible:tactile-ring"
    :class="[
      roleColorClass,
      {
        'cursor-pointer': isSeekable,
        'opacity-40': disabled,
      },
    ]"
    :style="{ height }"
    role="slider"
    :tabindex="isSeekable ? 0 : -1"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-valuenow="progressPercent"
    :aria-disabled="disabled"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @keydown="onKeydown"
  >
    <span
      v-for="bar in bars"
      :key="bar.index"
      class="min-w-0 flex-1 transition-colors duration-200"
      :class="[
        shapeClass,
        {
          [playedClass]: bar.isPlayed,
          [idleClass]: !bar.isPlayed,
        },
      ]"
      :style="{ height: bar.height }"
    />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** 每根波形的振幅，0–1；陣列長度即波形根數 */
    peaks?: number[]
    /** 整體高度（CSS 長度） */
    height?: string
    /** 是否可點擊、拖曳或用方向鍵跳轉 */
    seekable?: boolean
    disabled?: boolean
    color?: CamelotColorRole
  }>(),
  {
    peaks: () => [],
    height: '72px',
    seekable: true,
    disabled: false,
    color: 'primary',
  },
)

const emit = defineEmits<{
  seek: [progress: number]
}>()

/** 播放進度，0–1 */
const progress = defineModel<number>('progress', { default: 0 })

// 最矮的波形仍保留一點高度，靜音段才看得到
const MIN_BAR_HEIGHT_PERCENT = 8
const FULL_PERCENT = 100
// 方向鍵每按一次移動的進度
const KEYBOARD_STEP = 0.05

const { themeMode } = useCamelotTheme()

const roleColorClass = useCamelotRoleColorClass(() => props.color)

const trackEl = useTemplateRef<HTMLElement>('track')

const isSeekable = computed(() => props.seekable && !props.disabled)

const clampUnit = (value: number): number => Math.min(1, Math.max(0, value))

const progressPercent = computed(() => Math.round(clampUnit(progress.value) * FULL_PERCENT))

const playedBarCount = computed(() => Math.round(clampUnit(progress.value) * props.peaks.length))

const bars = computed(() =>
  props.peaks.map((peak, index) => ({
    index,
    height: `${Math.max(MIN_BAR_HEIGHT_PERCENT, clampUnit(peak) * FULL_PERCENT)}%`,
    isPlayed: index < playedBarCount.value,
  })),
)

const shapeClass = computed(() => (themeMode.value === 'scifi' ? 'rounded-none' : 'rounded-full'))

const playedClass = computed(() => {
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

const seekTo = (nextProgress: number) => {
  progress.value = clampUnit(nextProgress)
  emit('seek', progress.value)
}

const seekToPointer = (event: PointerEvent) => {
  const rect = trackEl.value?.getBoundingClientRect()
  if (!rect || rect.width === 0) return
  seekTo((event.clientX - rect.left) / rect.width)
}

const onPointerDown = (event: PointerEvent) => {
  if (!isSeekable.value) return
  seekToPointer(event)
  // 捕捉指標，拖出元件範圍後仍持續收到 pointermove
  trackEl.value?.setPointerCapture(event.pointerId)
}

const onPointerMove = (event: PointerEvent) => {
  if (!isSeekable.value || event.buttons === 0) return
  seekToPointer(event)
}

const onKeydown = (event: KeyboardEvent) => {
  if (!isSeekable.value) return
  if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
  event.preventDefault()
  const direction = event.key === 'ArrowRight' ? 1 : -1
  seekTo(progress.value + direction * KEYBOARD_STEP)
}
</script>

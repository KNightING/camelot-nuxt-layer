<template>
  <div
    class="cml-slider w-full"
    :class="[roleColorClass, { 'pointer-events-none opacity-50': disabled }]"
  >
    <div
      ref="trackRef"
      class="relative w-full cursor-pointer"
      :style="{ height: `${height}px` }"
      @pointerdown="onTrackPointerDown"
    >
      <!-- track -->
      <div
        class="absolute inset-0"
        :class="[trackClass, radiusClass]"
      />
      <!-- filled -->
      <div
        class="absolute top-0 bottom-0"
        :class="[fillClass, radiusClass]"
        :style="fillStyle"
      />
      <!-- marks (間隔刻度) -->
      <span
        v-for="m in normalizedMarks"
        :key="`mk-${m.value}`"
        class="absolute top-1/2 z-[1] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-on-surface/40"
        :style="{ left: `${percent(m.value)}%` }"
      />
      <!-- thumbs -->
      <button
        v-for="(v, idx) in values"
        :key="`thumb-${idx}`"
        type="button"
        class="cml-slider-thumb absolute top-1/2 z-[2] -translate-x-1/2 -translate-y-1/2 touch-none"
        :class="thumbClass"
        :style="{ left: `${percent(v)}%`, width: `${thumbSize}px`, height: `${thumbSize}px` }"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuenow="v"
        role="slider"
        @pointerdown.stop="onThumbDown(idx, $event)"
        @keydown="onThumbKey(idx, $event)"
      >
        <span
          v-if="showTooltip"
          class="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 rounded-md bg-surface-container-highest px-1.5 py-0.5 text-xs text-on-surface shadow-md tabular-nums"
        >{{ v }}</span>
      </button>
    </div>

    <!-- 間隔的文字 -->
    <div
      v-if="hasLabels"
      class="relative mt-2 h-4 w-full text-xs text-on-surface-variant"
    >
      <span
        v-for="m in normalizedMarks"
        :key="`lb-${m.value}`"
        class="absolute -translate-x-1/2 whitespace-nowrap tabular-nums"
        :style="{ left: `${percent(m.value)}%` }"
      >{{ m.label ?? m.value }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    min?: number
    max?: number
    /** 間隔停頓：吸附到 step 的倍數 */
    step?: number
    /** 雙滑桿區間模式（modelValue 為 [起, 迄]） */
    range?: boolean
    /** 軌道高度（px） */
    height?: number
    /** 間隔刻度 / 文字：true 自動於 step 產生；或自訂 { value, label? }[] */
    marks?: boolean | { value: number, label?: string }[]
    showTooltip?: boolean
    color?: CamelotColorRole
    disabled?: boolean
  }>(),
  {
    min: 0,
    max: 100,
    step: 1,
    range: false,
    height: 6,
    marks: false,
    showTooltip: false,
    color: 'primary',
    disabled: false,
  },
)

const model = defineModel<number | [number, number]>({ default: 0 })

const { themeMode } = useCamelotTheme()
const roleColorClass = useCamelotRoleColorClass(() => props.color)

const trackRef = useTemplateRef<HTMLElement>('trackRef')
const thumbSize = computed(() => Math.max(props.height + 8, 16))

const values = computed<number[]>(() => {
  if (props.range) {
    const m = Array.isArray(model.value) ? model.value : [props.min, props.max]
    return [m[0] ?? props.min, m[1] ?? props.max]
  }
  return [typeof model.value === 'number' ? model.value : props.min]
})

const span = computed(() => (props.max - props.min) || 1)
const percent = (v: number) => ((clamp(v, props.min, props.max) - props.min) / span.value) * 100

const fillStyle = computed(() => {
  if (props.range) {
    const lo = Math.min(percent(values.value[0]!), percent(values.value[1]!))
    const hi = Math.max(percent(values.value[0]!), percent(values.value[1]!))
    return {
      left: `${lo}%`,
      width: `${hi - lo}%`,
    }
  }
  return {
    left: '0%',
    width: `${percent(values.value[0]!)}%`,
  }
})

function clamp(v: number, lo: number, hi: number) {
  return Math.min(Math.max(v, lo), hi)
}

const snap = (raw: number) => {
  const stepped = Math.round((raw - props.min) / props.step) * props.step + props.min
  // 修正浮點誤差
  const decimals = (String(props.step).split('.')[1] || '').length
  return clamp(Number(stepped.toFixed(decimals)), props.min, props.max)
}

const setThumb = (index: number, raw: number) => {
  const v = snap(raw)
  if (props.range) {
    const arr: [number, number] = [values.value[0]!, values.value[1]!]
    arr[index] = v
    if (index === 0) arr[0] = Math.min(arr[0], arr[1])
    else arr[1] = Math.max(arr[1], arr[0])
    model.value = arr
  }
  else {
    model.value = v
  }
}

const ratioFromEvent = (e: PointerEvent) => {
  const r = trackRef.value?.getBoundingClientRect()
  if (!r || r.width === 0) return 0
  return clamp((e.clientX - r.left) / r.width, 0, 1)
}
const rawFromEvent = (e: PointerEvent) => props.min + ratioFromEvent(e) * span.value

let activeThumb = -1
const onMove = (e: PointerEvent) => {
  if (activeThumb < 0) return
  setThumb(activeThumb, rawFromEvent(e))
}
const onUp = () => {
  activeThumb = -1
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerup', onUp)
}
const startDrag = (index: number) => {
  activeThumb = index
  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
}

const onThumbDown = (index: number, e: PointerEvent) => {
  if (props.disabled) return
  ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  startDrag(index)
}

const onTrackPointerDown = (e: PointerEvent) => {
  if (props.disabled) return
  const raw = rawFromEvent(e)
  const idx = props.range
    ? (Math.abs(raw - values.value[0]!) <= Math.abs(raw - values.value[1]!) ? 0 : 1)
    : 0
  setThumb(idx, raw)
  startDrag(idx)
}

const onThumbKey = (index: number, e: KeyboardEvent) => {
  const delta = e.key === 'ArrowRight' || e.key === 'ArrowUp'
    ? props.step
    : e.key === 'ArrowLeft' || e.key === 'ArrowDown'
      ? -props.step
      : 0
  if (delta === 0) return
  e.preventDefault()
  setThumb(index, (values.value[index] ?? props.min) + delta)
}

const normalizedMarks = computed<{ value: number, label?: string }[]>(() => {
  if (!props.marks) return []
  if (props.marks === true) {
    const count = span.value / props.step
    if (count > 20) return []
    const out: { value: number, label?: string }[] = []
    for (let v = props.min; v <= props.max + 1e-9; v += props.step) out.push({ value: Number(v.toFixed(6)) })
    return out
  }
  return props.marks
})
const hasLabels = computed(() => normalizedMarks.value.some(m => m.label != null) || (props.marks === true))

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerup', onUp)
})

const radiusClass = computed(() => (themeMode.value === 'scifi' ? 'rounded-none' : 'rounded-full'))

const trackClass = computed(() => {
  switch (themeMode.value) {
    case 'aqua':
      return 'aqua-track backdrop-blur-md'
    case 'scifi':
      return 'bg-[color-mix(in_srgb,var(--cml-color-current-color)_12%,transparent)] border border-[color-mix(in_srgb,var(--cml-color-current-color)_30%,transparent)]'
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

const thumbClass = computed(() => {
  switch (themeMode.value) {
    case 'aqua':
      return 'aqua-thumb rounded-full border border-white/60'
    case 'scifi':
      return 'rotate-45 bg-[var(--cml-color-current-color)] shadow-[0_0_8px_var(--cml-color-current-color)]'
    case 'cupertino':
      return 'rounded-full bg-white shadow-md ring-1 ring-black/10'
    default:
      return 'rounded-full bg-[var(--cml-color-current-color)] shadow-md ring-2 ring-surface'
  }
})
</script>

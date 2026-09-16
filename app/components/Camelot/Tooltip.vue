<template>
  <!--
    觸發器：滑鼠／觸控筆 hover 顯示；觸控長壓顯示、手指放開即關；鍵盤 Tab 聚焦（:focus-visible）亦顯示（a11y），點擊不觸發。
    浮層自行找空間：偏好上方，上方不夠而下方較寬就翻到下方；水平以觸發元素置中，再夾進視窗內。
  -->
  <div
    ref="triggerRef"
    :class="[block ? 'block min-w-0' : 'inline-block', { 'touch-none select-none': isPressing }]"
    :aria-describedby="open ? tooltipId : undefined"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
    @pointerdown="onPointerDown"
    @pointerup="endPress"
    @pointercancel="endPress"
    @pointermove="onPointerMove"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
    @contextmenu="onContextMenu"
  >
    <slot />

    <!-- 在 <dialog> 內時需 teleport 進該 dialog，否則會被 top layer 壓住（見 useCamelotTeleportTarget） -->
    <Teleport :to="teleportTarget">
      <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0 scale-95"
        leave-active-class="transition duration-100 ease-in"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="open"
          :id="tooltipId"
          ref="tipRef"
          role="tooltip"
          data-camelot-popup
          class="pointer-events-none fixed max-w-[280px] px-3 py-1.5 text-xs leading-relaxed whitespace-pre-line"
          :class="[themeClass, resolvedPlacement === 'top' ? 'origin-bottom' : 'origin-top']"
          :style="{
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            zIndex: zIndex ?? 'var(--cml-z-popup)',
            visibility: positioned ? 'visible' : 'hidden',
          }"
        >
          <slot name="content">
            {{ content }}
          </slot>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** 純文字內容；需要富內容改用 #content slot */
    content?: string
    /** 偏好位置；auto = 偏好上方，空間不足時翻到下方 */
    placement?: 'auto' | 'top' | 'bottom'
    /** hover 開啟延遲（ms） */
    openDelay?: number
    /** 觸控長壓多久顯示（ms） */
    longPressDuration?: number
    /** 與觸發元素的距離（px） */
    offset?: number
    disabled?: boolean
    zIndex?: number
    /** 觸發器以 block 排版（預設 inline-block），供需要撐滿寬度、內含 truncate 文字的情境 */
    block?: boolean
    /** 只在觸發器內的文字被截斷（scrollWidth > clientWidth）時才顯示，用於 truncate 文字的完整內容提示 */
    onlyWhenTruncated?: boolean
  }>(),
  {
    content: '',
    placement: 'auto',
    openDelay: 150,
    longPressDuration: 500,
    offset: 6,
    disabled: false,
    block: false,
    onlyWhenTruncated: false,
  },
)

const { themeMode } = useCamelotTheme()

const open = ref(false)
const tooltipId = useId()
const triggerRef = useTemplateRef<HTMLElement>('triggerRef')
const tipRef = useTemplateRef<HTMLElement>('tipRef')

const { teleportTarget } = useCamelotTeleportTarget(triggerRef)

const themeClass = computed(() => {
  switch (themeMode.value) {
    case 'aqua':
      return 'aqua-glass rounded-aqua-control text-on-surface'
    case 'cupertino':
      return 'rounded-[10px] border border-white/20 bg-slate-800/90 text-white shadow-lg backdrop-blur-xl dark:border-black/20 dark:bg-slate-100/90 dark:text-slate-900'
    case 'scifi':
      return 'rounded-none border border-[color-mix(in_srgb,var(--cml-color-current-color,var(--color-primary))_45%,transparent)] bg-surface-container-lowest font-mono text-on-surface shadow-[0_0_10px_color-mix(in_srgb,var(--cml-color-current-color,var(--color-primary))_30%,transparent)]'
    default:
      return 'rounded-md bg-inverse-surface text-inverse-on-surface shadow-md'
  }
})

// ── 定位：開啟期間每幀重算（觸發元素可能因捲動、動畫、版面重排而位移，無單一事件可攔） ──
const VIEWPORT_MARGIN = 8
const pos = ref({
  x: 0,
  y: 0,
})
const resolvedPlacement = ref<'top' | 'bottom'>('top')
const positioned = ref(false)
let rafId: number | null = null

const updatePosition = () => {
  const trigger = triggerRef.value
  const tip = tipRef.value
  if (!trigger || !tip) return

  const t = trigger.getBoundingClientRect()
  const tipW = tip.offsetWidth
  const tipH = tip.offsetHeight
  // 行動裝置鍵盤彈出時 visualViewport 才是真正看得到的範圍
  const vv = window.visualViewport
  const vx = vv?.offsetLeft ?? 0
  const vy = vv?.offsetTop ?? 0
  const vw = vv?.width ?? window.innerWidth
  const vh = vv?.height ?? window.innerHeight

  const spaceAbove = t.top - vy - VIEWPORT_MARGIN
  const spaceBelow = vy + vh - t.bottom - VIEWPORT_MARGIN
  let placement: 'top' | 'bottom'
  if (props.placement === 'top' || props.placement === 'bottom') {
    placement = props.placement
  }
  else {
    placement = spaceAbove >= tipH + props.offset || spaceAbove >= spaceBelow ? 'top' : 'bottom'
  }
  resolvedPlacement.value = placement

  const rawY = placement === 'top' ? t.top - props.offset - tipH : t.bottom + props.offset
  const rawX = t.left + t.width / 2 - tipW / 2
  pos.value = {
    x: Math.min(Math.max(rawX, vx + VIEWPORT_MARGIN), vx + vw - tipW - VIEWPORT_MARGIN),
    y: Math.min(Math.max(rawY, vy + VIEWPORT_MARGIN), vy + vh - tipH - VIEWPORT_MARGIN),
  }
  positioned.value = true
}

const startTracking = () => {
  const tick = () => {
    updatePosition()
    rafId = requestAnimationFrame(tick)
  }
  tick()
}

const stopTracking = () => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  positioned.value = false
}

watch(open, (isOpen) => {
  if (isOpen) {
    nextTick(startTracking)
  }
  else {
    stopTracking()
  }
})

// ── 觸發邏輯 ──
// onlyWhenTruncated：檢查觸發器（或其第一個子元素）的文字是否被截斷；每次開啟前才量，內容變動不需額外監聽
const canOpen = () => {
  if (props.disabled) return false
  if (!props.onlyWhenTruncated) return true
  const el = triggerRef.value
  if (!el) return false
  const candidates = [el, ...Array.from(el.children)] as HTMLElement[]
  // 只看水平截斷（truncate／line-clamp 的溢出方向）；留 1px 容差避免 subpixel 誤判
  return candidates.some(c => c.scrollWidth - c.clientWidth > 1)
}

let hoverTimer: ReturnType<typeof setTimeout> | null = null
let pressTimer: ReturnType<typeof setTimeout> | null = null
const isPressing = ref(false)
let pressStartX = 0
let pressStartY = 0
const PRESS_MOVE_TOLERANCE = 10

const clearHover = () => {
  if (hoverTimer) {
    clearTimeout(hoverTimer)
    hoverTimer = null
  }
}

const clearPress = () => {
  if (pressTimer) {
    clearTimeout(pressTimer)
    pressTimer = null
  }
}

// 滑鼠／觸控筆：hover
const onPointerEnter = (e: PointerEvent) => {
  if (e.pointerType === 'touch' || !canOpen()) return
  clearHover()
  hoverTimer = setTimeout(() => {
    open.value = true
    hoverTimer = null
  }, props.openDelay)
}

const onPointerLeave = (e: PointerEvent) => {
  if (e.pointerType === 'touch') {
    endPress()
    return
  }
  clearHover()
  open.value = false
}

// 觸控：長壓顯示、放開即關
const onPointerDown = (e: PointerEvent) => {
  if (e.pointerType !== 'touch' || !e.isPrimary || !canOpen()) return
  clearPress()
  isPressing.value = true
  pressStartX = e.clientX
  pressStartY = e.clientY
  pressTimer = setTimeout(() => {
    open.value = true
    pressTimer = null
  }, props.longPressDuration)
}

const onPointerMove = (e: PointerEvent) => {
  if (!isPressing.value || e.pointerType !== 'touch') return
  // 手指滑開（多半是想捲動）就取消長壓
  if (Math.abs(e.clientX - pressStartX) > PRESS_MOVE_TOLERANCE
    || Math.abs(e.clientY - pressStartY) > PRESS_MOVE_TOLERANCE) {
    endPress()
  }
}

const endPress = () => {
  if (!isPressing.value) return
  clearPress()
  isPressing.value = false
  open.value = false
}

// 長壓期間抑制系統長壓選單（iOS 連結預覽、Android 文字選取）
const onContextMenu = (e: Event) => {
  if (isPressing.value) {
    e.preventDefault()
  }
}

// 鍵盤：只認 :focus-visible（Tab 進來），滑鼠點擊／觸控輕點造成的 focus 不開，
// 否則 tooltip 會變成「點一下就出現」而非 hover／長壓
const onFocusIn = (e: FocusEvent) => {
  if (!canOpen()) return
  const target = e.target as Element | null
  if (!target?.matches(':focus-visible')) return
  open.value = true
}

const onFocusOut = () => {
  open.value = false
}

watch(() => props.disabled, (disabled) => {
  if (disabled) {
    clearHover()
    endPress()
    open.value = false
  }
})

onBeforeUnmount(() => {
  clearHover()
  clearPress()
  stopTracking()
})
</script>

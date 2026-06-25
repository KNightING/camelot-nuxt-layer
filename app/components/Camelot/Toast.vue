<template>
  <ClientOnly>
    <Teleport to="body">
      <div
        v-for="pos in positions"
        :key="pos"
        class="fixed flex flex-col gap-2 p-4 pointer-events-none"
        :class="positionClass(pos)"
        :style="{ zIndex }"
      >
        <TransitionGroup
          :css="false"
          @enter="onEnter"
          @leave="onLeave"
        >
          <div
            v-for="t in toastsByPosition(pos)"
            :key="t.id"
            class="pointer-events-auto"
            :class="roleClass(t)"
          >
            <slot
              :toast="t"
              :type="t.type ?? 'info'"
              :color="t.color ?? (t.type === 'success' ? 'success' : t.type === 'error' ? 'error' : t.type === 'warning' ? 'warning' : 'primary')"
            >
              <div
                class="cml-toast-box relative isolate flex items-start gap-3 min-w-[240px] max-w-[400px] overflow-hidden px-4 py-3 text-sm"
                :class="boxClass"
              >
                <!-- 狀態色底色（玻璃上疊一層 current-color，讓狀態更明顯） -->
                <span
                  class="pointer-events-none absolute inset-0 -z-[1] bg-[color-mix(in_srgb,var(--cml-color-current-color)_16%,transparent)]"
                />
                <!-- 狀態圓點 -->
                <span
                  class="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--cml-color-current-color)]"
                  :class="themeMode === 'scifi' ? 'shadow-[0_0_6px_var(--cml-color-current-color)]' : ''"
                />
                <div class="flex-1">
                  <div
                    v-if="t.title"
                    class="font-semibold text-[var(--cml-color-current-color)]"
                  >
                    {{ t.title }}
                  </div>
                  <div :class="t.title ? 'text-on-surface-variant' : 'text-on-surface'">
                    {{ t.message }}
                  </div>
                </div>
                <slot
                  name="action"
                  :toast="t"
                  :run="() => onAction(t)"
                  :close="() => removeToast(t.id)"
                >
                  <button
                    v-if="t.action"
                    type="button"
                    class="shrink-0 text-sm font-semibold text-[var(--cml-color-current-color)] hover:opacity-80"
                    @click="onAction(t)"
                  >
                    {{ t.action.label }}
                  </button>
                </slot>
                <button
                  type="button"
                  class="shrink-0 text-on-surface-variant hover:text-on-surface"
                  aria-label="close"
                  @click="removeToast(t.id)"
                >
                  <IMaterialSymbolsCloseRounded class="h-4 w-4" />
                </button>
              </div>
            </slot>
          </div>
        </TransitionGroup>
      </div>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
import IMaterialSymbolsCloseRounded from '~icons/material-symbols/close-rounded'

withDefaults(defineProps<{ zIndex?: number }>(), { zIndex: 1000 })

const {
  toasts, removeToast,
} = useCamelotToast()
const { themeMode } = useCamelotTheme()

const positions: CamelotToastPosition[] = [
  'top', 'bottom', 'left', 'right', 'center',
  'top-left', 'top-right', 'bottom-left', 'bottom-right',
]

const toastsByPosition = (pos: CamelotToastPosition) =>
  toasts.value.filter(t => (t.position ?? 'bottom') === pos)

// 顏色角色：優先用 toast.color；否則由 type 對應狀態色（info / 未設 → primary，避免未定義色）
const roleClass = (t: CamelotToast) => {
  const role: CamelotColorRole = t.color
    ?? (t.type === 'success' ? 'success' : t.type === 'error' ? 'error' : t.type === 'warning' ? 'warning' : 'primary')
  return ROLE_COLOR_MAP[role]
}

const ROLE_COLOR_MAP: Record<CamelotColorRole, string> = {
  primary: '[--cml-color-current-color:var(--color-primary)] [--cml-color-current-on-color:var(--color-on-primary)]',
  secondary: '[--cml-color-current-color:var(--color-secondary)] [--cml-color-current-on-color:var(--color-on-secondary)]',
  tertiary: '[--cml-color-current-color:var(--color-tertiary)] [--cml-color-current-on-color:var(--color-on-tertiary)]',
  error: '[--cml-color-current-color:var(--color-error)] [--cml-color-current-on-color:var(--color-on-error)]',
  info: '[--cml-color-current-color:var(--color-info)] [--cml-color-current-on-color:var(--color-on-info)]',
  warning: '[--cml-color-current-color:var(--color-warning)] [--cml-color-current-on-color:var(--color-on-warning)]',
  success: '[--cml-color-current-color:var(--color-success)] [--cml-color-current-on-color:var(--color-on-success)]',
}

const boxClass = computed(() => {
  switch (themeMode.value) {
    case 'aqua':
      return 'aqua-glass bg-[color-mix(in_srgb,var(--color-surface)_55%,transparent)]! rounded-2xl shadow-[0_8px_30px_-8px_rgba(0,0,0,0.3)] border-l-4 border-[var(--cml-color-current-color)]'
    case 'scifi':
      return 'rounded-none bg-slate-950/95 border border-[color-mix(in_srgb,var(--cml-color-current-color)_45%,transparent)] border-l-4 border-l-[var(--cml-color-current-color)] font-mono shadow-[0_0_16px_color-mix(in_srgb,var(--cml-color-current-color)_25%,transparent)]'
    case 'cupertino':
      return 'rounded-[14px] bg-surface-container-high/90 backdrop-blur-xl border border-outline-variant shadow-xl border-l-4 border-l-[var(--cml-color-current-color)]'
    default:
      return 'rounded-lg bg-surface-container-high shadow-lg border-l-4 border-[var(--cml-color-current-color)]'
  }
})

const positionClass = (pos: CamelotToastPosition) => {
  switch (pos) {
    case 'top':
      return 'top-0 left-1/2 -translate-x-1/2 items-center'
    case 'bottom':
      return 'bottom-0 left-1/2 -translate-x-1/2 items-center flex-col-reverse'
    case 'left':
      return 'top-1/2 left-0 -translate-y-1/2 items-start'
    case 'right':
      return 'top-1/2 right-0 -translate-y-1/2 items-end'
    case 'center':
      // 垂直不用 -translate-y-1/2（會在堆疊變高時瞬間重新置中＝跳動）；
      // 改由中心往下堆疊：頂端錨在中央，新增不位移既有通知。
      return 'top-1/2 left-1/2 -translate-x-1/2 items-center'
    case 'top-left':
      return 'top-0 left-0 items-start'
    case 'top-right':
      return 'top-0 right-0 items-end'
    case 'bottom-left':
      return 'bottom-0 left-0 items-start flex-col-reverse'
    case 'bottom-right':
      return 'bottom-0 right-0 items-end flex-col-reverse'
    default:
      return ''
  }
}

const onAction = (t: CamelotToast) => {
  t.action?.handler?.()
  removeToast(t.id)
}

// 入場/退場動畫（JS hooks）：
// 用 transform 做滑入+淡入（GPU 流暢），但 transform 期間 backdrop-filter 會失效，
// 故滑入結束、transform 移除後，再把毛玻璃模糊 0→目標值「漸入」，避免玻璃在結尾瞬間閃出。
const SLIDE_PX = 10

// 各主題玻璃的目標 backdrop-filter；非玻璃主題回傳 null（不做漸入）
const glassTarget = (): string | null => {
  switch (themeMode.value) {
    case 'aqua':
      return 'blur(20px) saturate(180%)'
    case 'cupertino':
      return 'blur(24px)'
    default:
      return null
  }
}

const setBackdrop = (box: HTMLElement, v: string) => {
  box.style.backdropFilter = v
  box.style.setProperty('-webkit-backdrop-filter', v)
}
const clearBackdrop = (box: HTMLElement) => {
  box.style.transition = ''
  box.style.backdropFilter = ''
  box.style.removeProperty('-webkit-backdrop-filter')
}

const onEnter = (el: Element, done: () => void) => {
  const wrap = el as HTMLElement
  const box = wrap.querySelector('.cml-toast-box') as HTMLElement | null
  const target = glassTarget()

  wrap.style.opacity = '0'
  wrap.style.transform = `translateY(${SLIDE_PX}px) scale(0.97)`
  if (box && target) setBackdrop(box, target.replace(/blur\([^)]*\)/, 'blur(0px)'))
  void wrap.offsetWidth // reflow

  wrap.style.transition = 'opacity 0.3s ease, transform 0.3s ease'
  wrap.style.opacity = '1'
  wrap.style.transform = 'translateY(0px) scale(1)'

  let slid = false
  const afterSlide = () => {
    wrap.style.transition = ''
    wrap.style.transform = 'none' // identity→none：讓 backdrop-filter 重新生效
    if (!box || !target) {
      done()
      return
    }
    void box.offsetWidth
    box.style.transition = 'backdrop-filter 0.25s ease, -webkit-backdrop-filter 0.25s ease'
    setBackdrop(box, target)
    let ramped = false
    const finish = () => {
      if (ramped) return
      ramped = true
      clearBackdrop(box)
      done()
    }
    const onRamp = (e: TransitionEvent) => {
      if (e.target !== box) return
      box.removeEventListener('transitionend', onRamp)
      finish()
    }
    box.addEventListener('transitionend', onRamp)
    setTimeout(finish, 320)
  }
  const onSlide = (e: TransitionEvent) => {
    if (e.target !== wrap || e.propertyName !== 'transform') return
    wrap.removeEventListener('transitionend', onSlide)
    if (!slid) {
      slid = true
      afterSlide()
    }
  }
  wrap.addEventListener('transitionend', onSlide)
  setTimeout(() => {
    if (!slid) {
      slid = true
      wrap.removeEventListener('transitionend', onSlide)
      afterSlide()
    }
  }, 380)
}

const onLeave = (el: Element, done: () => void) => {
  const wrap = el as HTMLElement
  // 抽離流外，避免離場時其餘通知瞬間補位
  wrap.style.position = 'absolute'
  wrap.style.width = `${wrap.offsetWidth}px`
  void wrap.offsetWidth
  wrap.style.transition = 'opacity 0.28s ease, transform 0.28s ease'
  wrap.style.opacity = '0'
  wrap.style.transform = `translateY(${SLIDE_PX}px) scale(0.97)`
  let ended = false
  const fin = () => {
    if (ended) return
    ended = true
    done()
  }
  const onEnd = (e: TransitionEvent) => {
    if (e.target !== wrap) return
    wrap.removeEventListener('transitionend', onEnd)
    fin()
  }
  wrap.addEventListener('transitionend', onEnd)
  setTimeout(fin, 340)
}
</script>

<style scoped>
/* 入場/退場動畫改由 TransitionGroup 的 JS hooks 控制（onEnter/onLeave）：
   滑入+淡入後再漸入毛玻璃，避免 transform 期間 backdrop-filter 失效造成的閃現。 */
</style>

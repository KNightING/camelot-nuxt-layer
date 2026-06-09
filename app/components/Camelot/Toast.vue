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
        <TransitionGroup name="cml-toast">
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
      return 'aqua-glass rounded-2xl shadow-[0_8px_30px_-8px_rgba(0,0,0,0.3)] border-l-4 border-[var(--cml-color-current-color)]'
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
      return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center'
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
</script>

<style scoped>
/* 入場/退場只動 opacity：避免 transform 中斷玻璃盒的 backdrop-filter，
   造成毛玻璃在動畫結束後才「閃」出來 */
.cml-toast-enter-active,
.cml-toast-leave-active {
  transition: opacity 0.3s ease;
}
.cml-toast-enter-from,
.cml-toast-leave-to {
  opacity: 0;
}
.cml-toast-leave-active {
  position: absolute;
}
</style>

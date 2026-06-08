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
            :class="roleClass(t.type)"
          >
            <slot :toast="t">
              <div
                class="cml-toast-box flex items-start gap-3 min-w-[240px] max-w-[400px] px-4 py-3 text-sm"
                :class="boxClass"
              >
                <div class="flex-1">
                  <div
                    v-if="t.title"
                    class="font-semibold text-on-surface"
                  >
                    {{ t.title }}
                  </div>
                  <div :class="t.title ? 'text-on-surface-variant' : 'text-on-surface'">
                    {{ t.message }}
                  </div>
                </div>
                <button
                  v-if="t.action"
                  type="button"
                  class="shrink-0 text-sm font-semibold text-[var(--cml-color-current-color)] hover:opacity-80"
                  @click="onAction(t)"
                >
                  {{ t.action.label }}
                </button>
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

// 顏色角色：依 type 對應
const roleClass = (type?: CamelotToastType) => {
  const role = type === 'success'
    ? 'success'
    : type === 'error'
      ? 'error'
      : type === 'warning' ? 'warning' : 'info'
  return `[--cml-color-current-color:var(--color-${role})] [--cml-color-current-on-color:var(--color-on-${role})]`
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
.cml-toast-enter-active,
.cml-toast-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.cml-toast-enter-from,
.cml-toast-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.97);
}
.cml-toast-leave-active {
  position: absolute;
}
</style>

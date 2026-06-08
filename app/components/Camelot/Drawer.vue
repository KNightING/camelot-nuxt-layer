<template>
  <!-- Floating（浮動）：Teleport + 遮罩 + 滑入 -->
  <Teleport
    v-if="variant === 'floating'"
    to="body"
  >
    <div
      class="fixed inset-0"
      :class="{ 'pointer-events-none': !open }"
      :style="{ zIndex: zIndex }"
    >
      <Transition name="cml-drawer-scrim">
        <div
          v-if="open"
          class="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          @click="onMaskClick"
        />
      </Transition>

      <Transition :name="position === 'left' ? 'cml-drawer-left' : 'cml-drawer-right'">
        <aside
          v-if="open"
          class="absolute top-0 bottom-0 flex max-w-[90vw] flex-col text-on-surface"
          :class="[position === 'left' ? 'left-0' : 'right-0', panelClass]"
          :style="{ width: width }"
        >
          <slot name="header" />
          <div class="min-h-0 flex-1 overflow-auto">
            <slot />
          </div>
          <slot name="footer" />
        </aside>
      </Transition>
    </div>
  </Teleport>

  <!-- Fixed（固定/常駐）：行內佔位，寬度展開/收合 -->
  <div
    v-else
    class="flex h-full shrink-0 overflow-hidden transition-[width] duration-300 ease-spring motion-reduce:transition-none"
    :class="{ 'justify-end': position === 'right' }"
    :style="{ width: open ? width : '0px' }"
  >
    <aside
      class="flex h-full flex-col text-on-surface"
      :class="panelClass"
      :style="{ width: width }"
    >
      <slot name="header" />
      <div class="min-h-0 flex-1 overflow-auto">
        <slot />
      </div>
      <slot name="footer" />
    </aside>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    position?: 'left' | 'right'
    variant?: 'floating' | 'fixed'
    width?: string
    closeByMask?: boolean
    zIndex?: number
  }>(),
  {
    position: 'left',
    variant: 'floating',
    width: '320px',
    closeByMask: true,
    zIndex: 50,
  },
)

const emit = defineEmits<{
  close: []
}>()

const open = defineModel<boolean>('open', { default: false })

const { themeMode } = useCamelotTheme()

const panelClass = computed(() => {
  switch (themeMode.value) {
    case 'aqua':
      // 無邊框玻璃：半透明 + 模糊 + 柔影（不用 aqua-glass，避免其髮絲邊框）
      return 'bg-surface/75 shadow-2xl backdrop-blur-xl backdrop-saturate-150'
    case 'scifi':
      return 'bg-surface shadow-[0_0_24px_color-mix(in_srgb,var(--color-primary)_18%,transparent)]'
    case 'cupertino':
      return 'bg-surface shadow-2xl'
    default:
      return 'bg-surface-container-low shadow-2xl'
  }
})

const onMaskClick = () => {
  if (props.closeByMask) {
    open.value = false
    emit('close')
  }
}

// floating + 開啟時：鎖定 body 捲動
watch(
  () => props.variant === 'floating' && open.value,
  (locked) => {
    if (typeof document === 'undefined') return
    document.body.style.overflow = locked ? 'hidden' : ''
  },
)

// Esc 關閉（floating）
useEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.variant === 'floating' && open.value && props.closeByMask) {
    open.value = false
    emit('close')
  }
})

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.cml-drawer-scrim-enter-active,
.cml-drawer-scrim-leave-active {
  transition: opacity 0.3s ease;
}
.cml-drawer-scrim-enter-from,
.cml-drawer-scrim-leave-to {
  opacity: 0;
}

.cml-drawer-left-enter-active,
.cml-drawer-left-leave-active,
.cml-drawer-right-enter-active,
.cml-drawer-right-leave-active {
  transition: transform 0.35s cubic-bezier(0.34, 1.2, 0.64, 1);
}
.cml-drawer-left-enter-from,
.cml-drawer-left-leave-to {
  transform: translateX(-100%);
}
.cml-drawer-right-enter-from,
.cml-drawer-right-leave-to {
  transform: translateX(100%);
}

@media (prefers-reduced-motion: reduce) {
  .cml-drawer-scrim-enter-active,
  .cml-drawer-scrim-leave-active,
  .cml-drawer-left-enter-active,
  .cml-drawer-left-leave-active,
  .cml-drawer-right-enter-active,
  .cml-drawer-right-leave-active {
    transition: none;
  }
}
</style>

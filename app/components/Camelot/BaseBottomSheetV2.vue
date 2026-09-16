<template>
  <!-- 其餘 props（closeByMask / tag / zIndex / query）與 cancel 事件經 attrs 落到 BaseDialogV2 -->
  <CamelotBaseDialogV2
    v-model:open="open"
    :backdrop-progress="dragProgress"
    :backdrop-immediate="isDragging"
  >
    <template #wrapper>
      <div
        class="wrapper"
        :class="[themeMode]"
      >
        <!-- 拖曳位移放在 .wrapper 之內：.wrapper 的 slide-up 動畫以 forwards 填充，
             其 transform 會蓋過同元素的 inline transform，故另包一層承接跟手位移 -->
        <div
          ref="dragEl"
          class="sheet-drag flex w-full justify-center"
          :class="{ 'is-dragging': isDragging }"
          :style="{ transform: `translateY(${dragOffset}px)` }"
        >
          <!-- Sci-fi Layout -->
          <CamelotScifiFrame
            v-if="themeMode === 'scifi'"
            variant="2-corner"
            focused
            :show-grid="false"
            class="w-full max-h-[85vh] text-primary"
          >
            <div class="p-4 bg-slate-950/90 overflow-auto">
              <CamelotInternalSheetHandle
                class="mb-2"
                @pointerdown="onHandlePointerDown"
              />
              <slot />
            </div>
          </CamelotScifiFrame>

          <!-- Cupertino Layout -->
          <div
            v-else-if="themeMode === 'cupertino'"
            class="sheet-container cupertino-sheet w-full max-h-[85vh] rounded-t-[20px] bg-slate-100/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-white/20 dark:border-black/20 p-4 shadow-2xl overflow-auto"
          >
            <CamelotInternalSheetHandle
              class="mb-2"
              @pointerdown="onHandlePointerDown"
            />
            <slot />
          </div>

          <!-- Aqua Frosted Glass Layout -->
          <div
            v-else-if="themeMode === 'aqua'"
            class="sheet-container aqua-sheet aqua-glass text-on-surface max-h-[85vh] w-full overflow-auto rounded-t-3xl p-4"
          >
            <CamelotInternalSheetHandle
              class="mb-2"
              @pointerdown="onHandlePointerDown"
            />
            <slot />
          </div>

          <!-- Material Layout (Default) -->
          <div
            v-else
            class="sheet-container material-sheet w-full max-h-[85vh] rounded-t-[28px] bg-surface-container-low p-4 shadow-2xl overflow-auto border-t border-outline-variant/10"
          >
            <CamelotInternalSheetHandle
              class="mb-2"
              @pointerdown="onHandlePointerDown"
            />
            <slot />
          </div>
        </div>
      </div>
    </template>
  </CamelotBaseDialogV2>
</template>

<script setup lang="ts">
const { themeMode } = useCamelotTheme()

const props = withDefaults(
  defineProps<{
    /** 是否允許從頂部把手拖曳關閉 */
    draggable?: boolean
    /** 拖曳超過面板高度的多少比例即關閉（0–1） */
    dismissThreshold?: number
  }>(),
  {
    draggable: true,
    dismissThreshold: 0.35,
  },
)

const open = defineModel<boolean>('open', { default: false })

const dragEl = useTemplateRef<HTMLElement>('dragEl')

// ── 手勢拖曳關閉 ──
// 只從把手起手（把手 pointerdown），面板跟手位移；只允許向下——向上位移會讓面板
// 底下露出空白，故夾在 0。放開時超過門檻或釋放速度夠快即關閉，否則以 ease-spring 彈回。
const isDragging = ref(false)
const dragOffset = ref(0)
const sheetHeight = ref(0)
const dragProgress = computed(() => {
  const h = sheetHeight.value
  return h > 0 ? Math.min(Math.max(dragOffset.value / h, 0), 1) : 0
})

let startY = 0
let lastY = 0
let lastTime = 0
let velocity = 0 // px/ms，向下為正
const FLICK_VELOCITY = 0.6
const FLICK_MIN_DISTANCE = 32

const onHandlePointerDown = (e: PointerEvent) => {
  if (!props.draggable || !e.isPrimary || e.button !== 0) return
  const handle = e.currentTarget as HTMLElement
  sheetHeight.value = dragEl.value?.offsetHeight ?? 0
  startY = lastY = e.clientY
  lastTime = e.timeStamp
  velocity = 0
  isDragging.value = true
  handle.setPointerCapture(e.pointerId)
  handle.addEventListener('pointermove', onHandlePointerMove)
  handle.addEventListener('pointerup', onHandlePointerUp)
  handle.addEventListener('pointercancel', onHandlePointerUp)
  e.preventDefault()
}

const onHandlePointerMove = (e: PointerEvent) => {
  const dy = e.clientY - startY
  dragOffset.value = Math.max(dy, 0)
  const dt = e.timeStamp - lastTime
  if (dt > 0) {
    velocity = (e.clientY - lastY) / dt
  }
  lastY = e.clientY
  lastTime = e.timeStamp
}

const onHandlePointerUp = (e: PointerEvent) => {
  const handle = e.currentTarget as HTMLElement
  handle.removeEventListener('pointermove', onHandlePointerMove)
  handle.removeEventListener('pointerup', onHandlePointerUp)
  handle.removeEventListener('pointercancel', onHandlePointerUp)
  if (handle.hasPointerCapture(e.pointerId)) {
    handle.releasePointerCapture(e.pointerId)
  }
  isDragging.value = false

  // 停住一段時間才放開，就不算甩動：速度只採計最後 100ms 內的移動
  if (e.timeStamp - lastTime > 100) {
    velocity = 0
  }
  // 甩動關閉另設最小距離，避免把手上的輕點抖動被當成甩動
  const shouldDismiss = dragOffset.value > 0
    && (dragProgress.value >= props.dismissThreshold
      || (velocity >= FLICK_VELOCITY && dragOffset.value >= FLICK_MIN_DISTANCE))
  if (shouldDismiss) {
    // 保留當前位移，讓面板由此處接續 dialog 的 leave transition 滑出
    open.value = false
  }
  else {
    dragOffset.value = 0
  }
}

// 下次開啟從 0 起
watch(open, (isOpen) => {
  if (isOpen) {
    dragOffset.value = 0
  }
})
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.4s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(100vh);
}

dialog {
  position: fixed;
  height: 100vh;
  pointer-events: painted;
  background-color: transparent;
  margin: 0;
  padding: 0;
  width: 100vw;
  max-width: 100vw;
}

.wrapper {
  position: fixed;
  bottom: 0px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: var(--cml-z-sheet);
  animation: slide-up 0.35s cubic-bezier(0.32, 0.94, 0.6, 1) forwards;
}

/* 彈回用 spring；拖曳中關閉 transition 才能逐幀跟手 */
.sheet-drag {
  transition: transform 0.35s var(--ease-spring);
  will-change: transform;
}

.sheet-drag.is-dragging {
  transition: none;
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
</style>

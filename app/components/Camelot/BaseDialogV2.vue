<template>
  <Transition>
    <dialog
      v-if="open"
      :id="tag"
      ref="dialog"
      :style="[
        `z-index:${zIndex};`,
      ]"
      class="camelot-dialog outline-none overflow-hidden transform-gpu bg-transparent"
      :class="[themeMode]"
      @pointerup="onDialogClick"
      @keydown.esc="onEsc"
    >
      <slot name="wrapper">
        <div class="w-screen min-h-screen flex items-center justify-center p-4">
          <!-- Sci-fi Layout -->
          <CamelotScifiFrame
            v-if="themeMode === 'scifi'"
            variant="4-corner"
            focused
            show-pulse
            class="dialog-content-box max-w-[95vw] max-h-[90vh] text-primary"
          >
            <div class="p-6 bg-slate-950/90 min-w-[280px] overflow-auto max-h-[85vh]">
              <slot />
            </div>
          </CamelotScifiFrame>

          <!-- Cupertino Layout -->
          <div
            v-else-if="themeMode === 'cupertino'"
            class="dialog-content-box cupertino-dialog min-w-[270px] max-w-[340px] rounded-[14px] bg-slate-100/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-black/20 p-5 shadow-2xl text-center flex flex-col"
          >
            <slot />
          </div>

          <!-- Aqua Frosted Glass Layout -->
          <div
            v-else-if="themeMode === 'aqua'"
            class="dialog-content-box aqua-glass text-on-surface flex min-w-[280px] max-w-[560px] flex-col rounded-3xl p-6"
          >
            <slot />
          </div>

          <!-- Material Layout (Default) -->
          <div
            v-else
            class="dialog-content-box material-dialog min-w-[280px] max-w-[560px] rounded-[28px] bg-surface-container-high p-6 shadow-2xl flex flex-col border border-outline-variant/10"
          >
            <slot />
          </div>
        </div>
      </slot>
    </dialog>
  </Transition>
</template>

<script setup lang="ts">
const { themeMode } = useCamelotTheme()
const props = withDefaults(
  defineProps<{
    closeByMask?: boolean
    tag?: string
    zIndex?: number
    query?: {
      key: string
      value: string
    }
  }>(),
  {
    closeByMask: true,
  },
)

const emits = defineEmits<{
  cancel: []
}>()

const open = defineModel<boolean>('open', { default: false })

const dialogRef = useTemplateRef('dialog')

const onDialogClick = (e: PointerEvent) => {
  if (!props.closeByMask) return
  const target = e.target as Node | null
  // 預設 wrapper 以全螢幕容器置中內容，點空白處的 target 會是該容器（非 <dialog> 本身），
  // 故改判斷「點在 .dialog-content-box 之外」即關閉；自訂 wrapper（無 content box）則沿用 e.target===dialog。
  const contentBox = dialogRef.value?.querySelector('.dialog-content-box') ?? null
  const clickedOutsideContent = contentBox
    ? !!target && !contentBox.contains(target)
    : target === dialogRef.value
  if (clickedOutsideContent) {
    open.value = false
    emits('cancel')
  }
}

const router = useRouter()
const route = useRoute()

const dialogQueryOptions = computed(() => {
  if (props.query) {
    return props.query
  }
  if (props.tag) {
    return {
      key: 'tag',
      value: props.tag,
    }
  }
  return undefined
})

watch([dialogRef, open], ([dialogEl, open]) => {
  if (!dialogEl) {
    return
  }

  if (open) {
    // showModal才會有背景遮罩
    dialogEl.showModal()
  }
  else {
    setTimeout(() => {
      dialogEl.close()
    }, 400)
  }
})

watch(open, (isOpen) => {
  const queryOptions = dialogQueryOptions.value
  if (!queryOptions) {
    return
  }

  if (isOpen) {
    const newQuery = {
      ...route.query,
      [queryOptions.key]: queryOptions.value,
      isDialog: 'true',
    }
    router.push({
      query: newQuery,
    })
    return
  }

  if (route.query[queryOptions.key] === queryOptions.value) {
    if (useCamelotRouter().canBack()) {
      router.back()
    }
    else {
      const newQuery = {
        ...route.query,
      }
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete newQuery[queryOptions.key]
      delete newQuery.isDialog
      router.replace({ query: newQuery })
    }
  }
})

watch([() => route.path, () => route.query], ([path, query]) => {
  const queryOptions = dialogQueryOptions.value
  if (!queryOptions) {
    return
  }
  if (query[queryOptions.key] === queryOptions.value) {
    open.value = true
  }
  else {
    open.value = false
  }
}, { immediate: true })

const onEsc = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    if (props.closeByMask) {
      open.value = false
      emits('cancel')
    }
    event.preventDefault()
  }
}
</script>

<style scoped>
:global(body:has(dialog[open].camelot-dialog)) {
  overflow: hidden;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.4s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.v-enter-active::backdrop ,
.v-leave-active::backdrop  {
  transition: opacity 0.4s ease;
}

.v-enter-from::backdrop ,
.v-leave-to::backdrop  {
  opacity: 0;
}

dialog {
  max-width: 100dvw;
  max-height: 100vh;
  max-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: painted;
  background-color: transparent;
}

/* 全屏背景遮罩 */
dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.5); /* 兜底：在不支援 color-mix 的極舊版本顯示純黑半透 */
  background-color: color-mix(in srgb, var(--cml-c-mask-color, #000) 50%, transparent); /* 較佳相容性的做法 */
  transition: all 0.4s ease;
}

.camelot-dialog.cupertino::backdrop {
  backdrop-filter: blur(12px);
  background-color: rgba(0, 0, 0, 0.3);
}

.camelot-dialog.aqua::backdrop {
  backdrop-filter: blur(8px);
  background-color: color-mix(in srgb, var(--cml-c-mask-color, #000) 35%, transparent);
}

.camelot-dialog.scifi::backdrop {
  background-color: color-mix(in srgb, var(--cml-color-current-color, var(--color-primary, #00ffff)) 8%, rgba(0, 0, 0, 0.75));
  backdrop-filter: blur(3px);
}

.dialog-content-box {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: zoom-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes zoom-in {
  from {
    opacity: 0;
    transform: scale(0.92);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>

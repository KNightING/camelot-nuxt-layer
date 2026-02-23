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
      @pointerup="onDialogClick"
      @keydown.esc="onEsc"
    >
      <slot name="wrapper">
        <div class="w-screen min-h-screen flex items-center justify-center">
          <slot />
        </div>
      </slot>
    </dialog>
  </Transition>
</template>

<script setup lang="ts">
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
  if (props.closeByMask && e.target === dialogRef.value) {
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
  max-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: painted;
  background-color: transparent;
}

/* 全屏背景遮罩 */
dialog::backdrop {
  background-color: rgba(from var(--cml-c-mask-color) r g b / .5); /* 深一点的背景，可调整透明度 */
}
</style>

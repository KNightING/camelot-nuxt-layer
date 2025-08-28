<template>
  <Teleport to="body">
    <CamelotCustomColorSchemeProvider>
      <Transition>
        <div
          v-if="open"
          :id="tag"
          class="dialog-container"
          :style="[
            `z-index:${zIndex ?? 1000};`,
          ]"
        >
          <div
            class="mask"
            @click="onCloseByMaskClick"
          />
          <dialog
            :open="open"
          >
            <slot />
          </dialog>
        </div>
      </Transition>
    </CamelotCustomColorSchemeProvider>
  </Teleport>
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

const open = defineModel<boolean>('open', { default: false })

function onCloseByMaskClick() {
  if (props.closeByMask) {
    open.value = false
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
    if (useRouterHistory()) {
      router.back()
    } else {
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
  } else {
    open.value = false
  }
}, { immediate: true })

// if (props.tag) {
//   watch(open, (isOpen) => {
//     if (isOpen) {
//       router.push({ hash: `#${props.tag}` })
//       return
//     }

//     if (useRoute().hash === `#${props.tag}`) {
//       if (useRouterHistory()) {
//         router.back()
//       } else {
//         router.replace({ hash: '' })
//       }
//     }
//   })

//   watch([() => route.path, () => route.hash], ([path, hash]) => {
//     if (hash === `#${props.tag}`) {
//       open.value = true
//     } else {
//       open.value = false
//     }
//   }, { immediate: true })
// }
</script>

<style scoped>
:global(body:has(dialog[open])) {
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

.dialog-container {
  display: flex;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  justify-content: center;
  align-items: center;
  width: 100dvw;
  height: 100dvh;
  pointer-events: none;
}

.mask {
  background-color: rgba(from var(--camelot-mask-color) r g b / .8);
  width: 100dvw;
  height: 100dvh;
  pointer-events: painted;
}

dialog {
  pointer-events: painted;
  background-color: transparent;
  margin: auto;
  margin: auto;
}
</style>

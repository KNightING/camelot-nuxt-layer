<template>
  <div
    ref="el"
    class="w-fit"
    @click="onContainerClick"
  >
    <slot />
    <Teleport to="body">
      <CamelotExpanded
        :expanded="open"
      >
        <div
          ref="popupEl"
          class="popup"
          :style="[
            `height:min-content;`,
            `top:${popupContainerY}px;left:${popupContainerX}px`,
            disableWidthWithTarget?'width:min-content;':`width:${width}px;`,
            `z-index:${zIndex ?? 10};`,
          ]"
        >
          <slot name="popup" />
        </div>
      </CamelotExpanded>
    </Teleport>
  </div>
</template>

<script setup lang="ts" generic="T">
const props = defineProps<{
  popupBackgroundColor?: string
  zIndex?: number
  disableOpenByTarget?: boolean
  disableWidthWithTarget?: boolean
  disabled?: boolean
}>()

const open = defineModel<boolean>('open', { default: false })

const el = ref<HTMLElement>()

/**
 * popup 元素
 */
const popupEl = ref<HTMLElement>()

onClickOutside(popupEl, () => {
  open.value = false
})

const { x, y, top, right, bottom, left, width, height }
       = useElementBounding(el)

const { top: popupElTop, left: popupElLeft, width: popupElWidth, height: popupElHeight }
        = useElementBounding(popupEl)

const { height: windowHeight, width: windowWidth } = useWindowSize()

const popupContainerX = ref(0)
const popupContainerY = ref(0)

watch([
  () => open.value,
  () => x.value,
  () => left.value,
  () => y.value,
  () => bottom.value,
  () => popupElWidth.value,
  () => popupElHeight.value,
  () => windowWidth.value,
  () => windowHeight.value],
([open, x, left, y, bottom, popupElWidth, popupElHeight, windowWidth, windowHeight]) => {
  if (open && popupElWidth && popupElHeight && windowWidth && windowHeight) {
    const popupContainerClientWidth = popupElWidth ?? 0
    if (left + popupContainerClientWidth > windowWidth) {
      popupContainerX.value = windowWidth - popupContainerClientWidth
    } else {
      popupContainerX.value = left
    }

    const popupContainerClientHeight = popupElHeight ?? 0
    if (bottom + popupContainerClientHeight > windowHeight) {
      popupContainerY.value = y - popupContainerClientHeight
    } else {
      popupContainerY.value = bottom
    }
  }
})

const onContainerClick = (e: Event) => {
  if (props.disabled) {
    return
  }

  if (!props.disableOpenByTarget) {
    open.value = true
  }
}

onUpdated(() => {
  if (props.disabled) {
    open.value = false
  }
})
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.background {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 100dvh;
}

.popup {
  --c-popup-background: var(--camelot-m3-surface);
  background: transparent;
  flex-direction: column;
  overflow: auto;
  position: fixed;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1)) drop-shadow(0 1px 1px rgba(0, 0, 0, 0.06));
}

.v-enter-active {
  transition: all 0.4s ease;
}

.v-leave-active {
  transition: all 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>

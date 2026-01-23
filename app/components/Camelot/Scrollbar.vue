<template>
  <div class="relative h-full w-full overflow-hidden">
    <div
      ref="scrollContainer"
      class="scroll-container"
      :class="{ horizontal }"
      @scroll="onScroll"
    >
      <slot />
    </div>

    <!-- 自訂 scrollbar -->
    <div
      class="custom-scrollbar"
      :class="[{ show: visible }, horizontal ? 'horizontal' : 'vertical']"
    >
      <div
        class="custom-scrollbar-thumb"
        :style="thumbStyle"
        @mousedown="onThumbDown"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  horizontal?: boolean
}>()

const scrollContainer = ref<HTMLDivElement | null>(null)
const visible = ref(false)

// 動態 thumb style：垂直時用 height/top，水平時用 width/left
const thumbStyle = reactive<Record<string, string>>({})

let hideTimeout: ReturnType<typeof setTimeout> | null = null
let isDragging = false
let startPos = 0 // mouse 起始位置 (Y 或 X)
let startScroll = 0 // scrollTop 或 scrollLeft

function updateScrollbar() {
  const el = scrollContainer.value
  if (!el) return

  if (props.horizontal) {
    // 水平模式
    const { scrollLeft, scrollWidth, clientWidth } = el
    const thumbWidth = (clientWidth / scrollWidth) * clientWidth
    const thumbLeft
      = (scrollLeft / (scrollWidth - clientWidth)) * (clientWidth - thumbWidth)

    thumbStyle.width = `${thumbWidth}px`
    thumbStyle.left = `${thumbLeft}px`
    thumbStyle.height = '100%'
    thumbStyle.top = '0'
  }
  else {
    // 垂直模式
    const { scrollTop, scrollHeight, clientHeight } = el
    const thumbHeight = (clientHeight / scrollHeight) * clientHeight
    const thumbTop
      = (scrollTop / (scrollHeight - clientHeight)) * (clientHeight - thumbHeight)

    thumbStyle.height = `${thumbHeight}px`
    thumbStyle.top = `${thumbTop}px`
    thumbStyle.width = '100%'
    thumbStyle.left = '0'
  }
}

function onScroll() {
  updateScrollbar()
  visible.value = true

  if (hideTimeout) clearTimeout(hideTimeout)
  hideTimeout = setTimeout(() => {
    visible.value = false
  }, 1000)
}

function onThumbDown(e: MouseEvent) {
  isDragging = true
  startPos = props.horizontal ? e.clientX : e.clientY
  startScroll = props.horizontal
    ? scrollContainer.value!.scrollLeft
    : scrollContainer.value!.scrollTop

  document.addEventListener('mousemove', onThumbMove)
  document.addEventListener('mouseup', onThumbUp)
}

function onThumbMove(e: MouseEvent) {
  if (!isDragging) return

  const el = scrollContainer.value
  if (!el) return

  if (props.horizontal) {
    const { scrollWidth, clientWidth } = el
    const thumbWidth = (clientWidth / scrollWidth) * clientWidth
    const trackWidth = clientWidth - thumbWidth

    const deltaX = e.clientX - startPos
    const scrollRatio = deltaX / trackWidth
    el.scrollLeft = startScroll + scrollRatio * (scrollWidth - clientWidth)
  }
  else {
    const { scrollHeight, clientHeight } = el
    const thumbHeight = (clientHeight / scrollHeight) * clientHeight
    const trackHeight = clientHeight - thumbHeight

    const deltaY = e.clientY - startPos
    const scrollRatio = deltaY / trackHeight
    el.scrollTop = startScroll + scrollRatio * (scrollHeight - clientHeight)
  }
}

function onThumbUp() {
  isDragging = false
  document.removeEventListener('mousemove', onThumbMove)
  document.removeEventListener('mouseup', onThumbUp)
}

onMounted(() => {
  updateScrollbar()
  window.addEventListener('resize', updateScrollbar)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScrollbar)
  if (hideTimeout) clearTimeout(hideTimeout)
})

const scrollToTop = (options: { behavior?: ScrollBehavior } = {}) => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTo({ top: 0, behavior: options.behavior || 'smooth' })
  }
}

const scrollToBottom = (options: { behavior?: ScrollBehavior } = {}) => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTo({ top: scrollContainer.value.scrollHeight, behavior: options.behavior || 'smooth' })
  }
}

defineExpose({
  scrollToTop,
  scrollToBottom,
})
</script>

<style scoped>
.scroll-container {
  position: relative;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none; /* Firefox */
}

.scroll-container.horizontal {
  overflow-x: auto;
  overflow-y: hidden;
}

.scroll-container::-webkit-scrollbar {
  display: none; /* Chrome / Safari */
}

.custom-scrollbar {
  position: absolute;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.custom-scrollbar.vertical {
  right: 0;
  top: 0;
  bottom: 0;
  width: 6px;
}

.custom-scrollbar.horizontal {
  bottom: 0;
  left: 0;
  right: 0;
  height: 6px;
}

.custom-scrollbar-thumb {
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  cursor: grab;
  pointer-events: auto;
}

.custom-scrollbar.show {
  opacity: 1;
}
</style>

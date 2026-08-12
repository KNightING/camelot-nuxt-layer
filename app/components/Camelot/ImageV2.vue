<template>
  <div
    ref="containerRef"
    @pointerenter="handleMouseEnter"
    @pointerleave="handleMouseLeave"
  >
    <ClientOnly>
      <CamelotSkeleton
        v-if="isLoading"
        ref="target"
      />
      <div
        v-else-if="isError"
        v-bind="$attrs"
      >
        <slot name="error" />
      </div>
      <img
        v-else
        v-bind="$attrs"
        ref="imgRef"
        :src="image?.src"
        :alt="alt"
        class="relative select-none h-auto w-auto"
        :class="{
          'object-fill': objectFit === 'fill',
          'object-contain': objectFit === 'contain',
          'object-cover': objectFit === 'cover',
          'object-scale-down': objectFit === 'scale-down',
        }"
        :style="{
          width: `${width}px`,
          height: `${height}px`,
        }"
      >
    </ClientOnly>

    <Teleport to="body">
      <div
        v-if="isReady && showFullImage"
        ref="imgPopupEl"
        class="bg-black z-30 fixed rounded-lg border-4 border-white overflow-hidden shadow-md pointer-events-none"
        :class="{
          'max-w-125': isLandscapeImage,
          'max-h-125': !isLandscapeImage,
        }"
        :style="{
          top: `${popupTop}px`,
          left: `${popupLeft}px`,
          width: `${!isLandscapeImage ? 'auto' : `${image?.width}px`}`,
          height: `${isLandscapeImage ? 'auto' : `${image?.height}px`}`,
        }"
      >
        <CamelotImageV2
          :src="fullSrc ?? image?.src"
          :alt="alt"
          class="w-full h-full"
          immediate
        />
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { isClient } from '@vueuse/core'

const target = ref(null)

const props = withDefaults(defineProps<{
  src?: string
  fullSrc?: string
  alt?: string
  hoverShowFullImage?: boolean
  width?: number
  height?: number
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
  immediate?: boolean
}>(), {
  hoverShowFullImage: false,
  objectFit: 'scale-down',
  immediate: false,
})

const emit = defineEmits<{
  loaded: [image: HTMLImageElement]
}>()

const containerRef = useTemplateRef('containerRef')

const {
  isLoading, isError, isPending, isReady, load, image, isLandscapeImage,
} = useLazyImage(props.src, {
  immediate: props.immediate,
})

const imgRef = useTemplateRef('imgRef')

const { stop } = useIntersectionObserver(containerRef, ([entry], observerElement) => {
  if (entry?.isIntersecting
    && (isReady.value === false
      && isError.value === false
      && isPending.value === false)) {
    load()
    stop()
  }
}, {
  immediate: true,
  threshold: 0.5,
})

// 這兩組座標只在預覽浮層顯示期間被讀取，故關掉常駐的 window 監聽，
// 改由下方在顯示期間才掛載（見 trackedWindowWhileShown）。
const {
  top, bottom, right, left, height: imgHeight, update: updateImgBounding,
} = useElementBounding(imgRef, {
  windowScroll: false,
  windowResize: false,
})

const imgPopupEl = useTemplateRef('imgPopupEl')
const {
  width: popupWidth, height: popupHeight, bottom: popupBottom, update: updatePopupBounding,
} = useElementBounding(imgPopupEl, {
  windowScroll: false,
  windowResize: false,
})

const popupTop = computed(() => {
  const result = top.value + (imgHeight.value / 2) - (popupHeight.value / 2)
  if (result + popupHeight.value > window.innerHeight) {
    return bottom.value - (popupHeight.value + 25)
  }
  return result
})

const popupLeft = computed(() => {
  const result = right.value + 5
  if (result + popupWidth.value > window.innerWidth) {
    return left.value - (popupWidth.value + 5)
  }
  return result
})

const showFullImage = ref(false)

const updateBounding = () => {
  updateImgBounding()
  updatePopupBounding()
}

// 目標為 null 時 useEventListener 不會掛載任何監聽，浮層顯示／隱藏即自動掛上與解除
const trackedWindowWhileShown = computed(() => (isClient && showFullImage.value ? window : null))

useEventListener(trackedWindowWhileShown, 'scroll', updateBounding, {
  passive: true,
  capture: true,
})
useEventListener(trackedWindowWhileShown, 'resize', updateBounding, { passive: true })

watch(showFullImage, (shown) => {
  // 顯示當下先量一次，避免沿用上次隱藏前的座標
  if (shown) updateBounding()
})

let timeoutId: NodeJS.Timeout | string | number | undefined
const abortController = ref(null)

const handleMouseEnter = () => {
  if (!props.hoverShowFullImage) return
  clearTimeout(timeoutId)
  timeoutId = setTimeout(() => {
    // loadFullImage()
    showFullImage.value = true
  }, 400)
}

const handleMouseLeave = () => {
  if (!props.hoverShowFullImage) return
  clearTimeout(timeoutId)
  timeoutId = setTimeout(() => {
    showFullImage.value = false
  }, 100)
}

onBeforeUnmount(() => {
  stop()
})

defineExpose({
  isLoading,
  isError,
  isReady,
})
</script>

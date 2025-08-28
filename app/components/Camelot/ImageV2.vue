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
        class="bg-black z-30 fixed rounded-lg border-4 border-white overflow-hidden drop-shadow-md pointer-events-none"
        :class="{
          'max-w-[500px]': isLandscapeImage,
          'max-h-[500px]': !isLandscapeImage,
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

const { isLoading, isError, isPending, isReady, load, image, isLandscapeImage } = useLazyImage({
  src: props.src,
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
}, { immediate: true, threshold: 0.5 })

const { top, bottom, right, left, height: imgHeight } = useElementBounding(imgRef)

const imgPopupEl = useTemplateRef('imgPopupEl')
const { width: popupWidth, height: popupHeight, bottom: popupBottom } = useElementBounding(imgPopupEl)

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

defineExpose({ isLoading, isError, isReady })
</script>

<style scoped>

</style>

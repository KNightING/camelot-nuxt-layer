export interface LazyImageOptions {
  src?: string
  immediate?: boolean
}

export const useLazyImage = (options: LazyImageOptions) => {
  const isLoading = ref(true)
  const isPending = ref(false)
  const isError = ref(false)
  const isReady = ref(false)
  const image = ref<HTMLImageElement | null>(null)

  const isLandscapeImage = computed(() => {
    if (!image.value) {
      return false
    }
    if (image.value.width && image.value.height) {
      return image.value.width > image.value.height
    }
    return false
  })

  const load = () => {
    isLoading.value = true
    isPending.value = true
    isError.value = false
    isReady.value = false

    if (options.src) {
      image.value = null
      const img = new Image()
      img.onerror = () => {
        isError.value = true
        isLoading.value = false
        isPending.value = false
      }
      img.onload = () => {
        isReady.value = true
        isLoading.value = false
        isPending.value = false
        image.value = img
      }
      img.src = options.src
    }
  }

  if (options.immediate) {
    load()
  }

  return {
    isLoading,
    isError,
    isReady,
    isPending,
    load,
    image,
    isLandscapeImage,
  }
}

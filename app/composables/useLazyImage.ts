export interface LazyImageOptions {
  immediate?: boolean
}

export const useLazyImage = (
  src: MaybeRefOrGetter<string | undefined>,
  options?: LazyImageOptions,
) => {
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

    const srcValue = toValue(src)
    // 沒有圖片來源視為載入失敗，讓使用端顯示錯誤狀態而不是永遠 loading
    if (!srcValue) {
      image.value = null
      isError.value = true
      isLoading.value = false
      isPending.value = false
      return
    }

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
    img.src = srcValue
  }

  if (options?.immediate) {
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

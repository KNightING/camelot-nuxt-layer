import { isClient } from '@vueuse/core'

export const useScrollOnBottom = (options?: {
  target?: MaybeRefOrGetter<HTMLElement | SVGElement | Window | Document | null | undefined>
  offset?: MaybeRefOrGetter<number>
}) => {
  const isOnBottom = ref(false)

  tryOnMounted(() => {
    const offset = computed(() => {
      return toValue(options?.offset ?? 20) ?? 20
    })

    const target = computed(() => {
      if (options?.target === undefined) {
        return window
      }

      const target = toValue(options.target)

      if (target === undefined) {
        return document.scrollingElement
      }

      if (target instanceof Document) {
        return document.scrollingElement
      }

      return target
    })

    const checkOnBottom = () => {
      let scrollTop = 0
      let viewportHeight = 0
      let totalHeight = 0

      if (target.value instanceof Window) {
        scrollTop = target.value.scrollY ?? 0
        viewportHeight = window.visualViewport?.height ?? window.innerHeight
        totalHeight = document.documentElement.scrollHeight
      } else {
        scrollTop = target.value?.scrollTop ?? 0
        viewportHeight = target.value?.clientHeight ?? window.visualViewport?.height ?? window.innerHeight
        totalHeight = target.value?.scrollHeight ?? 0
      }

      if (scrollTop + viewportHeight >= totalHeight - offset.value) {
        isOnBottom.value = true
      } else {
        isOnBottom.value = false
      }
    }

    const nextFrame = () => requestAnimationFrame(checkOnBottom)

    if (target.value instanceof Window) {
      useEventListener(window, 'scroll', nextFrame, { passive: true })
    } else {
      useEventListener(target, 'scroll', nextFrame, { passive: true })
    }
    useEventListener(window, 'resize', nextFrame, { passive: true })
    useEventListener(window.visualViewport, 'resize', nextFrame)
  })

  return {
    isOnBottom,
  }
}

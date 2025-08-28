import { isClient } from '@vueuse/core'
import { useScrollOnBottom } from './useScrollOnBottom'

export const useInfinitePage = (options: {
  nextPage: VoidFunction
  isPending: Ref<boolean | null | undefined>
  isEnd?: Ref<boolean | null | undefined>
  target?: MaybeRefOrGetter<HTMLElement | SVGElement | null | undefined>
  offset?: MaybeRefOrGetter<number>
}) => {
  const {
    nextPage,
    isPending,
    isEnd,
    target = window,
    offset = 20,
  } = options

  const { isOnBottom } = useScrollOnBottom({ target, offset })

  const nextPageThrottleFn = useThrottleFn(() => {
    if (isEnd && isEnd.value) {
      return
    }

    if (isPending.value) {
      return
    }

    nextPage()
  })

  // const { arrivedState } = useScroll(document, { offset: { bottom: 20 } })

  watch(isOnBottom, (isOnBottom) => {
    console.log('test', isOnBottom)
    if (isOnBottom) {
      nextPageThrottleFn()
    }
  }, { immediate: true })

  if (isClient) {
    let timeout: NodeJS.Timeout | undefined = undefined

    // 如果資料異動, 但是頁面不能滾動則測試呼叫下一頁
    watch(isPending, (isPending) => {
      if (timeout) {
        clearTimeout(timeout)
      }
      if (!isPending) {
        timeout = setTimeout(() => {
          if (document.documentElement
            && document.documentElement.scrollHeight <= document.documentElement.clientHeight
          ) {
            nextPageThrottleFn()
          }
        }, 100)
      }
    })
  }
}

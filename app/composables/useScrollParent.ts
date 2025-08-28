import type { MaybeElementRef } from '@vueuse/core'

export function useScrollParent(target?: MaybeElementRef) {
  function getScrollParent(node: HTMLElement | SVGElement | null | undefined) {
    if (!node) {
      return null
    }

    if (node.scrollHeight > node.clientHeight) {
      return node as HTMLElement
    } else {
      return getScrollParent(node.parentElement)
    }
  }

  const scrollParent = computed(() => {
    return getScrollParent(unrefElement(target))
  })

  return scrollParent
}

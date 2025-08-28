export type AnchorLinkOptions = {
  target?: '_self' | '_blank' | '_parent' | '_top' | '_unfencedTop'
}

export const useAnchorLink = (url: MaybeRef<string>, options?: MaybeRef<AnchorLinkOptions | undefined>) => {
  const element = computed(() => {
    const anchor = document.createElement('a')
    anchor.href = toValue(url)
    anchor.target = '_blank'

    if (options) {
      const optionsValue = toValue(options)
      if (optionsValue && optionsValue.target) {
        anchor.target = optionsValue.target
      }
    }

    return anchor
  })

  const open = () => {
    element.value.click()
  }

  return {
    open,
  }
}

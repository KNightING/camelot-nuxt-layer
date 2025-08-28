import { isClient } from '@vueuse/core'

export const useBaseUrl = (): string => {
  if (isClient) {
    const config = useRuntimeConfig()
    return `${window.location.origin}${config.app.baseURL}`
  } else {
    return ''
  }
}

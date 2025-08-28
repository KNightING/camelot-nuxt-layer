import { isClient } from '@vueuse/core'

let camelotToast: ReturnType<typeof CreateCamelotToast> | null = null

export const useCamelotToast = () => {
  if (!camelotToast) {
    camelotToast = CreateCamelotToast()
  }
  return camelotToast
}

const CreateCamelotToast = () => {
  const toastState = useState<CamelotToast[]>('Camelot:Toasts', () => [])
  const currentToast = computed(() => {
    if (toastState.value.length === 0 && !isClient) {
      return null
    }
    return toastState.value[0]
  })

  let timeout: NodeJS.Timeout | null = null

  watch(currentToast, (toast) => {
    if (timeout) return
    if (toast && toast.duration) {
      timeout = setTimeout(() => {
        removeToast(toast.id)
        toast.onClose?.()
        timeout = null
      }, toast.duration)
    }
  }, {
    immediate: true,
  })

  const addToast = (toast: CamelotToast, options?: CamelotToastOptions) => {
    const clone = useObject().deepClone({
      id: crypto.randomUUID(),
      duration: 2000,
      type: 'info',
      ...toast,
    }) as CamelotToast

    if (options?.only) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      toastState.value = [clone]
      return clone.id
    }

    toastState.value = [...toastState.value, clone]
    return clone.id
  }

  const removeToast = (id?: string) => {
    toastState.value = toastState.value.filter(toast => toast.id !== id)
  }

  const clear = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
    toastState.value = []
  }

  return {
    currentToast,
    addToast,
    removeToast,
    clear,
  }
}

export type CamelotToastType = 'success' | 'error' | 'info'

export type CamelotToast = {
  id?: string
  message: string
  type?: CamelotToastType
  duration?: number
  onClose?: () => void
}

export type CamelotToastOptions = {
  only?: boolean
}

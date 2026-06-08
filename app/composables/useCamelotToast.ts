let camelotToast: ReturnType<typeof CreateCamelotToast> | null = null

export const useCamelotToast = () => {
  if (!camelotToast) {
    camelotToast = CreateCamelotToast()
  }
  return camelotToast
}

const CreateCamelotToast = () => {
  const toastState = useState<CamelotToast[]>('Camelot:Toasts', () => [])
  // 向後相容：仍提供「第一個」通知
  const currentToast = computed(() => toastState.value[0] ?? null)

  const timers = new Map<string, ReturnType<typeof setTimeout>>()

  const removeToast = (id?: string) => {
    if (!id) return
    const timer = timers.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.delete(id)
    }
    const toast = toastState.value.find(t => t.id === id)
    toastState.value = toastState.value.filter(t => t.id !== id)
    toast?.onClose?.()
  }

  const addToast = (toast: CamelotToast, options?: CamelotToastOptions) => {
    const clone = useObject().deepClone({
      id: Math.random().toString(36).substring(2, 11),
      duration: 3000,
      type: 'info',
      position: 'bottom',
      ...toast,
    }) as CamelotToast

    if (options?.only) clear()

    toastState.value = [...toastState.value, clone]

    if (clone.duration && clone.id) {
      timers.set(clone.id, setTimeout(() => removeToast(clone.id), clone.duration))
    }
    return clone.id
  }

  const clear = () => {
    timers.forEach(t => clearTimeout(t))
    timers.clear()
    toastState.value = []
  }

  const open = (messageOrToast: string | CamelotToast, options?: CamelotToastOptions) => {
    const toastObj = typeof messageOrToast === 'string' ? { message: messageOrToast } : messageOrToast
    return addToast(toastObj, options)
  }

  return {
    toasts: toastState,
    currentToast,
    addToast,
    removeToast,
    open,
    clear,
  }
}

export type CamelotToastType = 'success' | 'error' | 'info' | 'warning'

export type CamelotToastPosition
  = | 'top' | 'bottom' | 'left' | 'right' | 'center'
    | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

export interface CamelotToastAction {
  label: string
  handler?: () => void
}

export interface CamelotToast {
  id?: string
  message: string
  title?: string
  type?: CamelotToastType
  /** 直接指定色彩角色（優先於 type 對應的狀態色） */
  color?: CamelotColorRole
  duration?: number
  position?: CamelotToastPosition
  action?: CamelotToastAction
  onClose?: () => void
}

export interface CamelotToastOptions {
  only?: boolean
}

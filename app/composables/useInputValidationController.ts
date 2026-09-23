import type { MaybeElementRef } from '@vueuse/core'

export type ValidatorFn = () => boolean

export type Validator = () => {
  valid: boolean
  element?: MaybeElementRef
} | boolean

export interface InputValidationController {
  addValidatorComputed: (ref: ComputedRef<boolean | string | undefined>) => void
  removeValidatorComputed: (ref: ComputedRef<boolean | string | undefined>) => void
  addValidator: (fn: Validator) => void
  removeValidator: (fn: Validator) => void
  validate: () => boolean
  hasInvalid: (options?: { scrollToFirstElement?: boolean }) => boolean
  isValidate: ComputedRef<boolean>
}

// 只移除確實存在的項目；indexOf 找不到時回傳 -1，直接 splice 會誤刪最後一個
const withoutItem = <T>(list: T[], item: T) => list.filter(it => it !== item)

export const useInputValidationController = (): InputValidationController => {
  const validateFnList = ref<(Validator)[]>([])
  const validateRefList = ref<ComputedRef<boolean | string | undefined>[]>([])

  const addValidatorComputed = (ref: ComputedRef<boolean | string | undefined>) => {
    validateRefList.value = [...validateRefList.value, ref]
  }

  const removeValidatorComputed = (ref: ComputedRef<boolean | string | undefined>) => {
    validateRefList.value = withoutItem(validateRefList.value, ref)
  }

  const addValidator = (fn: Validator) => {
    validateFnList.value = [...validateFnList.value, fn]
  }

  const removeValidator = (fn: Validator) => {
    validateFnList.value = withoutItem(validateFnList.value, fn)
  }

  const validate = () => {
    return !hasInvalid()
  }

  const hasInvalid = (options?: {
    scrollToFirstElement?: boolean
  }) => {
    let hasError = false
    const scrollToFirstElement = options?.scrollToFirstElement ?? true
    let firstElement: Element | undefined

    validateFnList.value.forEach((fn) => {
      const result = fn()
      if (typeof result === 'boolean') {
        if (!result) {
          hasError = true
        }
      }
      else if (!result.valid) {
        hasError = true
        if (scrollToFirstElement && result.element) {
          const elementValue = toValue(result.element)
          let element: Element | undefined
          if (elementValue instanceof Element) {
            element = elementValue
          }
          else {
            // VueInstance
            element = elementValue?.$el
          }

          // 以畫面上的位置判斷哪個錯誤欄位最靠上
          if (element && (!firstElement || element.getBoundingClientRect().top < firstElement.getBoundingClientRect().top)) {
            firstElement = element
          }
        }
      }
    })

    if (firstElement) {
      firstElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }

    return hasError
  }

  const isValidate = computed(() => {
    return validateRefList.value.every(ref => ref.value)
  })

  return {
    addValidatorComputed,
    removeValidatorComputed,
    addValidator,
    removeValidator,
    validate,
    hasInvalid,
    isValidate,
  }
}

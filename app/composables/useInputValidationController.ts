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
  isValidate: ComputedRef<boolean>
}

export const useInputValidationController = () => {
  const validateFnList = ref<(Validator)[]>([])
  const validateRefList = ref<ComputedRef<boolean | string | undefined>[]>([])

  const addValidatorComputed = (ref: ComputedRef<boolean | string | undefined>) => {
    validateRefList.value = [...validateRefList.value, ref]
  }

  const removeValidatorComputed = (ref: ComputedRef<boolean | string | undefined>) => {
    validateRefList.value.splice(validateRefList.value.indexOf(ref), 1)
    validateRefList.value = [...validateRefList.value]
  }

  const addValidator = (fn: Validator) => {
    validateFnList.value = [...validateFnList.value, fn]
  }

  const removeValidator = (fn: Validator) => {
    validateFnList.value.splice(validateFnList.value.indexOf(fn), 1)
    validateFnList.value = [...validateFnList.value]
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
      } else if (!result.valid) {
        hasError = true
        if (scrollToFirstElement && result.element) {
          const elementValue = toValue(result.element)
          let element: Element | undefined
          if (elementValue instanceof Element) {
            element = elementValue
          } else {
            // VueInstance
            element = elementValue?.$el
          }

          if (!firstElement || (element && element.scrollTop < firstElement.scrollTop)) {
            firstElement = element
          }
        }
      }
    })

    if (firstElement) {
      firstElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
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

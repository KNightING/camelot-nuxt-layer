import { describe, expect, it, vi } from 'vitest'

describe('useInputValidationController', () => {
  it('移除從未加入的 validator 不影響既有的', () => {
    const ctrl = useInputValidationController()
    const failing = () => false
    ctrl.addValidator(failing)
    ctrl.removeValidator(() => true)
    expect(ctrl.validate()).toBe(false)
  })

  it('移除從未加入的 computed 不影響既有的', () => {
    const ctrl = useInputValidationController()
    ctrl.addValidatorComputed(computed(() => false))
    ctrl.removeValidatorComputed(computed(() => true))
    expect(ctrl.isValidate.value).toBe(false)
  })

  it('捲動到畫面上最靠上的錯誤欄位', () => {
    const ctrl = useInputValidationController()
    const make = (top: number) => {
      const el = document.createElement('div')
      el.getBoundingClientRect = () => ({ top } as DOMRect)
      el.scrollIntoView = vi.fn()
      return el
    }
    const lower = make(300)
    const upper = make(100)
    ctrl.addValidator(() => ({
      valid: false,
      element: lower,
    }))
    ctrl.addValidator(() => ({
      valid: false,
      element: upper,
    }))
    expect(ctrl.hasInvalid()).toBe(true)
    expect(upper.scrollIntoView).toHaveBeenCalled()
    expect(lower.scrollIntoView).not.toHaveBeenCalled()
  })
})

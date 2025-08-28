import { computed, ref, watch } from 'vue-demi'
import type { MaybeRefOrGetter } from '@vueuse/shared'
import { defaultWindow } from '@vueuse/core'
import type { ConfigurableWindow, MaybeElementRef } from '@vueuse/core'

export interface UseCssVarOptions extends ConfigurableWindow {
  initialValue?: string
  /**
   * Use MutationObserver to monitor variable changes
   * @default false
   */
  observe?: boolean

  /**
   * @default true
   */
  inherit?: boolean
}

/**
 * Manipulate CSS variables.
 *
 * @see https://vueuse.org/useCssVar
 * @param prop
 * @param target
 * @param options
 */
export function useElCssVar(
  prop: MaybeRefOrGetter<string>,
  target?: MaybeElementRef,
  options: UseCssVarOptions = {},
) {
  const {
    window = defaultWindow,
    initialValue = '',
    observe = false,
    inherit = true,
  } = options
  const variable = ref(initialValue)
  const elRef = computed(
    () => unrefElement(target) ?? window?.document?.documentElement,
  )

  function updateCssVar() {
    const key = toValue(prop)
    const el = toValue(elRef)
    if (el && window) {
      const value = inherit
        ? window.getComputedStyle(el).getPropertyValue(key)?.trim()
        : el.style.getPropertyValue(key)?.trim()
      variable.value = value || initialValue
    }
  }

  if (observe) {
    useMutationObserver(elRef, updateCssVar, {
      attributeFilter: ['style', 'class'],
      window,
    })
  }

  watch([elRef, () => toValue(prop)], updateCssVar, { immediate: true })

  watch(variable, (val) => {
    if (elRef.value?.style) {
      elRef.value.style.setProperty(toValue(prop), val)
    }
  })

  return variable
}

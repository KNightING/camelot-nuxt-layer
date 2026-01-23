import { isClient, type MaybeElementRef } from '@vueuse/core'
import { useChangeCase } from '@vueuse/integrations/useChangeCase'
import { Material3ColorSchemeKeys } from './useMaterial3ColorScheme'

type CamelotColorScheme = {
  rippleColor: string
  maskColor: string
}

export const CamelotColorSchemeKeys = Object.keys(
  <CamelotColorScheme>{
    rippleColor: '',
    maskColor: '',
  },
) as (keyof CamelotColorScheme)[]

export type CustomColorScheme<T = any> = Material3ColorSchemePartial
  & Partial<CamelotColorScheme>
  & Partial<T>

const getCssVar = (key: string, target?: MaybeElementRef) =>
  useElCssVar(`${key}`, target, { inherit: false })

const { system, store } = useColorMode()

const defaultCamelotLightColorScheme: CamelotColorScheme = {
  rippleColor: '#111827',
  maskColor: '#111827',
}

const defaultCamelotDarkColorScheme: CamelotColorScheme = {
  rippleColor: '#111827',
  maskColor: '#111827',
}

const globalLightColorScheme = ref<CustomColorScheme<any>>({ ...defaultColorScheme, ...defaultCamelotLightColorScheme })

const globalDarkColorScheme = ref<CustomColorScheme<any>>({ ...defaultDarkColorScheme, ...defaultCamelotDarkColorScheme })

/**
 *
 * ! 建議自定義的顏色light dark模式都需要設定，因為不會刪除設定過的顏色
 * ! 主題切換不會移除前個主題遺留的變數，只會覆蓋方式
 * @param target use global color when target is null
 * @param config
 * @returns
 */
export const useCustomColorScheme = <T>(
  targetRef: MaybeElementRef,
  config?: {
    lightColorScheme?: CustomColorScheme<T>
    darkColorScheme?: CustomColorScheme<T>
    editable?: boolean
  },
) => {
  if (!isClient) {
    const lightColorScheme = globalDarkColorScheme
    const darkColorScheme = globalDarkColorScheme
    const usedColorScheme = globalDarkColorScheme

    return { mode: store, lightColorScheme, darkColorScheme, usedColorScheme }
  }

  const isGlobal = targetRef === document.documentElement

  if (isGlobal) {
    if (config?.lightColorScheme) {
      globalLightColorScheme.value = {
        ...globalLightColorScheme.value,
        ...config.lightColorScheme,
      }
    }

    if (config?.darkColorScheme) {
      globalDarkColorScheme.value = {
        ...globalDarkColorScheme.value,
        ...config.darkColorScheme,
      }
    }
  }

  const lightColorScheme = isGlobal
    ? globalLightColorScheme
    : ref(
        {
          ...globalLightColorScheme.value,
          ...(config?.lightColorScheme ? config?.lightColorScheme : {}),
        },
      )

  const darkColorScheme = isGlobal
    ? globalDarkColorScheme
    : ref(
        {
          ...globalDarkColorScheme.value,
          ...(config?.darkColorScheme ? config?.darkColorScheme : {}),
        },
      )

  const usedColorScheme = computed<CustomColorScheme<T>>(() => {
    let isDark = true
    if (store.value === 'auto') {
      isDark = system.value === 'dark'
    }
    else {
      isDark = store.value === 'dark'
    }

    const cs = <CustomColorScheme<T>>(
        (isDark ? darkColorScheme.value : lightColorScheme.value)
      )
    return cs
  })

  const changeCase = useChangeCase('', 'kebabCase')

  watchImmediate([usedColorScheme, () => unrefElement(targetRef)], ([colorScheme, target]) => {
    if (!target) {
      return
    }

    if (config?.editable === false) {
      return
    }

    for (const key in colorScheme) {
      if (useIsValidKey(key, colorScheme)) {
        changeCase.value = key
        let cssVarKey = changeCase.value

        // 因為tailwind V4 會將 變數放到 :root 導致無法覆蓋 所以需要多一個變數重新設定
        let cssVarOverrideTailwindKey = changeCase.value
        if (Material3ColorSchemeKeys.includes(key)) {
          cssVarOverrideTailwindKey = `--color-${cssVarOverrideTailwindKey}`
          cssVarKey = `--cml-c-m3-${cssVarKey}`
        }
        // else if (CamelotColorSchemeKeys.includes(key)) {
        //   cssVarOverrideTailwindKey = `--color-${cssVarOverrideTailwindKey}`
        //   cssVarKey = `--cml-c-${cssVarKey}`
        // }
        else {
          cssVarOverrideTailwindKey = `--color-${cssVarOverrideTailwindKey}`
          cssVarKey = `--cml-c-${cssVarKey}`
        }
        const cssVar = getCssVar(cssVarKey, targetRef)
        const cssVarOverrideTailwind = getCssVar(cssVarOverrideTailwindKey, target)

        cssVar.value = colorScheme[key]

        if (!isGlobal) {
          cssVarOverrideTailwind.value = `var(${cssVarKey})`
        }
      }
    }
  })

  return { mode: store, lightColorScheme, darkColorScheme, usedColorScheme }
}

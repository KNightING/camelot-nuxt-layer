import { isClient, type MaybeElementRef } from '@vueuse/core'

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

const {
  system, store,
} = useCamelotColorMode()

const defaultCamelotLightColorScheme: CamelotColorScheme = {
  rippleColor: '#111827',
  maskColor: '#111827',
}

const defaultCamelotDarkColorScheme: CamelotColorScheme = {
  rippleColor: '#111827',
  maskColor: '#111827',
}

const globalLightColorScheme = ref<CustomColorScheme<any>>({
  ...defaultColorScheme,
  ...defaultCamelotLightColorScheme,
})

const globalDarkColorScheme = ref<CustomColorScheme<any>>({
  ...defaultDarkColorScheme,
  ...defaultCamelotDarkColorScheme,
})

const isDarkMode = computed(() =>
  store.value === 'auto' ? system.value === 'dark' : store.value === 'dark',
)

const globalUsedColorScheme = computed<CustomColorScheme<any>>(() =>
  isDarkMode.value ? globalDarkColorScheme.value : globalLightColorScheme.value,
)

/**
 * 全域方案寫的永遠是同一個 `<html>`，但 `useCamelotTheme()` 被每個 Camelot 元件呼叫，
 * 單頁可達數百個呼叫端。watcher 因此以模組層單例註冊一次供所有呼叫端共享——先前每個
 * 呼叫端各註冊一份，切換一次色彩模式會有數百份 watcher 對同一個元素重複寫入同一組變數 (issue #17)。
 *
 * 承上，全域路徑不受 `config.editable` 影響：目標元素為共用的 `<html>`，
 * 單一呼叫端的唯讀意圖不足以代表其餘數百個呼叫端。該旗標僅對綁定自身元素的目標生效。
 */
let hasGlobalCssVarsWatcher = false

const ensureGlobalCssVarsWatcher = () => {
  if (hasGlobalCssVarsWatcher) {
    return
  }

  hasGlobalCssVarsWatcher = true

  // 首個呼叫端是某個元件的 setup，若沿用其 scope，該元件卸載時全站色彩就不再更新。
  // 以獨立 scope 承載，讓生命週期跟著模組而非跟著偶然第一個掛載的元件。
  effectScope(true).run(() => {
    watchImmediate(globalUsedColorScheme, (colorScheme) => {
      applyColorSchemeCssVars(document.documentElement, colorScheme)
    })
  })
}

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

    return {
      mode: store,
      lightColorScheme,
      darkColorScheme,
      usedColorScheme,
    }
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
    : ref<CustomColorScheme<T>>(
        // config 本身即 CustomColorScheme<T>，其 Partial<T> 的鍵在 spread 後原樣保留，
        // 值在執行期確實成立；但 T 未受約束，TypeScript 無法為未解析的泛型證明
        // 物件字面值滿足 Partial<T>，故此處斷言。
        {
          ...globalLightColorScheme.value,
          ...(config?.lightColorScheme ? config?.lightColorScheme : {}),
        } as CustomColorScheme<T>,
      )

  const darkColorScheme = isGlobal
    ? globalDarkColorScheme
    : ref<CustomColorScheme<T>>(
        // config 本身即 CustomColorScheme<T>，其 Partial<T> 的鍵在 spread 後原樣保留，
        // 值在執行期確實成立；但 T 未受約束，TypeScript 無法為未解析的泛型證明
        // 物件字面值滿足 Partial<T>，故此處斷言。
        {
          ...globalDarkColorScheme.value,
          ...(config?.darkColorScheme ? config?.darkColorScheme : {}),
        } as CustomColorScheme<T>,
      )

  const usedColorScheme = computed<CustomColorScheme<T>>(() =>
    isDarkMode.value ? darkColorScheme.value : lightColorScheme.value,
  )

  if (isGlobal) {
    ensureGlobalCssVarsWatcher()
  }
  else {
    // 非全域目標各有自己的元素，watcher 必須逐實例註冊
    watchImmediate([usedColorScheme, () => unrefElement(targetRef)], ([colorScheme, target]) => {
      if (config?.editable === false) {
        return
      }

      applyColorSchemeCssVars(target, colorScheme)
    })
  }

  return {
    mode: store,
    lightColorScheme,
    darkColorScheme,
    usedColorScheme,
  }
}

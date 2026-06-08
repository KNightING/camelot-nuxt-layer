export type CamelotThemeMode = 'material' | 'cupertino' | 'scifi' | 'aqua'

// 切換主題 / 深淺色 / 色系時，在 <html> 暫時加上 cml-theme-transitioning，
// 讓全站顏色（bg/text/border/fill/stroke）以漸變過場。模組層單例計時器，
// 多個 composable 實例呼叫只會重置同一個計時器（idempotent）。
let _themeTransitionTimer: ReturnType<typeof setTimeout> | null = null
export const triggerThemeTransition = () => {
  if (typeof document === 'undefined') return
  if (typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    return
  }
  const el = document.documentElement
  el.classList.add('cml-theme-transitioning')
  if (_themeTransitionTimer) clearTimeout(_themeTransitionTimer)
  _themeTransitionTimer = setTimeout(() => {
    el.classList.remove('cml-theme-transitioning')
    _themeTransitionTimer = null
  }, 360)
}

export const useCamelotTheme = () => {
  const themeMode = useLocalStorage<CamelotThemeMode>('cml-theme-mode', 'aqua', {
    initOnMounted: true,
  })

  const { store: colorMode } = useColorMode()

  // Get global color scheme refs (safely for SSR/client)
  const isClient = typeof document !== 'undefined'
  const {
    lightColorScheme, darkColorScheme,
  } = useCustomColorScheme(
    isClient ? document.documentElement : (null as any),
  )

  const setThemeColor = (key: string, lightColor: string, darkColor: string) => {
    // 品牌色 / 色系變更 → 觸發顏色漸變
    triggerThemeTransition()
    if (lightColorScheme.value) {
      lightColorScheme.value = {
        ...lightColorScheme.value,
        [key]: lightColor,
      }
    }
    if (darkColorScheme.value) {
      darkColorScheme.value = {
        ...darkColorScheme.value,
        [key]: darkColor,
      }
    }
  }

  const setPrimaryColor = (lightColor: string, darkColor: string) => {
    setThemeColor('primary', lightColor, darkColor)
  }

  watch(
    themeMode,
    (newMode) => {
      if (isClient) {
        document.documentElement.style.setProperty('--cml-active-ui-style', `"${newMode}"`)
        document.documentElement.setAttribute('data-camelot-theme-mode', newMode)
      }
    },
    { immediate: true },
  )

  // 主題風格 / 深淺色切換 → 顏色漸變過場（非 immediate，避免初次載入閃動）
  watch([themeMode, colorMode], () => triggerThemeTransition())

  return {
    themeMode,
    colorMode,
    lightColorScheme,
    darkColorScheme,
    setPrimaryColor,
    setThemeColor,
    triggerThemeTransition,
  }
}

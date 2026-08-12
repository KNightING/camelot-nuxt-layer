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

const createThemeModeStorage = () =>
  useLocalStorage<CamelotThemeMode>('cml-theme-mode', 'aqua', {
    initOnMounted: true,
  })

/**
 * 主題風格是全站單一狀態，但 `useCamelotTheme()` 被每個 Camelot 元件呼叫。
 * 先前每個呼叫端各建一個 `useLocalStorage` 實例（單頁可達數百份），彼此只能靠 storage
 * 事件同步；改為模組層共用同一個 ref (issue #17)。
 *
 * 以獨立 scope 建立：`getCurrentInstance()` 仍是首個呼叫端的元件，故 `initOnMounted`
 * 照常在 mount 後才讀 localStorage（避免 hydration 不一致），但內部的事件監聽改掛在此
 * scope 上，不會隨著偶然第一個掛載的元件卸載而失效。
 */
const globalThemeScope = effectScope(true)

let themeModeStorage: ReturnType<typeof createThemeModeStorage> | undefined

const useThemeModeStorage = () => {
  if (themeModeStorage) {
    return themeModeStorage
  }

  const created = globalThemeScope.run(createThemeModeStorage)
  if (!created) {
    throw new Error('cml-theme-mode storage 初始化失敗：effectScope 已停止')
  }

  themeModeStorage = created
  return created
}

/**
 * 主題風格與深淺色的副作用（寫入 `<html>` 屬性、觸發顏色過場）對全站只需各發生一次，
 * 但 `useCamelotTheme()` 被每個 Camelot 元件呼叫，單頁可達數百個呼叫端。
 * watcher 因此以模組層單例註冊一次，避免數百份 watcher 重複做同一件事 (issue #17)。
 */
let hasGlobalThemeWatchers = false

const ensureGlobalThemeWatchers = () => {
  if (hasGlobalThemeWatchers || typeof document === 'undefined') {
    return
  }

  hasGlobalThemeWatchers = true

  // 同樣掛在 globalThemeScope 上：這些副作用屬於模組，不屬於偶然第一個掛載的元件。
  globalThemeScope.run(() => {
    const themeMode = useThemeModeStorage()
    const { store: colorMode } = useCamelotColorMode()

    watchImmediate(themeMode, (newMode) => {
      document.documentElement.style.setProperty('--cml-active-ui-style', `"${newMode}"`)
      document.documentElement.setAttribute('data-camelot-theme-mode', newMode)
    })

    // 主題風格 / 深淺色切換 → 顏色漸變過場（非 immediate，避免初次載入閃動）
    watch([themeMode, colorMode], () => triggerThemeTransition())
  })
}

export const useCamelotTheme = () => {
  const themeMode = useThemeModeStorage()

  const { store: colorMode } = useCamelotColorMode()

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

  ensureGlobalThemeWatchers()

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

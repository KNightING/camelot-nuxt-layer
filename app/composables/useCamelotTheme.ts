export type CamelotThemeMode = 'material' | 'cupertino' | 'scifi' | 'aqua'

export const useCamelotTheme = () => {
  const themeMode = useLocalStorage<CamelotThemeMode>('cml-theme-mode', 'material', {
    initOnMounted: true,
  })

  const { store: colorMode } = useColorMode()

  // Get global color scheme refs (safely for SSR/client)
  const isClient = typeof document !== 'undefined'
  const { lightColorScheme, darkColorScheme } = useCustomColorScheme(
    isClient ? document.documentElement : (null as any)
  )

  const setThemeColor = (key: string, lightColor: string, darkColor: string) => {
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

  return {
    themeMode,
    colorMode,
    lightColorScheme,
    darkColorScheme,
    setPrimaryColor,
    setThemeColor,
  }
}

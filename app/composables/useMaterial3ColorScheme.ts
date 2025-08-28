import type { MaybeElementRef } from '@vueuse/core'
import { useChangeCase } from '@vueuse/integrations/useChangeCase'

export type Material3ColorScheme = {
  primary: string
  primaryContainer: string
  onPrimary: string
  onPrimaryContainer: string

  primaryFixed: string
  primaryFixedDim: string
  onPrimaryFixed: string
  onPrimaryFixedVariant: string

  secondary: string
  secondaryContainer: string
  onSecondary: string
  onSecondaryContainer: string

  secondaryFixed: string
  secondaryFixedDim: string
  onSecondaryFixed: string
  onSecondaryFixedVariant: string

  tertiary: string
  tertiaryContainer: string
  onTertiary: string
  onTertiaryContainer: string

  tertiaryFixed: string
  tertiaryFixedDim: string
  onTertiaryFixed: string
  onTertiaryFixedVariant: string

  surfaceDim: string
  surface: string
  surfaceBright: string

  surfaceContainerLowest: string
  surfaceContainerLow: string
  surfaceContainer: string
  surfaceContainerHigh: string
  surfaceContainerHighest: string

  onSurface: string
  onSurfaceVariant: string
  outline: string
  outlineVariant: string

  error: string
  errorContainer: string
  onError: string
  onErrorContainer: string

  inverseSurface: string
  inverseOnSurface: string
  inversePrimary: string

  scrim: string
  shadow: string
}

export type Material3ColorSchemePartial = Partial<Material3ColorScheme>

// Default color scheme

export const defaultColorScheme: Material3ColorScheme = {
  primary: '#6750a4',
  primaryContainer: '#eaddff',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#21005e',

  primaryFixed: '#4f378b',
  primaryFixedDim: '#3b2a6b',
  onPrimaryFixed: '#ffffff',
  onPrimaryFixedVariant: '#21005e',

  secondary: '#625b71',
  secondaryContainer: '#e8def8',
  onSecondary: '#ffffff',
  onSecondaryContainer: '#1e192b',

  secondaryFixed: '#4a4458',
  secondaryFixedDim: '#36343b',
  onSecondaryFixed: '#ffffff',
  onSecondaryFixedVariant: '#1e192b',

  tertiary: '#7d5260',
  tertiaryContainer: '#ffd8e4',
  onTertiary: '#ffffff',
  onTertiaryContainer: '#370b1e',

  tertiaryFixed: '#633b48',
  tertiaryFixedDim: '#492532',
  onTertiaryFixed: '#ffffff',
  onTertiaryFixedVariant: '#370b1e',

  surfaceDim: '#ded8e1',
  surface: '#fef7ff',
  surfaceBright: '#fef7ff',

  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f7f2fa',
  surfaceContainer: '#f3edf7',
  surfaceContainerHigh: '#ece6f0',
  surfaceContainerHighest: '#e6e0e9',

  onSurface: '#1c1b1f',
  onSurfaceVariant: '#49454e',
  outline: '#79747e',
  outlineVariant: '#c4c7c5',

  error: '#b3261e',
  errorContainer: '#f9dedc',
  onError: '#ffffff',
  onErrorContainer: '#410e0b',

  inverseSurface: '#313033',
  inverseOnSurface: '#f4eff4',
  inversePrimary: '#d0bcff',

  scrim: '#000000',
  shadow: '#000000',
}

export const defaultDarkColorScheme: Material3ColorScheme = {
  primary: '#d0bcff',
  primaryContainer: '#4f378b',
  onPrimary: '#371e73',
  onPrimaryContainer: '#eaddff',

  primaryFixed: '#bca0ff',
  primaryFixedDim: '#8c6eff',
  onPrimaryFixed: '#371e73',
  onPrimaryFixedVariant: '#eaddff',

  secondary: '#ccc2dc',
  secondaryContainer: '#4a4458',
  onSecondary: '#332d41',
  onSecondaryContainer: '#e8def8',

  secondaryFixed: '#b8b2c1',
  secondaryFixedDim: '#938f99',
  onSecondaryFixed: '#332d41',
  onSecondaryFixedVariant: '#e8def8',

  tertiary: '#efb8c8',
  tertiaryContainer: '#633b48',
  onTertiary: '#492532',
  onTertiaryContainer: '#ffd8e4',

  tertiaryFixed: '#e6a1b0',
  tertiaryFixedDim: '#b26d7e',
  onTertiaryFixed: '#492532',
  onTertiaryFixedVariant: '#ffd8e4',

  surfaceDim: '#141218',
  surface: '#141218',
  surfaceBright: '#3b383e',

  surfaceContainerLowest: '#0f0d13',
  surfaceContainerLow: '#1d1b20',
  surfaceContainer: '#211f26',
  surfaceContainerHigh: '#2b2930',
  surfaceContainerHighest: '#36343b',

  onSurface: '#e6e1e5',
  onSurfaceVariant: '#cac4d0',
  outline: '#938f99',
  outlineVariant: '#444746',

  error: '#f2b8b5',
  errorContainer: '#8c1d18',
  onError: '#601410',
  onErrorContainer: '#f9dedc',

  inverseSurface: '#e6e1e5',
  inverseOnSurface: '#313033',
  inversePrimary: '#6750a4',

  scrim: '#000000',
  shadow: '#000000',
}

export const Material3ColorSchemeKeys = Object.keys(
  defaultColorScheme,
) as (keyof Material3ColorScheme)[]

type Material3ColorSchemeConfig = {
  lightColorScheme?: Material3ColorSchemePartial
  darkColorScheme?: Material3ColorSchemePartial
  editMode?: boolean
}

const { system, store } = useColorMode()

const getCssVar = (key: string, target?: MaybeElementRef) =>
  useElCssVar(`--camelot-m3-${key}`, target, { inherit: false })

const globalLightColorScheme
  = ref<Material3ColorSchemePartial>(defaultColorScheme)

const globalDarkColorScheme = ref<Material3ColorSchemePartial>(
  defaultDarkColorScheme,
)

const globalUsedColorScheme = computed(() => {
  let isDark = true
  if (store.value === 'auto') {
    isDark = system.value === 'dark'
  } else {
    isDark = store.value === 'dark'
  }
  return {
    ...(isDark ? globalDarkColorScheme.value : globalLightColorScheme.value),
  }
})

export const useGlobalMaterial3ColorScheme = (
  config?: Material3ColorSchemeConfig,
) => {
  if (config?.lightColorScheme) {
    globalLightColorScheme.value = config?.lightColorScheme
  }

  if (config?.darkColorScheme) {
    globalDarkColorScheme.value = config?.darkColorScheme
  }

  return {
    mode: store,
    lightColorScheme: globalLightColorScheme,
    darkColorScheme: globalDarkColorScheme,
    usedColorScheme: globalUsedColorScheme,
  }
}

export const useMaterial3ColorScheme = (
  target?: MaybeElementRef,
  config?: Material3ColorSchemeConfig,
) => {
  if (!target) {
    return useGlobalMaterial3ColorScheme(config)
  }

  const lightColorScheme = ref<Material3ColorSchemePartial>(
    config?.lightColorScheme ?? globalLightColorScheme.value,
  )
  const darkColorScheme = ref<Material3ColorSchemePartial>(
    config?.darkColorScheme ?? globalDarkColorScheme.value,
  )

  const usedColorScheme = computed(() => {
    let isDark = true
    if (store.value === 'auto') {
      isDark = system.value === 'dark'
    } else {
      isDark = store.value === 'dark'
    }
    return { ...(isDark ? darkColorScheme.value : lightColorScheme.value) }
  })

  const changeCase = useChangeCase('', 'kebabCase')

  watchImmediate(usedColorScheme, (nV: any) => {
    if (config?.editMode === false) {
      return
    }

    for (const key in nV) {
      if (useIsValidKey(key, nV)) {
        changeCase.value = key
        const cssVar = getCssVar(changeCase.value, target)
        const rbga = useColor().hexToRgbaArray(nV[key])
        if (!rbga) {
          cssVar.value = nV[key]
        } else {
          cssVar.value = `${rbga[0]},${rbga[1]},${rbga[2]}`
        }
      }
    }
  })

  if (config) {
    if (config.lightColorScheme) {
      lightColorScheme.value = config.lightColorScheme
    }

    if (config.darkColorScheme) {
      darkColorScheme.value = config.darkColorScheme
    }
  }

  return { mode: store, lightColorScheme, darkColorScheme, usedColorScheme }
}

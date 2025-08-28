import type { CustomColorScheme } from '../useCustomColorScheme'

export const useNaiveUITheme = (csRef: MaybeRef<CustomColorScheme>) => {
  const cs = computed(() => unref(csRef))

  const naiveThemeOverride = computed(() => {
    const color = useColor()

    const primaryLightness = color.lightness(cs.value.primary)
    const primaryDarkness = color.darkness(cs.value.primary)
    return {
      common: {
        primaryColor: cs.value.primary,
        borderColor: cs.value.primary,
        errorColor: cs.value.error,
        textColorBase: cs.value.primary,
        textColor1: cs.value.onSurface,

        // * [Select] Border Hover Color
        primaryColorHover: cs.value.primary,

        // * [Select] 選項的顏色
        // * [Select] 選擇後的顏色
        textColor2: cs.value.onSurface,

        textColorDisabled: cs.value.outline,

        // * [Select] 清單背景的顏色
        popoverColor: cs.value.surfaceContainer,

        // * [Select] 輸入框的顏色
        inputColor: cs.value.surface,

        // * [Select] Placeholder的顏色
        placeholderColor: cs.value.outline,

        // * [Select] Arrow Icon的顏色
        iconColor: cs.value.onSurface,

        hoverColor: color.hexToRgba(cs.value.onSurface, 0.1),
      },
      Button: {
        textColor: cs.value.primary,
        textColorHover: primaryLightness,
        textColorPressed: primaryDarkness,
        textColorFocus: primaryLightness,
        colorSecondary: cs.value.secondary,
        colorSecondaryHover: color.lightness(cs.value.secondary),
        colorSecondaryPressed: color.darkness(cs.value.secondary),

        border: `1px solid ${cs.value.primary}`,
        borderHover: `1px solid ${primaryLightness}`,
        borderPressed: `1px solid ${primaryDarkness}`,
        borderFocus: `1px solid ${primaryLightness}`,

        colorPrimary: cs.value.primary,
        colorHoverPrimary: primaryLightness,
        colorPressedPrimary: primaryDarkness,
        colorFocusPrimary: primaryLightness,
        textColorPrimary: cs.value.onPrimary,
        borderHoverPrimary: `1px solid ${primaryLightness}`,
        borderPressedPrimary: `1px solid ${primaryDarkness}`,
        borderFocusPrimary: `1px solid ${primaryLightness}`,

        colorTertiary: cs.value.tertiary,
        colorTertiaryHover: color.lightness(cs.value.tertiary),
        colorTertiaryPressed: color.darkness(cs.value.tertiary),
        textColorTertiary: cs.value.onTertiary,
        colorError: cs.value.error,
        colorErrorHover: color.lightness(cs.value.error),
        colorErrorPressed: color.darkness(cs.value.error),
        textColorError: cs.value.onError,
      },
      Layout: {
        siderColor: cs.value.surfaceContainer,
      },
      Menu: {
        // drawer
        itemIconColorCollapsed: cs.value.onSurface,
        itemIconColor: cs.value.onSurface,
        itemIconColorHover: cs.value.onSurface,
        itemTextColor: cs.value.onSurface,
        itemTextColorHover: cs.value.onSurface,
        arrowColor: cs.value.onSurface,
        arrowColorHover: cs.value.onSurface,
        itemColorHover: cs.value.primaryContainer,
        itemColorActive: cs.value.primaryContainer,
      },
    }
  })

  return naiveThemeOverride
}

/**
 * 日期選擇器（DateV2 / DateRangeV2 / Internal Calendar）各風格的共用樣式解析。
 * 集中於此避免在多個元件重複定義 material/cupertino/scifi/aqua 的 class 對應。
 */
export const useCamelotPickerTheme = () => {
  const { themeMode } = useCamelotTheme()

  // 觸發欄位（input 外框）
  const triggerClass = computed(() => {
    switch (themeMode.value) {
      case 'aqua':
        return 'aqua-track rounded-full backdrop-blur-md'
      case 'scifi':
        return 'border border-[color-mix(in_srgb,var(--color-primary)_35%,transparent)] bg-surface-container-lowest'
      case 'cupertino':
        return 'border border-outline-variant bg-surface-container-highest rounded-[10px]'
      default:
        return 'border border-outline bg-surface-container-lowest rounded-lg'
    }
  })

  // 日曆浮層 / 對話框容器表面
  const panelClass = computed(() => {
    switch (themeMode.value) {
      case 'aqua':
        return 'aqua-glass rounded-3xl'
      case 'scifi':
        return 'rounded-none border border-[color-mix(in_srgb,var(--color-primary)_40%,transparent)] bg-surface shadow-[0_0_20px_color-mix(in_srgb,var(--color-primary)_15%,transparent)]'
      case 'cupertino':
        return 'bg-surface rounded-2xl'
      default:
        return 'bg-surface rounded-xl'
    }
  })

  // 選中態表面（日 / 月 / 年）
  const selectedSurfaceClass = computed(() => {
    switch (themeMode.value) {
      case 'aqua':
        return 'aqua-fill text-[var(--cml-color-current-on-color)]'
      case 'scifi':
        return 'bg-[color-mix(in_srgb,var(--cml-color-current-color,var(--color-primary))_85%,transparent)] text-[var(--cml-color-current-on-color,var(--color-on-primary))] shadow-[0_0_8px_color-mix(in_srgb,var(--cml-color-current-color,var(--color-primary))_60%,transparent)]'
      case 'cupertino':
        return 'bg-[var(--cml-color-current-color,var(--color-primary))] text-[var(--cml-color-current-on-color,var(--color-on-primary))]'
      default:
        return 'bg-[var(--cml-color-current-color,var(--color-primary))] text-[var(--cml-color-current-on-color,var(--color-on-primary))] shadow-sm'
    }
  })

  return {
    themeMode,
    triggerClass,
    panelClass,
    selectedSurfaceClass,
  }
}

/**
 * 日期選擇器（DateV2 / DateRangeV2 / Internal Calendar）各風格的共用樣式解析。
 * 集中於此避免在多個元件重複定義 material/cupertino/scifi/aqua 的 class 對應。
 */
export const useCamelotPickerTheme = () => {
  const { themeMode } = useCamelotTheme()

  // 觸發欄位（input 外框）：與同主題的 Input 同一套外觀；Sci-Fi 外框由 CamelotInternalFieldFrame 負責
  const triggerClass = computed(() => {
    switch (themeMode.value) {
      case 'aqua':
        return 'min-h-10.5 aqua-track rounded-aqua-control backdrop-blur-md'
      case 'scifi':
        return 'min-h-10'
      case 'cupertino':
        return 'min-h-10.5 rounded-[10px] border border-transparent bg-surface-container-highest'
      default:
        return 'min-h-10.5 rounded-t-[4px] border-y border-t-transparent border-b-outline bg-surface-container-highest'
    }
  })

  // 觸發欄位展開（聚焦）時的樣式，對應各主題 Input 的聚焦效果
  const triggerOpenClass = computed(() => {
    switch (themeMode.value) {
      case 'aqua':
        return 'aqua-glow'
      case 'scifi':
        return ''
      case 'cupertino':
        return 'bg-surface shadow-[inset_0_0_0_1px_var(--cml-color-current-color)]'
      default:
        return 'border-b-[var(--cml-color-current-color)] shadow-[inset_0_-1px_0_var(--cml-color-current-color)]'
    }
  })

  // 日曆浮層 / 對話框容器表面
  const panelClass = computed(() => {
    switch (themeMode.value) {
      case 'aqua':
        return 'aqua-glass rounded-aqua-panel'
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
    triggerOpenClass,
    panelClass,
    selectedSurfaceClass,
  }
}

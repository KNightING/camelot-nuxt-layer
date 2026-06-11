/**
 * 選單／選項列的「四風格選中（active）與 hover」效果共用核心。
 *
 * 由 `CascadeMenu`（飛出面板列）與 `SelectV2`（下拉選項）共用，確保兩者的選中效果完全一致。
 * 全數消費 router 注入的 `--cml-color-current-color` / `--cml-color-current-on-color`（CurrentColor 系統）。
 *
 * 註：class 字串必須是字面量，Tailwind v4 掃描器才能在編譯期產生對應 utility。
 */
export const useCamelotMenuItemTheme = () => {
  const { themeMode } = useCamelotTheme()

  // 選中（active / selected）態
  const activeClass = computed(() => {
    switch (themeMode.value) {
      case 'aqua':
        return 'aqua-fill text-[var(--cml-color-current-on-color)]'
      case 'scifi':
        return 'bg-[color-mix(in_srgb,var(--cml-color-current-color)_18%,transparent)] text-[var(--cml-color-current-color)] [text-shadow:0_0_8px_color-mix(in_srgb,var(--cml-color-current-color)_50%,transparent)]'
      case 'cupertino':
        return 'bg-[color-mix(in_srgb,var(--cml-color-current-color)_12%,transparent)] font-semibold text-[var(--cml-color-current-color)]'
      default:
        return 'bg-[color-mix(in_srgb,var(--cml-color-current-color)_12%,transparent)] font-medium text-[var(--cml-color-current-color)]'
    }
  })

  // 未選態的 hover
  const hoverClass = computed(() => {
    switch (themeMode.value) {
      case 'scifi':
        return 'text-on-surface hover:bg-[color-mix(in_srgb,var(--cml-color-current-color)_10%,transparent)] hover:text-[var(--cml-color-current-color)]'
      case 'cupertino':
        return 'text-on-surface hover:bg-[color-mix(in_srgb,var(--cml-color-current-color)_8%,transparent)]'
      case 'aqua':
        return 'text-on-surface hover:bg-[color-mix(in_srgb,var(--cml-color-current-color)_12%,transparent)]'
      default:
        return 'text-on-surface hover:bg-[color-mix(in_srgb,var(--cml-color-current-color)_8%,transparent)]'
    }
  })

  return {
    activeClass,
    hoverClass,
  }
}

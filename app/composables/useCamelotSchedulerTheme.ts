/**
 * Scheduler 各風格的共用樣式解析：外框、格線、今天標示與事件外觀。
 * 集中於此避免在月、週、日與排班四個視圖重複定義各風格的 class 對應。
 */
export const useCamelotSchedulerTheme = () => {
  const { themeMode } = useCamelotTheme()

  // 整個行事曆的外框表面
  const containerClass = computed(() => {
    switch (themeMode.value) {
      case 'tactile':
        return 'tactile-surface rounded-tactile-panel'
      case 'aqua':
        return 'aqua-glass rounded-aqua-panel'
      case 'scifi':
        return 'rounded-none border border-[color-mix(in_srgb,var(--cml-color-current-color)_40%,transparent)] bg-surface font-mono'
      case 'cupertino':
        return 'rounded-2xl bg-surface'
      default:
        return 'rounded-xl border border-outline-variant bg-surface'
    }
  })

  // 格線與分隔線的顏色
  const lineClass = computed(() =>
    themeMode.value === 'scifi'
      ? 'border-[color-mix(in_srgb,var(--cml-color-current-color)_22%,transparent)]'
      : 'border-border',
  )

  // 星期、時間刻度、人員名稱這類標頭文字
  const headerTextClass = computed(() =>
    themeMode.value === 'scifi'
      ? 'text-xs uppercase tracking-wider text-[var(--cml-color-current-color)]'
      : 'text-xs font-semibold text-on-surface-variant',
  )

  // 今天那一欄或那一格的底色
  const todayClass = 'bg-[color-mix(in_srgb,var(--cml-color-current-color)_8%,transparent)]'

  // 今天的日期數字
  const todayNumberClass = computed(() => {
    switch (themeMode.value) {
      case 'tactile':
        return 'tactile-fill text-[var(--cml-color-current-on-color)]'
      case 'aqua':
        return 'aqua-fill text-[var(--cml-color-current-on-color)] [--cml-aqua-fill-gloss:transparent]'
      case 'scifi':
        return 'border border-[var(--cml-color-current-color)] text-[var(--cml-color-current-color)] shadow-[0_0_8px_color-mix(in_srgb,var(--cml-color-current-color)_50%,transparent)]'
      default:
        return 'bg-[var(--cml-color-current-color)] text-[var(--cml-color-current-on-color)]'
    }
  })

  // 事件的形狀與表面；色彩角色由事件自己的 role class 提供
  const eventClass = computed(() => {
    switch (themeMode.value) {
      case 'tactile':
        return 'tactile-fill rounded-xl text-[var(--cml-color-current-on-color)]'
      case 'aqua':
        return 'aqua-fill rounded-lg text-[var(--cml-color-current-on-color)] [--cml-aqua-fill-gloss:transparent]'
      case 'scifi':
        return 'rounded-none border border-[var(--cml-color-current-color)] bg-[color-mix(in_srgb,var(--cml-color-current-color)_18%,transparent)] text-[var(--cml-color-current-color)] shadow-[0_0_8px_color-mix(in_srgb,var(--cml-color-current-color)_30%,transparent)]'
      case 'cupertino':
        return 'rounded-md bg-[var(--cml-color-current-color)] text-[var(--cml-color-current-on-color)]'
      default:
        return 'rounded-md border-l-4 border-[var(--cml-color-current-color)] bg-[color-mix(in_srgb,var(--cml-color-current-color)_15%,transparent)] text-[var(--cml-color-current-color)]'
    }
  })

  // 手勢進行中的預覽與被鎖定的事件
  const draftClass = 'opacity-80 ring-2 ring-[var(--cml-color-current-color)] ring-offset-1 ring-offset-surface'
  const lockedClass = 'cursor-default opacity-70'

  // 目前時間的紅線
  const nowLineClass = 'bg-error'

  // 彈簧動態：tactile 用自己的曲線，其他風格用共用的
  const easeClass = computed(() => (themeMode.value === 'tactile' ? 'ease-tactile' : 'ease-spring'))

  return {
    themeMode,
    containerClass,
    lineClass,
    headerTextClass,
    todayClass,
    todayNumberClass,
    eventClass,
    draftClass,
    lockedClass,
    nowLineClass,
    easeClass,
  }
}

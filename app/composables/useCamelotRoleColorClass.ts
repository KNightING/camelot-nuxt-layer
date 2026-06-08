/**
 * 將色彩角色（color prop）解析為設定 CSS 變數的 Tailwind arbitrary-property class，
 * 取代過往於各 router 元件中以 `computed` 回傳 `:style` 物件注入
 * `--cml-color-current-color` / `--cml-color-current-on-color` 的寫法。
 *
 * 葉元件（Material/Cupertino/Scifi/Aqua）統一以
 * `bg-[var(--cml-color-current-color)]` / `text-[var(--cml-color-current-on-color)]` 取用。
 *
 * 註：class 字串必須是字面量，Tailwind v4 掃描器才能在編譯期產生對應 utility。
 */

// 一般色：--color-{role} / --color-on-{role}
const ROLE_COLOR_CLASS: Record<CamelotColorRole, string> = {
  primary: '[--cml-color-current-color:var(--color-primary)] [--cml-color-current-on-color:var(--color-on-primary)]',
  secondary: '[--cml-color-current-color:var(--color-secondary)] [--cml-color-current-on-color:var(--color-on-secondary)]',
  tertiary: '[--cml-color-current-color:var(--color-tertiary)] [--cml-color-current-on-color:var(--color-on-tertiary)]',
  error: '[--cml-color-current-color:var(--color-error)] [--cml-color-current-on-color:var(--color-on-error)]',
  info: '[--cml-color-current-color:var(--color-info)] [--cml-color-current-on-color:var(--color-on-info)]',
  warning: '[--cml-color-current-color:var(--color-warning)] [--cml-color-current-on-color:var(--color-on-warning)]',
  success: '[--cml-color-current-color:var(--color-success)] [--cml-color-current-on-color:var(--color-on-success)]',
}

// 容器色：--color-{role}-container / --color-on-{role}-container
const ROLE_CONTAINER_COLOR_CLASS: Record<CamelotColorRole, string> = {
  primary: '[--cml-color-current-color:var(--color-primary-container)] [--cml-color-current-on-color:var(--color-on-primary-container)]',
  secondary: '[--cml-color-current-color:var(--color-secondary-container)] [--cml-color-current-on-color:var(--color-on-secondary-container)]',
  tertiary: '[--cml-color-current-color:var(--color-tertiary-container)] [--cml-color-current-on-color:var(--color-on-tertiary-container)]',
  error: '[--cml-color-current-color:var(--color-error-container)] [--cml-color-current-on-color:var(--color-on-error-container)]',
  info: '[--cml-color-current-color:var(--color-info-container)] [--cml-color-current-on-color:var(--color-on-info-container)]',
  warning: '[--cml-color-current-color:var(--color-warning-container)] [--cml-color-current-on-color:var(--color-on-warning-container)]',
  success: '[--cml-color-current-color:var(--color-success-container)] [--cml-color-current-on-color:var(--color-on-success-container)]',
}

export const useCamelotRoleColorClass = (
  color: MaybeRefOrGetter<CamelotColorRole>,
  isContainer: MaybeRefOrGetter<boolean> = false,
) => {
  return computed(() =>
    toValue(isContainer)
      ? ROLE_CONTAINER_COLOR_CLASS[toValue(color)]
      : ROLE_COLOR_CLASS[toValue(color)],
  )
}

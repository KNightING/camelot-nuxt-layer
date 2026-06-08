# Current Plans

| Plan | Status | Affected Components | Summary |
| :--- | :--- | :--- | :--- |
| [2604131355-refactor-calendar-define-model](./plans/2604131355-refactor-calendar-define-model/plan.md) | Planning | [Calendar, DateV2, DateRangeV2] | 將 `modelValue`、`rangeValue`、`viewDate` 改用 `defineModel` 現代語法綁定 |
| [2604131417-propagate-calendar-updates](./plans/2604131417-propagate-calendar-updates/plan.md) | Planning | [DateV2, DateRangeV2] | 傳播 `getDayAttributes` 回調並現代化 Bindings |
| [2604131437-fix-calendar-type-errors](./plans/2604131437-fix-calendar-type-errors/plan.md) | Planning | [DateV2, DateRangeV2] | 修復 `defineModel` 導入後產生的 TypeScript 型別不相容問題 |
| [2604131441-unify-calendar-colors-and-2-line-label](./plans/2604131441-unify-calendar-colors-and-2-line-label/plan.md) | Planning | [Calendar] | 統一顏色控制邏輯，並支援 Label 換行顯示 |
| [2604131510-refactor-daterange-separate-inputs](./plans/2604131510-refactor-daterange-separate-inputs/plan.md) | Planning | [DateRangeV2] | 將原本的單一顯示區改為兩個獨立 Input 顯示起訖日期 |
| [2606081005-aqua-complete-and-tailwind-refactor](./plans/2606081005-aqua-complete-and-tailwind-refactor/plan.md) | Planning | [Button, Input, Switch, Checkbox, Tabs, Dialog, BottomSheet, Steps, Skeleton, Toast, Loading, SelectV2, +Aqua/*, tailwind.css] | 為所有可主題化元件補完 Aqua 風格（pill/Spring/color-mix），並將 computed style 與 scoped CSS 全面重構為 Tailwind v4（共用 keyframes/animation 集中至 tailwind.css）；取代失效的 2506051810-aqua-pill-theme |

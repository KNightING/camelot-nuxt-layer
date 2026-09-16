# Plan: 2609161457 - Aqua 控制項圓角收斂（膠囊 → 12px）
- Created: 2026-09-16
- Branch: feature/2609161457-aqua-control-radius
- Issue: KNightING/camelot-nuxt-layer#39
- Milestone: N/A（未指定）
- Base Branch: main
- Status: In Progress
- Completed: [Wait for Finish]

## Goals
- （迭代）`CamelotInput` 新增 `type` prop 並串到四個主題子元件；playground 的 Input & Textarea 卡片新增密碼輸入範例（含顯示切換）。
- Aqua 主題的 Button / Input / Select 觸發器 / NumberCounter 目前為 `rounded-full` 膠囊，視覺過於圓潤；統一收斂為 12px 圓角。
- Textarea（`rounded-2xl` 16px）與 Select 選單面板（`rounded-3xl` 24px）一併收斂，使 Aqua 表單控制項圓角有一致層級。
- 抽出單一 token，之後調整 Aqua 圓角只需改一處。

## Architecture
- 在 `app/assets/css/tailwind.css` 的 `@theme` 新增 `--radius-aqua-control: 0.75rem`（12px）與 `--radius-aqua-panel: 1rem`（16px，浮層面板），Tailwind v4 會自動產生 `rounded-aqua-control` / `rounded-aqua-panel` utility。
- 各元件的 Aqua 分支把 `rounded-full` / `rounded-2xl` / `rounded-3xl` 換成上述 utility；其他主題分支不動。
- **不動**本質為膠囊/圓形的元件：Tabs（segmented pill）、Switch、Radio、Checkbox circle、Slider thumb、Aqua Checkbox 勾線。
- BaseDialogV2 的 `aqua-glass rounded-3xl`（對話框）不在本次範圍——那是大面積浮層，非表單控制項。

## Cross-Repo Scope
無（單一 repo）

## Impact Files
- `app/assets/css/tailwind.css:139`（`@layer base`）— 關閉 `input[type=password]` 的 `::-ms-reveal` / `::-ms-clear`
- `app/assets/css/tailwind.css:98`（`@theme` 區塊，`--ease-spring` 附近）— 新增 `--radius-aqua-control` / `--radius-aqua-panel` token
- `app/components/Camelot/Aqua/Button.vue:3` — `rounded-full` → `rounded-aqua-control`
- `app/components/Camelot/Aqua/Input.vue:3` — `rounded-full` → `rounded-aqua-control`
- `app/components/Camelot/SelectV2.vue:106`、`:143` — 觸發器 `rounded-full` → `rounded-aqua-control`
- `app/components/Camelot/SelectV2.vue:168` — 選單面板 `rounded-3xl` → `rounded-aqua-panel`
- `app/components/Camelot/NumberCounter.vue:110` — 容器 `rounded-full` → `rounded-aqua-control`
- `app/components/Camelot/Textarea.vue:101` — `rounded-2xl` → `rounded-aqua-control`
- `app/composables/useCamelotPickerTheme.ts:12` — Date/DateRange/Time 觸發欄位 `rounded-full` → `rounded-aqua-control`
- `app/composables/useCamelotPickerTheme.ts:26` — 日曆/時間浮層面板 `rounded-3xl` → `rounded-aqua-panel`
- `shared/types/camelot.ts:20` — 新增 `CamelotInputType` 聯集型別
- `app/components/Camelot/Input.vue:417`（props）、四處 `:placeholder` 旁 — 新增 `type` prop（預設 `text`）並下傳
- `app/components/Camelot/Aqua/Input.vue:8`、`Cupertino/Input.vue:8`、`Material/Input.vue:7`、`Scifi/Input.vue:14` — 原生 `<input>` 加 `:type`，props 補 `type`
- `app/components/Camelot/Internal/PasswordToggle.vue` (new) — 內建密碼顯示切換鈕（四主題共用，mousedown.prevent 不奪焦點）
- `.playground/app/pages/index.vue:322` — Input & Textarea 卡片新增 Password 範例（`#after` slot 眼睛切換）
- `app/components/Camelot/DateV2.vue:243`、`DateRangeV2.vue:363`、`TimeV2.vue:211` — popup 外層落影容器 `rounded-3xl` → `rounded-aqua-panel`（註解明示需與面板圓角一致）

## Open Questions / 待確認事項
無（圓角大小、範圍已於對話中確認）

## Key Decisions
- **[圓角]** Aqua 控制項採 12px（rounded-xl 級）— 理由：使用者反映膠囊太圓，12px 明顯脫離膠囊感又保留柔和（來源：對話確認）
- **[範圍]** Tabs / Switch / Radio / Slider thumb 維持膠囊或圓形 — 理由：這些元件的膠囊形狀承載 iOS 語意，改方角會失去辨識（來源：對話確認）
- **[迭代]** Date / DateRange / Time picker 納入範圍 — 理由：觸發欄位同屬表單控制項，原計畫漏列；其浮層面板與 Select 面板同級，一併收斂為 16px（來源：使用者指正）
- **[迭代]** Input `type` prop + playground 密碼範例併入本計畫 — 理由：使用者選擇同一計畫一起做；Textarea 原生不支援密碼遮罩，範例只加在 Input（來源：對話確認）
- **[迭代]** 全域關閉瀏覽器原生密碼顯示按鈕（`::-ms-reveal` / `::-ms-clear`） — 理由：與元件自帶的顯示切換重複，會出現兩顆眼睛（來源：使用者要求）
- **[迭代]** 密碼顯示切換改為 `CamelotInput` 內建（`passwordToggle` 預設開），新增 `passwordRevealMode: 'persistent' | 'hide-on-change'`（預設 hide-on-change） — 理由：使用者要求可參數化「顯示後保持」與「數值異動即隱碼」；hide-on-change 以 watch(model) 實作而非 onInput，因後者有 debounce（來源：使用者要求）
- **[迭代]** 預設改為 hide-on-change；切換顯示後還原游標位置（原本無選取即字尾），僅在 input 已聚焦時處理 — 理由：使用者指出切換 type 後游標跑到最前面；安全預設優先（來源：使用者要求）
- **[Milestone]** 不指定，PR 併回 `main` — 理由：初期開發常態，repo 目前無任何 milestone（來源：對話確認）

## Git Completion Policy
- PR 一律以 `--base main` 顯式指定 base (Rule 23)。
- Issue 綁定時，每個 commit 訊息與 PR body 都必須含 `Closes #${N}`（取自上方 `- Issue:`）。歸檔完成後於該 issue 張貼結案留言 (Rule 20)。
- Issue 的關閉發生在合併後清理，不在歸檔當下 (Rule 21)。
- After user-approved commits, completion will run `git rebase main` and `git push --force-with-lease --force-if-includes`.
- PR/archive order: Archive automatically triggered on PR request

## References
- `.kn-project/wiki/features/theme-system.md`（Aqua 主題設計脈絡）

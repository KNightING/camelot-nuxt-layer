# 2609161457 - aqua-control-radius

- Created: 2026-09-16 14:57 / Archived: 2026-09-16
- Issue: KNightING/camelot-nuxt-layer#39
- Milestone: N/A / Base Branch: main

## Summary
Aqua 主題表單控制項的圓角由膠囊（`rounded-full`）收斂為 12px token，並讓 `CamelotInput` 支援 `type` 與內建密碼顯示切換。
起因是使用者反映 Aqua 的按鈕／輸入框／select 過於圓潤；作法是在 `tailwind.css` `@theme` 抽出 `--radius-aqua-control`（12px）與 `--radius-aqua-panel`（16px），Button / Input / Select 觸發器與面板 / NumberCounter / Textarea / Date·DateRange·Time picker 觸發器與面板改消費 token。
執行途中併入兩項需求：`CamelotInput` 新增 `type` prop 串到四主題子元件；`type="password"` 時內建 `Internal/PasswordToggle` 眼睛切換，`passwordRevealMode` 決定顯示後是否隨輸入自動隱碼，切換時還原游標位置；全域關閉瀏覽器原生 `::-ms-reveal` / `::-ms-clear`。

## Cross-Repo Scope
無（單一 repo）

## Key Decisions
- **[圓角]** Aqua 控制項 12px、浮層面板 16px — 使用者反映膠囊太圓；12px 明顯脫離膠囊感又保留柔和。
- **[範圍]** Tabs / Switch / Radio / Checkbox / Slider thumb / Dialog 維持不動 — 膠囊、圓形承載 iOS 語意；Dialog 為大面積浮層非表單控制項。
- **[迭代]** Date / DateRange / Time picker 納入 — 觸發欄位同屬表單控制項，原計畫漏列；popup 落影容器與面板圓角必須一致。
- **[迭代]** Input `type` prop + 密碼範例併入本計畫（使用者選擇不另開）— Textarea 原生不支援遮罩，只加在 Input。
- **[迭代]** 密碼切換改為 `CamelotInput` 內建（`passwordToggle` 預設開），`passwordRevealMode: 'hide-on-change' | 'persistent'`，**預設 hide-on-change**（安全預設）— hide-on-change 以 `watch(model)` 實作而非 `onInput`，因後者有 300ms debounce。
- **[迭代]** 切換 type 後還原游標：Chromium 在真實滑鼠互動的 task 結尾才重設游標，`nextTick` 太早，改排到下一個 macrotask（`setTimeout 0`）；只在 input 已聚焦時處理。
- **[迭代]** `::-ms-reveal` / `::-ms-clear` 分兩條規則寫 — 選擇器列表中任一 pseudo-element 不被引擎認得，整條規則會被丟棄。
- **[Milestone]** 不指定，PR 併回 `main` — 初期開發常態。
- **[App-Flow]** `project.md` 記 `appFlow: false` — UI 元件庫不維護畫面流程紀錄。

## Deviations
- 原計畫只有圓角；執行中依使用者要求併入 Date picker、Input `type`、內建密碼切換與原生眼睛關閉，皆已記於 Key Decisions。

## Impact Files
- `app/assets/css/tailwind.css:98`（`@theme`）— `--radius-aqua-control` / `--radius-aqua-panel`；`:139`（`@layer base`）— 關閉 `input[type=password]::-ms-reveal` / `::-ms-clear`
- `app/components/Camelot/Aqua/Button.vue:3`、`Aqua/Input.vue:3` — `rounded-aqua-control`
- `app/components/Camelot/SelectV2.vue:106`、`:143`（觸發器）、`:168`（面板 `rounded-aqua-panel`）
- `app/components/Camelot/NumberCounter.vue:110`、`Textarea.vue:101` — `rounded-aqua-control`
- `app/composables/useCamelotPickerTheme.ts:12`（觸發器）、`:26`（面板）
- `app/components/Camelot/DateV2.vue:243`、`DateRangeV2.vue:363`、`TimeV2.vue:211` — popup 落影容器 `rounded-aqua-panel`
- `shared/types/camelot.ts:20` — `CamelotInputType`
- `app/components/Camelot/Input.vue`（props `type` / `passwordToggle` / `passwordRevealMode`；`effectiveType`、`isPasswordRevealed`、游標還原 watch）
- `app/components/Camelot/Aqua/Input.vue`、`Cupertino/Input.vue`、`Material/Input.vue`、`Scifi/Input.vue` — 原生 `<input>` 加 `:type`
- `app/components/Camelot/Internal/PasswordToggle.vue` (new) — 眼睛切換鈕，`v-model:revealed`，`mousedown.prevent` 不奪焦點
- `.playground/app/pages/index.vue` — Input & Textarea 卡片兩個密碼範例
- `.kn-project/project.md` — `## 全域規則` `appFlow: false`

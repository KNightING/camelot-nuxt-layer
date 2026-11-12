# 2611121510 - tactile-showcase-parity

- Created: 2026-11-12 15:10 / Archived: 2026-11-12
- Issue: KNightING/camelot-nuxt-layer#80
- Milestone: 4.6.4.2 / Base Branch: 4.6.4.2

## Summary
讓 tactile 與 Tape Room 展示頁對齊，並補上展示頁有而 Camelot 沒有的四個元件：步進器、大數字、可選取標籤、行內日曆。
使用者陸續回報 Tabs 與 Steps 的彈跳感消失、Slider 外觀不一致、步進器與大數字不存在；逐項對照後，Tabs 滑塊與 Steps 節點改用 0.6 秒的 `--ease-tactile` 彈簧，Slider 在 tactile 下改為 10px 軌道與 26px 外環拇指。
新增 `CamelotStepper`、`CamelotAnimatedNumber`、`CamelotChipGroup`、`CamelotCalendar`（包裝內部日曆核心），五種風格都實作；順帶修正 `pnpm lint` 在 #77 之後因 wiki 生成檔而失敗的問題。

## Cross-Repo Scope
無（單一 repo）

## Key Decisions
- **[Milestone]** 沿用 `4.6.4.2` — 與同一條版本線的 tactile 主題一起修；版本分支已存在。
- **[範圍]** 本計畫擴大為「tactile 與展示頁對齊」— 使用者陸續回報 Tabs 與 Steps 彈跳感消失、步進器與大數字不存在、Slider 外觀不一致；改為一次逐項對照，不再逐一回報修補。
- **[Q1]** 補可選取標籤 `CamelotChipGroup` 與公開的行內日曆 `CamelotCalendar` — 使用者選定；展示頁的時段與器材標籤、月曆在 Camelot 沒有對應元件。
- **[做法]** `CamelotCalendar` 只做單日選取 — 範圍與時間選取是日期選擇器的功能，不重複。
- **[執行中]** 補列 `eslint.config.mjs` 並忽略 `wiki-data` — 完整的 `pnpm lint` 在 #77 之後無法通過（13091 個錯誤全在生成檔），驗證閘需要它通過；使用者核准。#77 的 PR 說明寫「`pnpm lint` 通過」不準確（當時只對改動目錄跑了 eslint），在本 PR 說明更正。
- **[不做]** 日曆小點位置 — 內部日曆的 `dot` 固定在格子左上（「今天」標記也用同一處），展示頁是日期下方置中；要改必須動內部日曆，會影響日期選擇器，不在本計畫範圍，需要時另案。
- **[做法]** 不改共用的 `--ease-spring` — 它被 aqua 等風格使用，改了會影響既有風格。
- **[做法]** Slider 的 `height` 改為無預設值、tactile 自己決定 — 其他風格維持 6px，既有用法外觀不變。
- **[運算]** 步進器只處理整數步進，不引入 decimal.js — 純整數運算（通用鐵則第 12 條的例外）；大數字只做顯示格式化。
- **[不做]** 付款按鈕的「完成」變形 — 以 Button 的 `loading` 加 Toast 組合即可，不為單一展示新增 Button 狀態。
- **[拆分]** 與 `2611121501-scheduler-component` 分成兩份計畫 — 檔案不重疊；行事曆較大且不相依於本計畫。

## Deviations
- 計畫初稿只有彈跳修正；核准前依使用者後續回報擴大為「與展示頁對齊」，範圍與 Open Questions 都在核准閘一併確認。
- 執行中補列 `eslint.config.mjs`（忽略 `wiki-data`）：完整的 `pnpm lint` 在 #77 之後有 13091 個錯誤，驗證閘需要它通過，使用者核准。#77 的 PR 說明寫「`pnpm lint` 通過」不準確，已在本 PR 說明更正。
- 原擬在 `shared/types/camelot.ts` 新增日曆日標記型別，實作改為像 `DateV2` 一樣直接引用內部日曆的 `CalendarDayAttributes`，共用型別檔只新增 Stepper 與 AnimatedNumber 需要的兩個型別。
- 日曆小點位置維持內部日曆的左上角，與展示頁的「日期下方置中」不同，未處理。
- 動畫以計算後的樣式與曲線取樣驗證（瀏覽器面板在背景時動畫不推進），過衝量實測為 16.2%，舊曲線為 1.2%；沒有逐幀目視確認。

## Impact Files
- `app/components/Camelot/Tabs.vue:17` — 滑塊的 `duration-300 ease-spring` 改為依主題切換
- `app/components/Camelot/Steps.vue:322`（`.container.tactile` 樣式區段）— 節點彈簧過場、完成彈出關鍵影格、連線過場
- `app/components/Camelot/Slider.vue:77`、`:89`（`height` prop 與預設值）、`:103`（`thumbSize`）、`:27`（刻度圓點）、`:258`–`:293`（軌道、填滿、拇指 class）— tactile 外觀
- `app/assets/css/tailwind.css:340`（tactile utility 區段）— 新增 `tactile-slider-thumb`
- `app/components/Camelot/Stepper.vue` (new)、`AnimatedNumber.vue` (new)、`ChipGroup.vue` (new)、`Calendar.vue` (new)
- `shared/types/camelot.ts:26`（`CamelotGroupOption`）— `ChipGroup` 重用；若有其他新型別一併加在此檔
- `app/components/Camelot/Internal/Calendar.vue:293`（`CalendarDayAttributes`）、`:318`（props）、`:345`–`:347`（v-model）— `Calendar.vue` 包裝的對象，不修改；`DateV2.vue:66`（既有的使用方式）— 參考
- `.playground/app/pages/index.vue:1199`（Slider 展示）— 加上展示頁風格的滑桿；`:1925` 附近加步進器與大數字展示
- `.playground/app/components.d.ts` — 自動產生的型別宣告
- `.kn-project/wiki/platform/theme-system.md`、`features/components.md:38`、新增 `features/components/Stepper.md`、`AnimatedNumber.md`、`ChipGroup.md`、`Calendar.md`，`features/components/Slider.md`、`Tabs.md`、`Steps.md` 的 tactile 說明
- `eslint.config.mjs:7`（`ignores`）— 補列（使用者已核准）：加入 `.kn-project/wiki-data`；wiki 檢視器的生成檔在 #77 首次提交後，`pnpm lint`（`eslint .`）出現 13091 個錯誤
- 參考不修改：`app/components/Camelot/NumberCounter.vue:1`（既有的可編輯輸入框，與步進器用途不同）
- `app/components/Camelot/Stepper.vue`、`AnimatedNumber.vue`、`ChipGroup.vue`、`Calendar.vue` (new)

## Wiki Changes

| 頁面 | 日期 | 版本 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| `platform/theme-system.md` | 2026-11-12 | 4.6.4.2 | tactile 與展示頁對齊，新增步進器、大數字、可選取標籤與行內日曆 | [#80](https://github.com/KNightING/camelot-nuxt-layer/issues/80) | [PR #81](https://github.com/KNightING/camelot-nuxt-layer/pull/81) |
| `features/components.md` | 2026-11-12 | 4.6.4.2 | tactile 與展示頁對齊，新增步進器、大數字、可選取標籤與行內日曆 | [#80](https://github.com/KNightING/camelot-nuxt-layer/issues/80) | [PR #81](https://github.com/KNightING/camelot-nuxt-layer/pull/81) |
| `features/components/Tabs.md` | 2026-11-12 | 4.6.4.2 | tactile 與展示頁對齊，新增步進器、大數字、可選取標籤與行內日曆 | [#80](https://github.com/KNightING/camelot-nuxt-layer/issues/80) | [PR #81](https://github.com/KNightING/camelot-nuxt-layer/pull/81) |
| `features/components/Slider.md` | 2026-11-12 | 4.6.4.2 | tactile 與展示頁對齊，新增步進器、大數字、可選取標籤與行內日曆 | [#80](https://github.com/KNightING/camelot-nuxt-layer/issues/80) | [PR #81](https://github.com/KNightING/camelot-nuxt-layer/pull/81) |
| `features/components/Steps.md` | 2026-11-12 | 4.6.4.2 | tactile 與展示頁對齊，新增步進器、大數字、可選取標籤與行內日曆 | [#80](https://github.com/KNightING/camelot-nuxt-layer/issues/80) | [PR #81](https://github.com/KNightING/camelot-nuxt-layer/pull/81) |
| `features/components/Stepper.md` | 2026-11-12 | 4.6.4.2 | tactile 與展示頁對齊，新增步進器、大數字、可選取標籤與行內日曆 | [#80](https://github.com/KNightING/camelot-nuxt-layer/issues/80) | [PR #81](https://github.com/KNightING/camelot-nuxt-layer/pull/81) |
| `features/components/AnimatedNumber.md` | 2026-11-12 | 4.6.4.2 | tactile 與展示頁對齊，新增步進器、大數字、可選取標籤與行內日曆 | [#80](https://github.com/KNightING/camelot-nuxt-layer/issues/80) | [PR #81](https://github.com/KNightING/camelot-nuxt-layer/pull/81) |
| `features/components/ChipGroup.md` | 2026-11-12 | 4.6.4.2 | tactile 與展示頁對齊，新增步進器、大數字、可選取標籤與行內日曆 | [#80](https://github.com/KNightING/camelot-nuxt-layer/issues/80) | [PR #81](https://github.com/KNightING/camelot-nuxt-layer/pull/81) |
| `features/components/Calendar.md` | 2026-11-12 | 4.6.4.2 | tactile 與展示頁對齊，新增步進器、大數字、可選取標籤與行內日曆 | [#80](https://github.com/KNightING/camelot-nuxt-layer/issues/80) | [PR #81](https://github.com/KNightING/camelot-nuxt-layer/pull/81) |

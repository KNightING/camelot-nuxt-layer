<!-- REMINDER: Relative Paths Only! No file:///c:/... -->
# Plan: 2611121510 - tactile-showcase-parity
- Created: 2026-11-12
- Branch: fix/2611121510-tactile-showcase-parity
- Issue: KNightING/camelot-nuxt-layer#80
- Milestone: 4.6.4.2
- Base Branch: 4.6.4.2
- Status: In Progress
- Completed: [Wait for Finish]

## Goals
讓 tactile 與「Tape Room 展示頁」（本次工作的視覺依據）對齊，並補上展示頁有、Camelot 沒有的元件。
1. **彈跳手感**：Tabs 滑塊與 Steps 節點回到展示頁的 0.6 秒彈簧動態。
2. **Slider**：tactile 的滑桿外觀對齊展示頁（10px 軌道、26px 外環加主色圓點的拇指、按住放大、等寬小字刻度）。
3. **新元件**：步進器（圓形立體 −／＋ 按鈕夾著帶單位的文字）、大數字顯示（金額變動時數字滾動）、可選取標籤（單選或多選）、公開的行內日曆（含忙碌小點與選中日）。
4. 只改 tactile 與新元件；其他四種風格的既有元件外觀不變。
5. 實作符合 `kn-project-code-style`。

## 展示頁與 Camelot 逐項對照（本計畫的審查結果）
| 展示頁元素 | Camelot 現況 | 本計畫處理 |
| :--- | :--- | :--- |
| 月曆（忙碌小點、選中日） | 只有內部日曆核心與日期選擇器，沒有公開的行內日曆 | 本計畫新增 `CamelotCalendar`（公開的行內日曆）；行事曆元件另案（`2611121501-scheduler-component`） |
| 播放器（波形、音量表、播放鈕） | Waveform、LevelMeter、Button 組合而成 | 已有 |
| 圓環計時 | ProgressCircle | 已有 |
| 滑桿（標題與數值、刻度、拇指） | Slider，tactile 外觀不一致 | 本計畫修正外觀（標題與數值列由使用者以既有元件組合） |
| 開關、勾選、單選 | Switch、Checkbox、Radio | 已有 |
| 費用：大數字 | 無 | 本計畫新增 `CamelotAnimatedNumber` |
| 費用：步進器 | `NumberCounter` 是可編輯輸入框，外觀與用途不同 | 本計畫新增 `CamelotStepper` |
| 付款按鈕（處理中→完成） | Button `loading` 已有，「完成」狀態變形沒有 | 不做（用 loading 加 Toast 組合） |
| 分段控制 | Tabs，tactile 彈跳不足 | 本計畫修正 |
| 下拉 | SelectV2 | 已有 |
| 可切換的標籤（單選、多選） | `Tag` 不可選取、`TagGroup` 是可編輯標籤 | 本計畫新增 `CamelotChipGroup` |
| 檢查清單與進度條 | CheckboxGroup、ProgressBar | 已有 |
| 訊息泡泡與輸入送出 | ChatBubble、Input、Button | 已有 |
| 常見問題 | Accordion | 已有 |
| 樂手頭像堆疊 | AvatarGroup | 已有 |

## Architecture

### 彈跳手感
- 原因：Tabs 滑塊對所有風格共用 `duration-300 ease-spring`（過衝約 4%），展示頁用的是 0.6 秒、過衝約 16% 的 `linear()` 彈簧；Steps 節點只有 300ms 平滑過場。
- Tabs：滑塊的 `duration` 與 `ease` 依主題切換，tactile 用 `duration-[600ms] ease-tactile`，其餘維持。
- Steps：`.container.tactile` 的節點加 `transform` 彈簧過場；進行中放大 12%，完成以關鍵影格從 70% 彈到 100%；連線加背景色過場；`prefers-reduced-motion` 下關閉。

### Slider（只改 tactile）
- 軌道高度：`height` prop 改為不給預設值，未指定時 tactile 用 10px、其他風格維持 6px。
- 拇指：26px，亮底加 7px 外環、內層主色圓點，雙層落影；按住放大到 122%，用 `--ease-tactile` 彈回。新增 `tactile-slider-thumb` utility。
- 刻度：tactile 不畫圓點，只顯示等寬小字標籤。

### 新元件
- `CamelotStepper`：v-model 為整數；props 有 `min`、`max`、`step`、`unit`、`disabled`、`color`。兩側是圓形立體按鈕（SVG 圖示），中間顯示「數值＋單位」；到達上下限時對應按鈕停用；步進只處理整數，不引入小數運算。
- `CamelotAnimatedNumber`：顯示用的大數字，props 有 `value`（number 或 string）、`prefix`、`suffix`、`fractionDigits`、`locale`。以 `Intl.NumberFormat` 格式化（模組層快取，不在熱路徑重建），每個字元獨立渲染，變動的字元以彈簧滾動進入。只做顯示，不做運算。
- `CamelotChipGroup`：可點一下切換的標籤群組。props 有 `options`（重用既有的 `CamelotGroupOption`）、`multiple`、`color`、`disabled`；v-model 為選中的 value 陣列，單選模式最多一個；每顆是帶 `aria-pressed` 的按鈕，選中時填滿角色色，按下有彈簧回彈。
- `CamelotCalendar`：把內部日曆核心包成公開元件，直接放在頁面上用。v-model 為選中日期；自己管理目前顯示的月份；透傳 `getDayAttributes`（忙碌小點、節日標籤、停用日）、`minDate`、`maxDate`、`locale`、`weekStartsOn` 與各種格式化函式及 slot；外框用既有的日期選擇器面板樣式。只做單日選取，範圍與時間選取仍是日期選擇器的功能。
- 四個新元件都實作五種風格，樣式集中在各自元件的 computed class（比照既有元件）。

## Cross-Repo Scope
無（單一 repo）

## Contract / 介面契約
無（單一 repo）

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
- 參考不修改：`app/components/Camelot/NumberCounter.vue:1`（既有的可編輯輸入框，與步進器用途不同）

## Open Questions / 待確認事項

### Q1. 除了步進器與大數字，還要補哪些展示頁有、Camelot 沒有的元件？— 影響範圍：新檔與 playground
- [x] 可選取標籤（單選或多選的 Chip 群組）
- [x] 公開的行內日曆
- [ ] 都不補
- **決議**：兩樣都補　狀態：✅ 已確認

## Manual Follow-ups / 人工收尾事項
無

## Key Decisions
- **[Milestone]** 沿用 `4.6.4.2` — 與同一條版本線的 tactile 主題一起修；版本分支已存在。
- **[範圍]** 本計畫擴大為「tactile 與展示頁對齊」— 使用者陸續回報 Tabs 與 Steps 彈跳感消失、步進器與大數字不存在、Slider 外觀不一致；改為一次逐項對照，不再逐一回報修補。
- **[Q1]** 補可選取標籤 `CamelotChipGroup` 與公開的行內日曆 `CamelotCalendar` — 使用者選定；展示頁的時段與器材標籤、月曆在 Camelot 沒有對應元件。
- **[做法]** `CamelotCalendar` 只做單日選取 — 範圍與時間選取是日期選擇器的功能，不重複。
- **[做法]** 不改共用的 `--ease-spring` — 它被 aqua 等風格使用，改了會影響既有風格。
- **[做法]** Slider 的 `height` 改為無預設值、tactile 自己決定 — 其他風格維持 6px，既有用法外觀不變。
- **[運算]** 步進器只處理整數步進，不引入 decimal.js — 純整數運算（通用鐵則第 12 條的例外）；大數字只做顯示格式化。
- **[不做]** 付款按鈕的「完成」變形 — 以 Button 的 `loading` 加 Toast 組合即可，不為單一展示新增 Button 狀態。
- **[拆分]** 與 `2611121501-scheduler-component` 分成兩份計畫 — 檔案不重疊；行事曆較大且不相依於本計畫。

## Git Completion Policy
- PR 一律以 `--base 4.6.4.2` 顯式指定 base。
- Issue 綁定後，每個 commit 訊息與 PR body 都含 `Closes #80`。
- commit 一律自動；完成後動作依核准閘決議。
- PR/archive order: Archive automatically triggered on PR request

## References
- 使用者回報：Navigation（Tabs & Steps）彈跳感消失；步進器與大數字不存在；Slider 外觀不一致
- Tape Room 展示頁（本次工作的視覺依據）：https://claude.ai/artifact/6fkv1H2z3fpZQ6weDxKNT8
- `.kn-project/archive/2611121356-tactile-theme-and-new-components.md` — tactile 主題的來源計畫

<!-- REMINDER: Relative Paths Only! -->
# Plan: 2607091145 - DatePicker：可關閉日 label 空間 + 各國語系顯示

- Created: 2026-07-09
- Branch: main(經使用者核准直接於 main 修改)
- Status: Archived
- Completed: 2026-07-09 15:01

## Goals

1. **Q2 — 可取消日 label 並不保留其空間**:目前日期格寫死 `h-[52px]` 永遠保留節日名稱空間。新增設定讓「不顯示 label 時月曆緊湊」。
2. **Q4 — 各國語系顯示**:週名/月名/年月標題目前寫死中文。新增 `locale` 支援(用 `Intl`),並在 playground 做「切換各國語系」範例。

## Architecture

### Q2：內容驅動高度 + `showDayLabel` prop（依使用者 #3）

- **`Internal/Calendar.vue`**:
  - **移除固定 `h-[52px]`**，日期格改為高度隨內容(日期圓 span + 選填 label span 已分離)。
    → 有 label 的列自然變高(grid row 自動撐開)、無 label 時緊湊，不再永遠保留空間。
  - 新增 `showDayLabel?: boolean`(預設 `true`):`false` 時**永不渲染 label**(明確關閉、強制緊湊)。
  - `isHoliday`(紅字)獨立不受影響。
- **`DateV2.vue` / `DateRangeV2.vue`**:轉發 `showDayLabel`。

### Q4：`locale` + `weekStartsOn` + 自訂 formatter（依使用者 #1 #2 #4）

- **`Internal/Calendar.vue`**:
  - `locale?: string`(BCP47)。**未給 → 維持寫死中文**(預設中文、向後相容);給了 → 走 `Intl`。
  - `weekStartsOn?: 0 | 1`(0=週日、1=週一，預設 0)。
  - **自訂置換 function props**(最高優先，覆蓋 locale/預設):
    - `weekdayFormatter?: (date: Date, index: number) => string`
    - `monthFormatter?: (monthIndex: number) => string`（月份選擇格 + 月標題）
    - `yearFormatter?: (year: number) => string`（年標題）
  - `computed` 產生(優先序 **自訂 fn > locale(Intl) > 預設中文**):
    - **週名**：`Intl.DateTimeFormat(locale, { weekday: 'short' })`，依 `weekStartsOn` 旋轉。
    - **月名**：`Intl.DateTimeFormat(locale, { month: 'long' })` × 12。
    - **年/月標題**：`{ year: 'numeric' }` / `{ month: 'long' }`（取代寫死 `年 / 月`）。
  - `startOfWeek(date, { weekStartsOn })` 對齊週起始。
  - 註:`Intl` 涵蓋所有語系(含 th-TH 佛曆年);**RTL 版面不在範圍**（文字用 Intl、佈局維持 LTR）。
- **`DateV2.vue` / `DateRangeV2.vue`**:轉發 `locale` / `weekStartsOn` / 三個 formatter。

### Demo 語系集

繁中 `zh-Hant-TW`、簡中 `zh-Hans-CN`、英 `en-US`、日 `ja-JP`、韓 `ko-KR`、泰 `th-TH`(佛曆特例)、阿拉伯 `ar`(RTL 文字，標註佈局未 RTL)。

### Playground demo

- 於 Date 展示區加一個 DatePicker + 一排語系切換鈕(台灣 `zh-Hant-TW`、日本 `ja-JP`、美國 `en-US`、韓國 `ko-KR`…),
  綁 `:locale` + `:week-starts-on`,展示週名/月名/年月標題隨語系變化;另示範 `:show-day-label="false"` 的緊湊版。

## Impact Files

| 檔案 | 動作 |
| :--- | :--- |
| `app/components/Camelot/Internal/Calendar.vue` | 新增 `showDayLabel` / `locale` / `weekStartsOn`;週名/月名/標題改 Intl computed;格高條件化 |
| `app/components/Camelot/DateV2.vue` | 轉發三個新 prop |
| `app/components/Camelot/DateRangeV2.vue` | 轉發三個新 prop |
| `.playground/app/pages/index.vue` | 語系切換 + 緊湊版 demo |
| `.kn-project/wiki/features/calendar.md` | Phase 5 補 props 說明 |

## 已定案決定（依使用者）

1. 預設中文(未給 locale → 寫死中文)。
2. 週名用 `weekday: 'short'`。
3. 移除固定格高、改內容驅動;`showDayLabel` 明確關閉。
4. 提供自訂 formatter function props;demo 語系集如上。

## Verification

- Playground 實測:切 zh-Hant-TW / ja-JP / en-US → 週名、月名、年月標題正確變化、週起始正確;
  `showDayLabel=false` 時月曆變緊湊、無 label 空間;`isHoliday` 紅字仍作用;無 console 錯誤。

## Code Style

遵循 `kn:project:code-style`(Composition API、computed 抽離、prop 純型別、去魔法值、Intl 集中)。

## Git Completion Policy

- After user-approved commits, completion will run `git rebase main` 並 `git push --force-with-lease`（若於分支）。
- PR/archive order: Archive automatically triggered on PR request.

## References

- 既有：`Internal/Calendar.vue`（getDayAttributes / CalendarDayAttributes / weekDays / monthNames）
- MDN：`Intl.DateTimeFormat`、`Intl.Locale.weekInfo`
- 相關 Wiki：`.kn-project/wiki/features/calendar.md`

## Tasks (完成)

# Tasks for 2607091145

- [x] 調查 Calendar/DateV2/DateRangeV2 現況(getDayAttributes、寫死中文週/月名、local 時間、格高 52px)
- [x] Q2:Calendar 移除固定 h-[52px]→min-h-10(內容驅動);加 `showDayLabel`(label v-if);DateV2/DateRangeV2 轉發
- [x] Q4:Calendar 加 `locale` / `weekStartsOn` / `weekdayFormatter` / `monthFormatter` / `yearFormatter`;週名/月名/年月標題改 computed(自訂fn > Intl > 預設中文);startOfWeek 帶 weekStartsOn;週名 :key 改 index
- [x] DateV2/DateRangeV2 轉發全部新 prop
- [x] playground:語系切換鈕(繁/簡/英/日/韓/泰/阿)+ 週一起始 switch + 緊湊 switch demo
- [x] 驗證(部分):語系渲染**已證實**(韓文 일월화수목금토/2026년 7월、泰文 อาทิตย์…);無 server/console 錯誤。週起始/緊湊格高因預覽 popup 合成點擊不穩無法自動量測,程式邏輯已 review,需真實瀏覽器目視確認

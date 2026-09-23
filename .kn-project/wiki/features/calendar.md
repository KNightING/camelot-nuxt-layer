# 🗓️ 日期選擇器

## Summary

日期選擇器家族由 `CamelotDateV2`（單日）、`CamelotDateRangeV2`（範圍）與共用的日曆核心 `CamelotInternalCalendar` 組成，日期運算用 date-fns，非中文語系的週名、月名與年標題用 `Intl.DateTimeFormat` 產生。支援節日標記（`getDayAttributes`）、緊湊模式（`showDayLabel`）、週起始日、自訂 formatter 與年／月快速切換；RTL 版面未支援，佈局固定 LTR。

## 運作方式

### 架構

這張圖回答：日期選擇器由哪幾層組成？

```json diagram id=圖1
{
  "type": "flow",
  "dir": "TD",
  "title": "日期選擇器架構",
  "desc": "DateV2 與 DateRangeV2 都內嵌共用日曆核心，核心再依賴 date-fns 與 Intl",
  "nodes": [
    {"id": "User", "text": "消費端頁面", "shape": "stadium"},
    {"id": "DateV2", "text": "DateV2\n單日選擇"},
    {"id": "DateRangeV2", "text": "DateRangeV2\n範圍選擇"},
    {"id": "Calendar", "text": "日曆核心", "key": true},
    {"id": "DateFns", "text": "date-fns\n日期運算", "kind": "ext"},
    {"id": "Intl", "text": "Intl\n語系名稱", "kind": "ext"}
  ],
  "edges": [
    {"from": "User", "to": "DateV2", "label": "v-model"},
    {"from": "User", "to": "DateRangeV2", "label": "v-model"},
    {"from": "DateV2", "to": "Calendar", "label": "一個月曆"},
    {"from": "DateRangeV2", "to": "Calendar", "label": "一或兩個月曆"},
    {"from": "Calendar", "to": "DateFns"},
    {"from": "Calendar", "to": "Intl"}
  ]
}
```

![日期選擇器架構](calendar.圖1.svg)

1. DateV2 與 DateRangeV2 負責觸發輸入框、浮層、時間列與「確認」鈕；日曆核心只負責月曆格與年／月選擇。
2. 兩個外層元件把語系、週起始日、formatter、節日回呼與 `showDayLabel` 原樣轉發給日曆核心，並轉發所有 slot。
3. 日曆核心內建的時間區一律以 `hideTime` 關閉，時間列改由外層放在月曆下方，與「確認」鈕同一區塊。
4. DateRangeV2 在 `multiCalendars` 開啟且非手機寬度時並排兩個月曆：左月曆隱藏下個月箭頭與下個月日期格，右月曆隱藏上個月的。

來源：1. [Calendar.vue][]　2. [DateV2.vue][]　3. [DateRangeV2.vue][]

### 單日選擇

這張圖回答：使用者點一個日期後，值怎麼回到頁面？

```json diagram id=圖3
{
  "type": "sequence",
  "title": "單日選擇",
  "desc": "點日期格後日曆核心更新 modelValue，DateV2 寫回 v-model；未啟用時間時自動關閉浮層",
  "actors": ["User", "DateV2", "Calendar"],
  "steps": [
    {"from": "User", "to": "DateV2", "text": "點擊輸入框"},
    {"from": "DateV2", "to": "Calendar", "text": "開啟浮層並顯示月曆"},
    {"from": "User", "to": "Calendar", "text": "點擊日期格"},
    {"from": "Calendar", "to": "Calendar", "text": "套用時間並選定日期"},
    {"from": "Calendar", "to": "DateV2", "text": "更新 modelValue", "reply": true},
    {"from": "DateV2", "to": "User", "text": "寫回 v-model，無時間則關閉", "reply": true}
  ]
}
```

![單日選擇](calendar.圖3.svg)

1. 點到相鄰月份的日期時，月曆會切到該日期所在的月份。
2. 停用的日期格（`disabled`、早於 `minDate`、晚於 `maxDate`）不可點。
3. 啟用時間時選日期不會關閉浮層；時間列改值即時寫回，「確認」鈕只負責關閉。

來源：1. [Calendar.vue][]　2. [DateV2.vue][]

### 範圍選擇

這張圖回答：兩次點擊怎麼組成起訖日期？

```json diagram id=圖4
{
  "type": "sequence",
  "title": "範圍選擇",
  "desc": "第一次點擊設定起日，第二次點擊依先後排成起訖；兩端都有值時 DateRangeV2 寫回 v-model",
  "actors": ["User", "DateRangeV2", "Calendar"],
  "steps": [
    {"from": "User", "to": "Calendar", "text": "點擊第一個日期"},
    {"from": "Calendar", "to": "Calendar", "text": "rangeValue 設為起日、迄日清空"},
    {"from": "User", "to": "Calendar", "text": "點擊第二個日期"},
    {"from": "Calendar", "to": "Calendar", "text": "較早者為起日、較晚者為迄日"},
    {"from": "Calendar", "to": "DateRangeV2", "text": "更新 rangeValue", "reply": true},
    {"from": "DateRangeV2", "to": "User", "text": "寫回 v-model", "reply": true}
  ]
}
```

![範圍選擇](calendar.圖4.svg)

1. 已有完整起訖時再點一次，會重新開始：新日期成為起日、迄日清空。
2. 並排的兩個月曆共用同一組 `rangeValue`，點哪一個月曆都可以。
3. 起訖兩端都有值才寫回 v-model；`autoApply` 開啟且未啟用時間時自動關閉浮層。

來源：1. [Calendar.vue][]　2. [DateRangeV2.vue][]

### 年月切換

這張圖回答：月曆、年份、月份三種檢視怎麼切換？

```json diagram id=圖2
{
  "type": "state",
  "title": "年月切換",
  "desc": "標題列的年份與月份按鈕切換檢視；選完年份會接著進入月份選擇",
  "entity": "pickerMode",
  "states": [
    {"id": "calendar", "label": "月曆", "type": "start"},
    {"id": "year", "label": "年份選擇", "type": "active"},
    {"id": "month", "label": "月份選擇", "type": "active"}
  ],
  "transitions": [
    {"from": "calendar", "to": "year", "label": "點年份按鈕"},
    {"from": "calendar", "to": "month", "label": "點月份按鈕"},
    {"from": "year", "to": "month", "label": "選擇年份"},
    {"from": "month", "to": "calendar", "label": "選擇月份"},
    {"from": "year", "to": "calendar", "label": "再點年份按鈕", "retry": true}
  ]
}
```

![年月切換](calendar.圖2.svg)

1. 年份頁一次列 12 年，預設從今年往前 5 年起算，左右箭頭一次翻 12 年。
2. 年份頁與月份頁不顯示月曆的左右月份箭頭。
3. `pickerMode` 是 v-model，DateRangeV2 用它讓兩個月曆其中一個進入年／月選擇時，另一個月曆隱藏。

來源：1. [Calendar.vue][]　2. [DateRangeV2.vue][]

## 日曆核心 Props

| Prop | 型別 | 預設值 | 說明 |
| :--- | :--- | :---: | :--- |
| `isRange` | `boolean` | `false` | 範圍選擇模式 |
| `minDate` | `Date \| number` | — | 可選最早日期 |
| `maxDate` | `Date \| number` | — | 可選最晚日期 |
| `hidePrevMonth` | `boolean` | `false` | 隱藏上個月的日期格 |
| `hideNextMonth` | `boolean` | `false` | 隱藏下個月的日期格 |
| `enableTime` | `boolean` | `false` | 顯示時間區 |
| `timePrecision` | `'hour' \| 'minute' \| 'second'` | `'second'` | 時間精細度 |
| `hourFormat` | `'12' \| '24'` | `'24'` | 12 或 24 小時制 |
| `hideTime` | `boolean` | — | 隱藏內建時間區，由外層自行放時間列 |
| `pickerExpand` | `boolean` | — | 年／月選擇時撐滿容器寬度，供雙月曆使用 |
| `hidePrevArrow` | `boolean` | `false` | 隱藏上個月箭頭 |
| `hideNextArrow` | `boolean` | `false` | 隱藏下個月箭頭 |
| `getDayAttributes` | `(date, dayOfWeek) => CalendarDayAttributes \| null \| undefined` | — | 每日屬性回呼，見節日標記 |
| `showDayLabel` | `boolean` | `true` | 顯示日期下方 label；關閉時格高緊湊 |
| `locale` | `string` | — | BCP47 語系；未給或中文語系用預設中文格式 |
| `weekStartsOn` | `0 \| 1` | `0` | 每週起始：0 週日、1 週一 |
| `weekdayFormatter` | `(date, index) => string` | — | 自訂週名，優先序最高 |
| `monthFormatter` | `(monthIndex) => string` | — | 自訂月名，用於月份格與月標題 |
| `yearFormatter` | `(year) => string` | — | 自訂年標題 |

來源：1. [Calendar.vue][]

## v-model

| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `Date \| number \| null` | 單選日期 |
| `rangeValue` | `(Date \| number \| null)[] \| null` | 範圍值，依序為起日、迄日 |
| `viewDate` | `Date`（必填） | 目前顯示的月份 |
| `pickerMode` | `'calendar' \| 'month' \| 'year'` | 目前檢視，預設 `'calendar'` |

來源：1. [Calendar.vue][]

## Slots

| Slot | Scope | 用途 |
| :--- | :--- | :--- |
| `year-label` | `viewDate`、`year` | 標題列年份按鈕文字 |
| `month-label` | `viewDate`、`month` | 標題列月份按鈕文字 |
| `weekday` | `day`、`index` | 週名表頭 |
| `day` | `date`、`day`、`isSelected`、`isToday` | 日期數字 |
| `month-name` | `month`、`index` | 月份選擇格文字 |

DateV2 與 DateRangeV2 會把自己收到的 slot 全部轉給日曆核心，所以在外層元件上直接寫這些 slot 即可。

來源：1. [Calendar.vue][]　2. [DateV2.vue][]

## 規則

### 日期格顏色

| 條件 | 樣式 |
| :--- | :--- |
| 週六、週日或 `isHoliday` | 錯誤色字（紅） |
| 已選取，或區間的起日與迄日 | 依主題的選中表面樣式 |
| 今日 | 目前色彩角色的字色、粗體，左上角小點 |
| 區間中段 | 目前色彩角色 10% 的淡底 |
| 其他當月日期 | 一般表面字色 |
| 相鄰月份日期 | 外框色、半透明 |

1. 選取中的格子一律用選中表面樣式；其餘格子由上往下判斷，週末與假日的紅字優先於今日字色。
2. 選中表面樣式來自各主題的 picker 樣式，日期、月份與年份格共用。
3. 元件的色彩角色由外層元件的 `color` 決定。

來源：1. [Calendar.vue][]　2. [useCamelotPickerTheme.ts][]

### 節日標記

`getDayAttributes` 對每個日期格呼叫一次，回傳的屬性決定這一格的外觀；`isHoliday` 與 `label` 互相獨立。

| 回傳 | 效果 |
| :--- | :--- |
| `{ isHoliday: true }` | 只標紅字，不顯示名稱 |
| `{ label: '國慶' }` | 只顯示節日名，不變紅，代表有節日但不放假 |
| `{ isHoliday: true, label: '春節' }` | 紅字加名稱 |
| `{ disabled: true }` | 該日不可選 |
| `{ dot: true, dotColor }` | 左上角小點，可自訂顏色 |
| `{ labelClass, class }` | label 與日期格的額外 class |

來源：1. [Calendar.vue][]

### 緊湊模式與 label 截斷

1. `showDayLabel` 為 `false` 時不渲染 label，日期格最小高度從 42px 降為 36px。
2. label 固定單行，超出格寬以省略號截斷。
3. 被截斷的 label 在 hover 或觸控長壓時以 Tooltip 顯示完整文字；沒被截斷的不出現 Tooltip。
4. Tooltip 會 teleport 進 picker 的 dialog，dialog 模式下也看得到。

來源：1. [Calendar.vue][]

### 語系與週起始

| 規則 | 說明 |
| :--- | :--- |
| 優先序 | 自訂 formatter 優先，其次非中文語系的 Intl，最後是預設中文 |
| 未給 `locale` | 用預設中文：週名「日一二」、月名「一月」、標題「2026年」「09月」 |
| 中文語系 | 繁、簡中文都用預設中文格式，避免 Intl 的中文週名帶「週」或「周」 |
| 非中文語系 | 週名用短格式、月名用完整月名，年標題用數字年 |
| `weekStartsOn` | 同時決定月曆起始欄與週名順序 |
| 佛曆 | 泰文語系由 Intl 顯示佛曆年 |
| RTL | 未支援，佈局固定 LTR |

來源：1. [Calendar.vue][]

## 相關頁面

- [DateV2](./components/DateV2.md)
- [DateRangeV2](./components/DateRangeV2.md)
- [Internal/Calendar](./components/Internal-Calendar.md)
- [TimeV2 時間選擇器](./time-picker.md)
- [Tooltip](./components/Tooltip.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Calendar.vue | [app/components/Camelot/Internal/Calendar.vue](../../../app/components/Camelot/Internal/Calendar.vue) |
| DateV2.vue | [app/components/Camelot/DateV2.vue](../../../app/components/Camelot/DateV2.vue) |
| DateRangeV2.vue | [app/components/Camelot/DateRangeV2.vue](../../../app/components/Camelot/DateRangeV2.vue) |
| useCamelotPickerTheme.ts | [app/composables/useCamelotPickerTheme.ts](../../../app/composables/useCamelotPickerTheme.ts) |

[Calendar.vue]: #references
[DateV2.vue]: #references
[DateRangeV2.vue]: #references
[useCamelotPickerTheme.ts]: #references

---
[⚙️ Env](../environment.md) | [🏠 Wiki](../index.md)

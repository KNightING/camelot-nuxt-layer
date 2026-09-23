# Calendar

## Summary

Calendar（匯入名稱 `CamelotInternalCalendar`）是日期選擇器共用的月曆核心，屬內部元件，由 DateV2 與 DateRangeV2 包裝使用。它提供日曆、月份、年份三種視圖，支援單選與區間選取、時間列、語系與週起始，並可逐日自訂節日、標籤、停用與圓點。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `isRange` | `boolean` | - | 區間選取模式 |
| `minDate` | `Date \| number` | - | 可選最小日期 |
| `maxDate` | `Date \| number` | - | 可選最大日期 |
| `hidePrevMonth` | `boolean` | `false` | 隱藏上個月的溢出日 |
| `hideNextMonth` | `boolean` | `false` | 隱藏下個月的溢出日 |
| `enableTime` | `boolean` | `false` | 是否顯示時間列 |
| `timePrecision` | `'hour' \| 'minute' \| 'second'` | `'second'` | 時間精細度，由秒往上關閉 |
| `hourFormat` | `'12' \| '24'` | `'24'` | 12 或 24 小時制 |
| `hideTime` | `boolean` | - | 啟用時間但不在月曆內顯示時間列，交給外層自行擺放 |
| `pickerExpand` | `boolean` | - | 進入月份或年份選擇時撐滿容器寬並置中，供雙月曆使用 |
| `hidePrevArrow` | `boolean` | `false` | 隱藏上一月箭頭 |
| `hideNextArrow` | `boolean` | `false` | 隱藏下一月箭頭 |
| `getDayAttributes` | `(date: Date, dayOfWeek: number) => CalendarDayAttributes \| undefined \| null` | - | 逐日自訂屬性 |
| `showDayLabel` | `boolean` | `true` | 是否顯示日期下方 label；關閉則不渲染、格高緊湊 |
| `locale` | `string` | - | BCP47 語系；未給用預設中文 |
| `weekStartsOn` | `0 \| 1` | `0` | 週起始：0 為週日、1 為週一 |
| `weekdayFormatter` | `(date: Date, index: number) => string` | - | 自訂週名，最高優先 |
| `monthFormatter` | `(monthIndex: number) => string` | - | 自訂月名，用於月份選擇格與月標題 |
| `yearFormatter` | `(year: number) => string` | - | 自訂年標題 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model:modelValue` | `Date \| number \| null` | 單選日期 |
| `v-model:rangeValue` | `(Date \| number \| null)[] \| null` | 區間日期，依序為起、迄 |
| `v-model:viewDate` | `Date` | 目前檢視的月份，必填 |
| `v-model:pickerMode` | `'calendar' \| 'month' \| 'year'` | 目前視圖，預設 `'calendar'` |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `year-label` | `{ viewDate, year }` | 自訂標頭年份按鈕，預設「yyyy年」 |
| `month-label` | `{ viewDate, month }` | 自訂標頭月份按鈕，預設「MM月」 |
| `weekday` | `{ day, index }` | 自訂週名格 |
| `day` | `{ date, day, isSelected, isToday }` | 自訂日期數字 |
| `month-name` | `{ month, index }` | 自訂月份選擇格 |

## CalendarDayAttributes

getDayAttributes 回傳的型別，由本元件匯出：

| 欄位 | 型別 | 說明 |
| :--- | :--- | :--- |
| `isHoliday` | `boolean` | 標記為節日，數字顯示為 error 色 |
| `label` | `string \| null` | 日期下方標籤文字 |
| `labelClass` | `string` | 標籤自訂 class |
| `disabled` | `boolean` | 停用該日 |
| `dot` | `boolean` | 顯示圓點標記 |
| `dotColor` | `string` | 圓點顏色 |
| `class` | `string` | 日格自訂 class |

## 運作方式

### 三種視圖

1. 點標頭年份按鈕切到年份選擇，一頁 12 年，從今年往前 5 年起算，可前後翻頁。
2. 選完年份自動進入月份選擇。
3. 點標頭月份按鈕切到月份選擇，選完回到日曆。
4. 再點一次同一個標頭按鈕會直接回到日曆。

來源：1. [Calendar.vue][]

### 日格

每月固定渲染 42 格，從該月第一週的週起始日開始；溢出日依 hidePrevMonth、hideNextMonth 決定是否可見。

| 狀態 | 外觀 |
| :--- | :--- |
| 選中，含區間起迄 | 主題的選中實色底，數字加粗 |
| 區間中段 | 角色色淡底 |
| 週六、週日或節日 | 數字為 error 色 |
| 今天 | 數字為角色色並加粗 |
| 本月其他日 | 主要文字色 |
| 溢出日 | 淡化 |

早於 minDate、晚於 maxDate 或屬性標記停用的日期不可點。點溢出日時，檢視月份跟著切到該月。

日期下方的 label 固定單行，截斷時懸停或長壓以 [Tooltip](./Tooltip.md) 顯示完整內容。

來源：1. [Calendar.vue][]

### 選取

| 模式 | 行為 |
| :--- | :--- |
| 單選 | 點日期寫入 modelValue；啟用時間時一併套上時間列目前的時間 |
| 區間，尚未有起日或已選滿 | 點選的日期成為新起日，迄日清空 |
| 區間，已有起日 | 點選的日期成為迄日；早於起日時兩者自動對調 |

時間列調整會即時寫回單選值，或寫回區間的起迄端點。

來源：1. [Calendar.vue][]

### 語系

週名、月名與年月標題的優先序：

1. 自訂 formatter。
2. 有 locale 且不是 zh 開頭時，用 Intl 產生。
3. 其他情況用內建中文：日一二三、一月到十二月、yyyy年、MM月。

中文語系一律走內建格式，避免 Intl 的中文週名帶「週」「周」前綴。

來源：1. [Calendar.vue][]

## 相關頁面

- [DateV2](./DateV2.md)
- [DateRangeV2](./DateRangeV2.md)
- [TimeRow](./Internal-TimeRow.md)
- [月曆與日期選擇](../calendar.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Calendar.vue | [app/components/Camelot/Internal/Calendar.vue](../../../../app/components/Camelot/Internal/Calendar.vue) |

[Calendar.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

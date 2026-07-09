# DateRangeV2

> 日期區間選擇器：桌機雙月曆、手機單月曆，支援起迄時間、語系與自訂觸發器。

**匯入名稱**：`CamelotDateRangeV2`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `minDate` | `Date \| number` | - | 可選最小日期 |
| `maxDate` | `Date \| number` | - | 可選最大日期 |
| `placeholder` | `string` | `'Select Date Range'` | 未選值時的提示文字 |
| `disabled` | `boolean` | - | 停用 |
| `isError` | `boolean` | - | 錯誤態（紅色邊框） |
| `showType` | `'auto' \| 'popup' \| 'dialog'` | `'auto'` | 呈現方式；auto 依裝置（手機 dialog、桌機 popup） |
| `selectZIndex` | `number` | - | 浮層 z-index |
| `multiCalendars` | `boolean` | `true` | 桌機是否顯示雙月曆 |
| `autoApply` | `boolean` | `true` | 選滿起迄即自動套用（未含時間時並關閉浮層） |
| `displayFormat` | `(dates: [Date, Date]) => string` | - | 自訂顯示字串（覆蓋預設「起 ~ 迄」） |
| `format` | `string` | `'yyyy-MM-dd'` | 日期格式字串（含時間時自動延伸） |
| `enableTime` | `boolean` | `false` | 是否啟用起/迄時間 |
| `timePrecision` | `'hour' \| 'minute' \| 'second'` | `'second'` | 時間精細度（由下往上關閉） |
| `hourFormat` | `'12' \| '24'` | `'24'` | 12 或 24 小時制 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色 |
| `label` | `string` | - | 欄位標籤 |
| `required` | `boolean` | - | 標籤旁顯示必填星號 |
| `getDayAttributes` | `(date: Date, dayOfWeek: number) => CalendarDayAttributes \| undefined \| null` | - | 逐日自訂屬性 |
| `showDayLabel` | `boolean` | `true` | 是否顯示日期下方 label；關閉則不渲染、格高緊湊 |
| `locale` | `string` | - | BCP47 語系（未給→預設中文） |
| `weekStartsOn` | `0 \| 1` | `0` | 週起始：0=週日、1=週一 |
| `weekdayFormatter` | `(date: Date, index: number) => string` | - | 自訂週名 |
| `monthFormatter` | `(monthIndex: number) => string` | - | 自訂月名 |
| `yearFormatter` | `(year: number) => string` | - | 自訂年標題 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model`（預設） | `[Date, Date] \| null` | 選中的日期區間（起、迄） |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | `{ displayValue, open, disabled, toggle }` | 自訂觸發器（未提供時使用內建起~迄輸入框） |
| 透傳插槽 | 依 `CamelotInternalCalendar` | 其餘 `$slots` 透傳給內部月曆 |

## 備註
- 選取邏輯：第一次點選設起日、第二次設迄日；若第二點早於第一點會自動對調。
- 桌機雙月曆時，任一月曆進入月/年選擇會隱藏另一個並釘住列寬，讓選擇器橫跨兩月曆置中。
- 啟用時間時起/迄時間列與「確認」置於月曆下方，時間即時 commit；含時間時不自動關閉浮層。
- 手機且含時間時，觸發器改為起/迄垂直顯示（各帶「起」「迄」標籤）。
- 觸發器 input 寬度依內容自適應（最小 14ch）。

---
[🏠 Wiki](../index.md)

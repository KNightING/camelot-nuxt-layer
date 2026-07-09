# Internal/Calendar

> 月曆核心元件：日/月/年三視圖，支援單選/區間、時間、語系、逐日自訂屬性。（內部元件）

**匯入名稱**：`CamelotInternalCalendar`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `isRange` | `boolean` | - | 區間選擇模式 |
| `minDate` | `Date \| number` | - | 可選最小日期 |
| `maxDate` | `Date \| number` | - | 可選最大日期 |
| `hidePrevMonth` | `boolean` | `false` | 隱藏上個月的溢出日 |
| `hideNextMonth` | `boolean` | `false` | 隱藏下個月的溢出日 |
| `enableTime` | `boolean` | `false` | 是否顯示時間選擇區 |
| `timePrecision` | `'hour' \| 'minute' \| 'second'` | `'second'` | 時間精細度（由下往上關閉） |
| `hourFormat` | `'12' \| '24'` | `'24'` | 12 或 24 小時制 |
| `hideTime` | `boolean` | - | 隱藏時間區（多月曆 range 時只在其中一個顯示） |
| `pickerExpand` | `boolean` | - | 進入月/年選擇時撐滿容器寬並置中（多月曆 range 用） |
| `hidePrevArrow` | `boolean` | `false` | 隱藏上一月箭頭 |
| `hideNextArrow` | `boolean` | `false` | 隱藏下一月箭頭 |
| `getDayAttributes` | `(date: Date, dayOfWeek: number) => CalendarDayAttributes \| undefined \| null` | - | 逐日自訂屬性（節日/label/停用/圓點/class） |
| `showDayLabel` | `boolean` | `true` | 是否顯示日期下方 label；關閉則不渲染、格高緊湊 |
| `locale` | `string` | - | BCP47 語系；未給→預設中文，給了以 Intl 產生週/月/年月名 |
| `weekStartsOn` | `0 \| 1` | `0` | 週起始：0=週日、1=週一 |
| `weekdayFormatter` | `(date: Date, index: number) => string` | - | 自訂週名（最高優先） |
| `monthFormatter` | `(monthIndex: number) => string` | - | 自訂月名（月份選擇格 + 月標題） |
| `yearFormatter` | `(year: number) => string` | - | 自訂年標題 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model:modelValue` | `Date \| number \| null` | 單選日期 |
| `v-model:rangeValue` | `(Date \| number \| null)[] \| null` | 區間日期（起、迄） |
| `v-model:viewDate` | `Date` | 當前檢視月份（`required`） |
| `v-model:pickerMode` | `'calendar' \| 'month' \| 'year'` | 當前視圖模式（預設 `'calendar'`） |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `year-label` | `{ viewDate, year }` | 自訂標頭年份按鈕（預設 `yyyy年`） |
| `month-label` | `{ viewDate, month }` | 自訂標頭月份按鈕（預設 `MM月`） |
| `weekday` | `{ day, index }` | 自訂週名格 |
| `day` | `{ date, day, isSelected, isToday }` | 自訂日期數字 |
| `month-name` | `{ month, index }` | 自訂月份選擇格 |

## 型別
`CalendarDayAttributes`（本檔 `export`）：
| 欄位 | 型別 | 說明 |
| :--- | :--- | :--- |
| `isHoliday` | `boolean` | 標記為節日（顯示為 error 色） |
| `label` | `string \| null` | 日期下方標籤文字 |
| `labelClass` | `string` | label 自訂 class |
| `disabled` | `boolean` | 停用該日 |
| `dot` | `boolean` | 顯示圓點標記 |
| `dotColor` | `string` | 圓點顏色 |
| `class` | `string` | 日格自訂 class |

## 備註
- 三視圖：日曆（`calendar`）、月份選擇（`month`）、年份選擇（`year`）；點標頭年/月按鈕切換。
- 每月固定渲染 42 格；溢出日依 `hidePrevMonth`/`hideNextMonth` 控制可見性。
- 區間選取：第一次點設起日、第二次設迄日，若迄早於起會自動對調；區間內日格帶淡底色。
- 時間選擇以 `CamelotInternalTimeRow` 呈現；單選套用至 `modelValue`，區間分別套用至起/迄端點。
- 週末（週日/週六）與節日顯示為 error 色；今日/選中顯示為 current-color。
- 語系：有 `locale` 且非中文（非 `zh` 開頭）才走 `Intl`；中文一律用內建格式。
- 年份頁以 12 年為一頁，可翻頁。

---
[🏠 Wiki](../index.md)

# DateV2

> 日期選擇器：以彈窗或對話框呈現月曆，支援時間、語系、自訂日格屬性與週起始。

**匯入名稱**：`CamelotDateV2`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `minDate` | `Date \| number` | - | 可選最小日期 |
| `maxDate` | `Date \| number` | - | 可選最大日期 |
| `disableDaysOfWeekList` | `number[]` | - | 停用的星期清單 |
| `isError` | `boolean` | - | 錯誤態（紅色邊框） |
| `placeholder` | `string` | `'YYYY-MM-DD'` | 未選值時的提示文字 |
| `allowedDates` | `string[] \| Date[]` | - | 允許的日期白名單 |
| `disabled` | `boolean` | - | 停用 |
| `showType` | `'auto' \| 'popup' \| 'dialog'` | `'auto'` | 呈現方式；auto 依裝置（手機 dialog、桌機 popup） |
| `selectZIndex` | `number` | - | 浮層 z-index |
| `enableTime` | `boolean` | `false` | 是否啟用時間選擇 |
| `timePrecision` | `'hour' \| 'minute' \| 'second'` | `'second'` | 時間精細度（由下往上關閉） |
| `hourFormat` | `'12' \| '24'` | `'24'` | 12 或 24 小時制 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色 |
| `label` | `string` | - | 欄位標籤 |
| `required` | `boolean` | - | 標籤旁顯示必填星號 |
| `getDayAttributes` | `(date: Date, dayOfWeek: number) => CalendarDayAttributes \| undefined \| null` | - | 逐日自訂屬性（節日/標記/停用/圓點等） |
| `showDayLabel` | `boolean` | `true` | 是否顯示日期下方 label；關閉則不渲染、格高緊湊 |
| `locale` | `string` | - | BCP47 語系（未給→預設中文；給了走 Intl 產生週/月/年月名） |
| `weekStartsOn` | `0 \| 1` | `0` | 週起始：0=週日、1=週一 |
| `weekdayFormatter` | `(date: Date, index: number) => string` | - | 自訂週名（覆蓋 locale/預設） |
| `monthFormatter` | `(monthIndex: number) => string` | - | 自訂月名 |
| `yearFormatter` | `(year: number) => string` | - | 自訂年標題 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model`（預設） | `Date \| number` | 選中的日期時間 |
| `v-model:input` | `string` | 觸發器輸入框顯示字串（依格式格式化） |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| 透傳插槽 | 依 `CamelotInternalCalendar` | 所有 `$slots` 透傳給內部月曆（如 `day`、`weekday`、`month-label`、`year-label`、`month-name` 等） |

## 備註
- v-model 型別為 `Date | number`；輸入框唯讀，顯示格式依 `enableTime` / `timePrecision` / `hourFormat` 組出（如 `yyyy-MM-dd HH:mm:ss`）。
- 啟用時間時，時間列（`CamelotInternalTimeRow`）與「確認」按鈕置於月曆下方；月曆本身設 `hide-time`。時間變動即時 commit 至 model。
- 未啟用時間時，選日即關閉浮層；啟用時間時保持開啟以便調整，按確認或點外部關閉。
- 開啟時同步 `viewDate` 到當前 model 值。

---
[🏠 Wiki](../index.md)

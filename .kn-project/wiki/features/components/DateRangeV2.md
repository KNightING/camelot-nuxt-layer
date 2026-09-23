# DateRangeV2

## Summary

DateRangeV2（匯入名稱 `CamelotDateRangeV2`）是日期區間選擇器：點觸發欄位開啟月曆，依序點選起日與迄日，桌機預設並排雙月曆、手機單月曆。可連同起迄時間一起選，支援語系、逐日自訂屬性與自訂觸發器；觸發欄位外觀與同主題的 Input 一致，標題由 FieldLabel 渲染。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `minDate` | `Date \| number` | - | 可選最小日期 |
| `maxDate` | `Date \| number` | - | 可選最大日期 |
| `placeholder` | `string` | `'Select Date Range'` | 自訂觸發器拿到的 displayValue 在未選滿時的文字；內建觸發欄位固定顯示「請選擇起日」「請選擇迄日」 |
| `disabled` | `boolean` | - | 停用 |
| `isError` | `boolean` | - | 錯誤態，觸發欄位邊框改為 error 色 |
| `showType` | `'auto' \| 'popup' \| 'dialog'` | `'auto'` | 呈現方式；auto 在手機用 dialog、桌機用 popup |
| `selectZIndex` | `number` | - | 浮層 z-index |
| `multiCalendars` | `boolean` | `true` | 桌機是否顯示雙月曆 |
| `autoApply` | `boolean` | `true` | 選滿起迄後是否自動關閉；只在不含時間時生效 |
| `displayFormat` | `(dates: [Date, Date]) => string` | - | 自訂 displayValue 字串，覆蓋預設的「起 ~ 迄」 |
| `format` | `string` | `'yyyy-MM-dd'` | 日期格式；含時間時自動在後面接上時間格式 |
| `enableTime` | `boolean` | `false` | 是否同時選擇起迄時間 |
| `timePrecision` | `'hour' \| 'minute' \| 'second'` | `'second'` | 時間精細度，由秒往上關閉 |
| `hourFormat` | `'12' \| '24'` | `'24'` | 12 或 24 小時制 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色 |
| `label` | `string` | - | 欄位標題，由 FieldLabel 渲染 |
| `required` | `boolean` | - | 標題旁顯示必填星號 |
| `getDayAttributes` | `(date: Date, dayOfWeek: number) => CalendarDayAttributes \| undefined \| null` | - | 逐日自訂屬性 |
| `showDayLabel` | `boolean` | `true` | 是否顯示日期下方 label；關閉則不渲染、格高緊湊 |
| `locale` | `string` | - | BCP47 語系；未給用預設中文 |
| `weekStartsOn` | `0 \| 1` | `0` | 週起始：0 為週日、1 為週一 |
| `weekdayFormatter` | `(date: Date, index: number) => string` | - | 自訂週名 |
| `monthFormatter` | `(monthIndex: number) => string` | - | 自訂月名 |
| `yearFormatter` | `(year: number) => string` | - | 自訂年標題 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model`（預設） | `[Date, Date] \| null` | 選中的日期區間，依序為起、迄 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | `{ displayValue, open, disabled, toggle }` | 自訂觸發器；未提供時使用內建起迄欄位 |
| 透傳插槽 | 依 [Calendar](./Internal-Calendar.md) | 其餘插槽原樣轉給內部月曆 |

## 運作方式

### 觸發欄位

內建觸發欄位是唯讀的起、迄兩格，前方有月曆圖示，點整個欄位即開關月曆。

| 項目 | 行為 |
| :--- | :--- |
| 高度 | 最低 42px，字級放大時跟著變高 |
| 圖示 | 大小以 em 計，跟著字級縮放 |
| Material | Filled 樣式：上圓角、底線，開啟時底線轉為角色色 |
| Cupertino | 無可見框線的填色底，開啟時內框轉為角色色 |
| Aqua | 玻璃軌道底，開啟時發光 |
| Sci-Fi | 外層包 HUD 外框，開啟時外框進入聚焦態 |
| 輸入格寬度 | 依顯示內容自適應，最少 14 個字元寬 |
| 手機且含時間 | 起迄改為上下兩行，各帶「起」「迄」標籤 |

觸發欄位是 label 元素且阻止預設點擊行為：否則點到圖示或分隔符時，瀏覽器會再對內層輸入框補發一次點擊，把剛開的月曆又關掉。

來源：1. [DateRangeV2.vue][]　2. [useCamelotPickerTheme.ts][]　3. [FieldFrame.vue][]

### 選取流程

1. 每次開啟都回到日曆視圖，檢視月份跳到目前的起日，沒有值則為本月。
2. 第一次點選設起日，第二次設迄日；第二次早於起日時兩者自動對調。
3. 起迄都選好即寫回 v-model。
4. 不含時間且 autoApply 開啟時，隨即關閉月曆。
5. 含時間時月曆保持開啟，起迄時間調整即時寫回，按「確認」或點外部才關閉。

來源：1. [DateRangeV2.vue][]　2. [Calendar.vue][]

### 單月曆與雙月曆

第二個月曆只在開啟 multiCalendars 且非手機時顯示。只剩一個月曆時，它同時保留上一月與下一月箭頭。

雙月曆時，任一月曆進入月份或年份選擇會隱藏另一個，並釘住原本的列寬，讓選擇器橫跨兩個月曆置中。

啟用時間時，起迄時間列放在月曆下方：雙月曆時左右並排，單月曆時垂直堆疊，旁邊是「確認」按鈕。

來源：1. [DateRangeV2.vue][]

### 手機對話框

showType 為 auto 時，手機斷點改用置中的 [BaseDialogV2](./BaseDialogV2.md) 呈現月曆，桌機用浮層。

1. 對話框本身已有主題外框，月曆不再疊一層面板樣式。
2. 對話框內容最高 82dvh，超過時可捲動，極小或橫向螢幕也能看到完整月曆。
3. 點外部關閉只在浮層模式生效；對話框模式由對話框自行處理遮罩與 Esc。

來源：1. [DateRangeV2.vue][]

## 相關頁面

- [DateV2](./DateV2.md)
- [FieldFrame](./Internal-FieldFrame.md)
- [FieldLabel](./FieldLabel.md)
- [月曆與日期選擇](../calendar.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| DateRangeV2.vue | [app/components/Camelot/DateRangeV2.vue](../../../../app/components/Camelot/DateRangeV2.vue) |
| useCamelotPickerTheme.ts | [app/composables/useCamelotPickerTheme.ts](../../../../app/composables/useCamelotPickerTheme.ts) |
| FieldFrame.vue | [app/components/Camelot/Internal/FieldFrame.vue](../../../../app/components/Camelot/Internal/FieldFrame.vue) |
| Calendar.vue | [app/components/Camelot/Internal/Calendar.vue](../../../../app/components/Camelot/Internal/Calendar.vue) |

[DateRangeV2.vue]: #references
[useCamelotPickerTheme.ts]: #references
[FieldFrame.vue]: #references
[Calendar.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

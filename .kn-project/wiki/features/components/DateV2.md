# DateV2

## Summary

DateV2（匯入名稱 `CamelotDateV2`）是單一日期選擇器：點觸發欄位開啟月曆，桌機以浮層、手機以置中對話框呈現，可選擇是否連時間一起選。支援語系、週起始、逐日自訂屬性與月曆插槽透傳；觸發欄位的外觀與同主題的 Input 一致，標題由 FieldLabel 渲染。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `minDate` | `Date \| number` | - | 可選最小日期 |
| `maxDate` | `Date \| number` | - | 可選最大日期 |
| `disableDaysOfWeekList` | `number[]` | - | 已宣告但元件未使用，傳入無效果 |
| `isError` | `boolean` | - | 錯誤態，觸發欄位邊框改為 error 色 |
| `placeholder` | `string` | `'YYYY-MM-DD'` | 未選值時的提示文字 |
| `allowedDates` | `string[] \| Date[]` | - | 已宣告但元件未使用，傳入無效果 |
| `disabled` | `boolean` | - | 停用 |
| `showType` | `'auto' \| 'popup' \| 'dialog'` | `'auto'` | 呈現方式；auto 在手機用 dialog、桌機用 popup |
| `selectZIndex` | `number` | - | 浮層 z-index |
| `enableTime` | `boolean` | `false` | 是否同時選擇時間 |
| `timePrecision` | `'hour' \| 'minute' \| 'second'` | `'second'` | 時間精細度，由秒往上關閉 |
| `hourFormat` | `'12' \| '24'` | `'24'` | 12 或 24 小時制 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色 |
| `label` | `string` | - | 欄位標題，由 FieldLabel 渲染 |
| `required` | `boolean` | - | 標題旁顯示必填星號 |
| `getDayAttributes` | `(date: Date, dayOfWeek: number) => CalendarDayAttributes \| undefined \| null` | - | 逐日自訂屬性，如節日、標記、停用、圓點 |
| `showDayLabel` | `boolean` | `true` | 是否顯示日期下方 label；關閉則不渲染、格高緊湊 |
| `locale` | `string` | - | BCP47 語系；未給用預設中文 |
| `weekStartsOn` | `0 \| 1` | `0` | 週起始：0 為週日、1 為週一 |
| `weekdayFormatter` | `(date: Date, index: number) => string` | - | 自訂週名，優先於 locale |
| `monthFormatter` | `(monthIndex: number) => string` | - | 自訂月名 |
| `yearFormatter` | `(year: number) => string` | - | 自訂年標題 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model`（預設） | `Date \| number` | 選中的日期時間 |
| `v-model:input` | `string` | 觸發欄位顯示的格式化字串 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| 透傳插槽 | 依 [Calendar](./Internal-Calendar.md) | 所有插槽原樣轉給內部月曆，如 `day`、`weekday`、`month-name` |

## 運作方式

### 觸發欄位

觸發欄位是唯讀輸入框，前方有月曆圖示，點整個欄位即開關月曆。

| 項目 | 行為 |
| :--- | :--- |
| 高度 | 最低 42px，字級放大時跟著變高 |
| 圖示 | 大小以 em 計，跟著字級縮放 |
| Material | Filled 樣式：上圓角、底線，開啟時底線轉為角色色 |
| Cupertino | 無可見框線的填色底，開啟時內框轉為角色色 |
| Aqua | 玻璃軌道底，開啟時發光 |
| Sci-Fi | 外層包 HUD 外框，開啟時外框進入聚焦態 |

觸發欄位是 label 元素且阻止預設點擊行為：否則點到圖示時，瀏覽器會再對內層輸入框補發一次點擊，把剛開的月曆又關掉。

來源：1. [DateV2.vue][]　2. [useCamelotPickerTheme.ts][]　3. [FieldFrame.vue][]

### 顯示格式

輸入框顯示字串依是否含時間組成：

| 設定 | 格式 |
| :--- | :--- |
| 不含時間 | `yyyy-MM-dd` |
| 含時間、24 小時制、秒 | `yyyy-MM-dd HH:mm:ss` |
| 含時間、12 小時制 | 時改為 hh，結尾加上午下午標記 |

時間精細度為 hour 時省略分與秒，為 minute 時省略秒。

來源：1. [DateV2.vue][]

### 選取流程

1. 開啟月曆時，檢視月份跳到目前選中的日期。
2. 不含時間：點日期即寫回 v-model 並關閉。
3. 含時間：月曆下方出現時間列與「確認」按鈕，選日期與調時間都即時寫回 v-model。
4. 含時間時月曆保持開啟，按「確認」或點外部才關閉。

來源：1. [DateV2.vue][]

### 手機對話框

showType 為 auto 時，手機斷點改用置中的 [BaseDialogV2](./BaseDialogV2.md) 呈現月曆，桌機用浮層。

1. 對話框本身已有主題外框，月曆不再疊一層面板樣式。
2. 對話框內容最高 82dvh，超過時可捲動，極小或橫向螢幕也能看到完整月曆。
3. 點外部關閉只在浮層模式生效；對話框模式由對話框自行處理遮罩與 Esc。

浮層的落影畫在外層容器上並對齊面板圓角，避免被內層的裁切容器切出方角。

來源：1. [DateV2.vue][]

## 相關頁面

- [DateRangeV2](./DateRangeV2.md)
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
| DateV2.vue | [app/components/Camelot/DateV2.vue](../../../../app/components/Camelot/DateV2.vue) |
| useCamelotPickerTheme.ts | [app/composables/useCamelotPickerTheme.ts](../../../../app/composables/useCamelotPickerTheme.ts) |
| FieldFrame.vue | [app/components/Camelot/Internal/FieldFrame.vue](../../../../app/components/Camelot/Internal/FieldFrame.vue) |

[DateV2.vue]: #references
[useCamelotPickerTheme.ts]: #references
[FieldFrame.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

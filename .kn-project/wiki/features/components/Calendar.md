# Calendar

## Summary

Calendar 是可以直接放在頁面上的行內日曆，匯入名稱 `CamelotCalendar`，把內部日曆核心包成公開元件。單日選取，可標記忙碌小點與節日，面板外觀與日期選擇器的彈出層一致。範圍與時間選取仍是 [DateV2](./DateV2.md) 系列的功能。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :--- | :--- |
| `minDate` | `Date \| number` | 無 | 最早可選的日期 |
| `maxDate` | `Date \| number` | 無 | 最晚可選的日期 |
| `getDayAttributes` | `(date, dayOfWeek) => CalendarDayAttributes` | 無 | 回傳某一天的標記：小點、節日、標籤、停用 |
| `showDayLabel` | `boolean` | `false` | 是否顯示日期下方的標籤列 |
| `locale` | `string` | 繁體中文 | 週名與月名的 BCP 47 語系 |
| `weekStartsOn` | `0 \| 1` | `0` | 週起始：0 週日、1 週一 |
| `weekdayFormatter`、`monthFormatter`、`yearFormatter` | 函式 | 無 | 自訂週名、月名、年標題 |
| `color` | `CamelotColorRole` | `'primary'` | 選中日的色彩角色 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `Date \| null`（預設 `null`） | 選中的日期 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| 其餘 slot | 同內部日曆 | 原樣傳給內部日曆核心，例如自訂日期格的內容 |

## 規則
| 規則 | 說明 |
| :--- | :--- |
| 顯示月份 | 元件自己管理，起點是選中日期或今天；外部把選中日期改到別的月份時會跟著切過去 |
| 小點位置 | 小點固定在日期格的左上角，「今天」的標記也在同一處 |
| 外觀 | 面板用日期選擇器同一套樣式，Tactile 為實心表面，選中日為角色色填滿 |

來源：1. [Calendar.vue](../../../../app/components/Camelot/Calendar.vue)　2. [Internal/Calendar.vue](../../../../app/components/Camelot/Internal/Calendar.vue)

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

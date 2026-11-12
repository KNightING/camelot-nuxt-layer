# SchedulerMonthView

## Summary

SchedulerMonthView（匯入名稱 `CamelotInternalSchedulerMonthView`）是 Scheduler 的月視圖，屬內部元件：6 週 × 7 天的日期格，事件以單行條排在格內，拖到別格就換日、時間不變。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :--- | :--- |
| `date` | `Date` | 今天 | 目前顯示的月份 |
| `events` | `CamelotSchedulerEvent[]` | `[]` | 事件 |
| `weekStartsOn` | `0 \| 1` | `0` | 週起始 |
| `maxEvents` | `number` | `3` | 每格最多顯示幾筆 |
| `moreText` | `string` | 還有 {count} 筆 | 收合文字 |
| `defaultMinutes`、`readonly`、`color`、`locale`、`untitled` | — | — | 同 Scheduler |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `change` | `event`、`previous` | 拖移或調整長度放開後，帶新舊兩個版本 |
| `create` | `event` | 新增手勢完成（拖曳選取或點一下空白處） |
| `open` | `event` | 在事件上點一下，或在事件上按 Enter、空白鍵 |
| `select-day` | `day` | 點日期數字或「還有 N 筆」 |

來源：1. [Internal/SchedulerMonthView.vue](../../../../app/components/Camelot/Internal/SchedulerMonthView.vue)

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

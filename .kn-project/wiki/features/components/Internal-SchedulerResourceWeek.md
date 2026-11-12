# 排班週視圖

## Summary

SchedulerResourceWeek（匯入名稱 `CamelotInternalSchedulerResourceWeek`）是 Scheduler 的排班週視圖，屬內部元件：人員為列、7 天為欄，班次排在儲存格內；拖到另一個儲存格就換人與換日，時間不變。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :--- | :--- |
| `days` | `Date[]` | `[]` | 一週的 7 天 |
| `resources` | `CamelotSchedulerResource[]` | `[]` | 列 |
| `events` | `CamelotSchedulerEvent[]` | `[]` | 事件；只顯示對應到某個人員的 |
| `defaultMinutes`、`readonly`、`color`、`locale`、`untitled` | — | — | 同 Scheduler；人員有自己的 color 時以它為準 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `change` | `event`、`previous` | 拖移或調整長度放開後，帶新舊兩個版本 |
| `create` | `event` | 新增手勢完成（拖曳選取或點一下空白處） |
| `open` | `event` | 在事件上點一下，或在事件上按 Enter、空白鍵 |
| `select-day` | `day` | 點標頭的日期 |

來源：1. [Internal/SchedulerResourceWeek.vue](../../../../app/components/Camelot/Internal/SchedulerResourceWeek.vue)

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

# 排班日視圖

## Summary

SchedulerResourceDay（匯入名稱 `CamelotInternalSchedulerResourceDay`）是 Scheduler 的排班日視圖，屬內部元件：人員為列、小時為欄的橫向時間軸；班次可橫向換時間、縱向換人、拖右緣調整長度，同時段重疊的班次疊成多條。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :--- | :--- |
| `day` | `Date` | 今天 | 要顯示的那一天 |
| `resources` | `CamelotSchedulerResource[]` | `[]` | 列 |
| `events` | `CamelotSchedulerEvent[]` | `[]` | 事件 |
| `startHour`、`endHour` | `number` | `0`、`24` | 可見範圍（時） |
| `hourWidth` | `number` | `72` | 每小時寬度（px） |
| `snapMinutes`、`defaultMinutes`、`readonly`、`color`、`untitled` | — | — | 同 Scheduler |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `change` | `event`、`previous` | 拖移或調整長度放開後，帶新舊兩個版本 |
| `create` | `event` | 新增手勢完成（拖曳選取或點一下空白處） |
| `open` | `event` | 在事件上點一下，或在事件上按 Enter、空白鍵 |

來源：1. [Internal/SchedulerResourceDay.vue](../../../../app/components/Camelot/Internal/SchedulerResourceDay.vue)

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

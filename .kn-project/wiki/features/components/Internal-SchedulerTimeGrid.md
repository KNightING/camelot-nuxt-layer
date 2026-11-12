# SchedulerTimeGrid

## Summary

SchedulerTimeGrid（匯入名稱 `CamelotInternalSchedulerTimeGrid`）是 Scheduler 週與日視圖共用的時間軸，屬內部元件：標頭黏在捲動區上緣，左側是時間刻度，每一天一欄，事件依時間定位並在重疊時並排。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :--- | :--- |
| `days` | `Date[]` | `[]` | 要顯示的每一天（週 7 天、日 1 天） |
| `events` | `CamelotSchedulerEvent[]` | `[]` | 事件 |
| `startHour`、`endHour` | `number` | `0`、`24` | 可見範圍（時） |
| `hourHeight` | `number` | `48` | 每小時高度（px） |
| `snapMinutes`、`defaultMinutes` | `number` | `15`、`60` | 吸附與預設長度（分鐘） |
| `scrollToHour` | `number` | `8` | 打開時捲動到這個小時 |
| `readonly`、`color`、`locale`、`untitled` | — | — | 同 Scheduler |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `change` | `event`、`previous` | 拖移或調整長度放開後，帶新舊兩個版本 |
| `create` | `event` | 新增手勢完成（拖曳選取或點一下空白處） |
| `open` | `event` | 在事件上點一下，或在事件上按 Enter、空白鍵 |
| `select-day` | `day` | 點標頭的日期 |

## 規則
| 規則 | 說明 |
| :--- | :--- |
| 目前時間 | 今天那一欄畫一條紅線，每分鐘更新一次；不在可見範圍內就不畫 |
| 最短顯示 | 再短的事件也至少畫 15 分鐘的高度，才點得到 |

來源：1. [Internal/SchedulerTimeGrid.vue](../../../../app/components/Camelot/Internal/SchedulerTimeGrid.vue)

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

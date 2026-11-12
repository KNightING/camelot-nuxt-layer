# SchedulerEventChip

## Summary

SchedulerEventChip（匯入名稱 `CamelotInternalSchedulerEventChip`）是 Scheduler 四個視圖共用的事件外觀，屬內部元件。`block` 是時間軸上的色塊（標題加時間範圍），`chip` 是日期格與排班列裡的單行條；可聚焦，按下時發出手勢起點給所在的視圖。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :--- | :--- |
| `event` | `CamelotSchedulerEvent` | 必填 | 事件 |
| `variant` | `'block' \| 'chip'` | `'block'` | 外觀 |
| `resizable` | `'bottom' \| 'right'` | 無 | 調整長度的把手位置；鎖定或唯讀時不顯示 |
| `color` | `CamelotColorRole` | `'primary'` | 事件自己的 color 優先 |
| `isDraft` | `boolean` | `false` | 手勢進行中的預覽，加外框 |
| `readonly`、`untitled` | — | — | 同 Scheduler |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `move-start` | `PointerEvent` | 在事件上按下 |
| `resize-start` | `PointerEvent` | 在調整長度的把手上按下 |
| `open` | — | 按 Enter 或空白鍵 |

來源：1. [Internal/SchedulerEventChip.vue](../../../../app/components/Camelot/Internal/SchedulerEventChip.vue)

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

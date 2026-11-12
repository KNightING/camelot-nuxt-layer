# SchedulerEditor

## Summary

SchedulerEditor（匯入名稱 `CamelotInternalSchedulerEditor`）是 Scheduler 內建的事件編輯面板，屬內部元件：標題、開始與結束時間、人員、顏色，編輯既有事件時多一顆刪除。結束時間必須晚於開始時間才能儲存；鎖定的事件以唯讀方式開啟。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :--- | :--- |
| `event` | `CamelotSchedulerEvent \| null` | `null` | 正在編輯的事件；新增時是暫時事件 |
| `isNew` | `boolean` | `false` | 新增或編輯 |
| `resources` | `CamelotSchedulerResource[]` | `[]` | 人員清單；空的時候不顯示人員欄 |
| `labels` | `CamelotSchedulerLabels` | 必填 | 顯示文字 |
| `readonly` | `boolean` | `false` | 唯讀：欄位停用，沒有儲存與刪除 |
| `color` | `CamelotColorRole` | `'primary'` | 預設顏色 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `save` | `event` | 按儲存，帶完整的事件 |
| `delete` | — | 按刪除 |
| `cancel` | — | 對話框被取消 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `open` | `boolean`（預設 `false`） | 面板是否開啟 |

來源：1. [Internal/SchedulerEditor.vue](../../../../app/components/Camelot/Internal/SchedulerEditor.vue)

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

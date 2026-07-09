# TimeRow

> 時間輸入列，內部實作，提供時/分/秒欄位與 12/24 小時制切換。

**匯入名稱**：`CamelotInternalTimeRow`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `precision` | `'hour' \| 'minute' \| 'second'` | `'second'` | 顯示精度（決定顯示到分或秒） |
| `hourFormat` | `'12' \| '24'` | `'24'` | 小時制；`12` 時顯示 AM/PM 切換鈕 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `change` | — | 時/分/秒或 AM/PM 變更時觸發 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model:hours` | `number` | 小時（內部一律 24 小時制，預設 `0`） |
| `v-model:minutes` | `number` | 分鐘（預設 `0`） |
| `v-model:seconds` | `number` | 秒（預設 `0`） |

## 備註
- 為內部元件，使用 `CamelotInternalTimeField` 渲染各數字欄位。
- 內部一律以 24 小時制儲存；12 小時制透過 `displayHour` 換算顯示並保留 AM/PM 狀態。
- `precision` 為 `hour` 時僅顯示小時；`minute` 顯示到分；`second` 顯示到秒。
- 12 小時制的 AM/PM 鈕以 `(hours + 12) % 24` 切換上/下午。

---
[🏠 Wiki](../index.md)

# TimeV2

> 時間選擇器：以彈窗或對話框呈現時/分/秒選擇，支援 12/24 小時制與精細度控制。

**匯入名稱**：`CamelotTimeV2`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色 |
| `label` | `string` | - | 欄位標籤 |
| `required` | `boolean` | - | 標籤旁顯示紅色必填星號 |
| `disabled` | `boolean` | - | 停用 |
| `isError` | `boolean` | - | 錯誤態（紅色邊框） |
| `placeholder` | `string` | `'HH:mm'` | 未選值時的提示文字 |
| `showType` | `'auto' \| 'popup' \| 'dialog'` | `'auto'` | 呈現方式；auto 依裝置（手機用 dialog、桌機用 popup） |
| `selectZIndex` | `number` | - | 浮層 z-index |
| `timePrecision` | `'hour' \| 'minute' \| 'second'` | `'minute'` | 精細度（由下往上關閉）：hour 僅時、minute 時分、second 時分秒 |
| `hourFormat` | `'12' \| '24'` | `'24'` | 12 或 24 小時制 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model`（預設） | `string` | 純時間字串（24 制標準值）`"HH:mm"` 或 `"HH:mm:ss"` |

## 備註
- v-model 值恆為 24 制字串；trigger 顯示則依 `hourFormat` / `timePrecision` 轉換（12 制顯示 `hh:mm a`）。
- 使用 `CamelotPopupV2`（桌機）或 `CamelotBaseDialogV2`（手機）承載時間選擇列 `CamelotInternalTimeRow` 與「確認」按鈕。
- 首次開啟未調整時間即按確認，會套用當前內部值（預設 0:0:0）。
- popup 模式下點擊外部會關閉（`onClickOutside`，忽略 popup 面板本身）。
- 額外屬性（`$attrs`）會綁定到內部唯讀 `input`。

---
[🏠 Wiki](../index.md)

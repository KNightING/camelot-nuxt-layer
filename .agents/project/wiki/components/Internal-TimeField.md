# Internal TimeField

> 單一時間數字欄位（時或分），含可輸入輸入框與 Teleport 下拉選單。此為內部（Internal）實作，供時間選擇相關元件使用。

**匯入名稱**：`CamelotInternalTimeField`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `min` | `number` | — | 可選數值下限（必填） |
| `max` | `number` | — | 可選數值上限（必填） |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `number`（預設 `0`） | 目前數值，顯示時以 `padStart(2, '0')` 補零 |

## 備註
- 下拉清單以 `Teleport to="body"` 脫離父層 `overflow-hidden` 容器，避免超出彈窗時被裁切。
- 依 trigger 上方可用空間決定向上或向下展開（`LIST_MAX_HEIGHT = 168`）。
- Teleport 至 body 後會將當前 `--cml-color-current-color` 帶入下拉清單樣式。
- 鍵盤操作：`Enter` 關閉清單、`↑` / `↓` 以 `step` 循環增減（超出 `max` 回到 `min`，低於 `min` 回到 `max`）。
- 輸入時過濾非數字並以 `clamp` 夾限於 `min`~`max`。
- `options` 為 `min` 至 `max` 的完整整數清單。
- 使用 `onClickOutside`（忽略清單本身）於點擊外部時關閉清單。

---
[🏠 Wiki](../index.md)

# Material Checkbox

> Material 風格的核取方塊元件，支援未定狀態。此為 Material 主題實作，通常由 `CamelotCheckbox` 依主題自動載入（作為預設主題）。

**匯入名稱**：`CamelotMaterialCheckbox`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `disabled` | `boolean` | `false` | 是否停用 |
| `indeterminate` | `boolean` | `false` | 未定（半選）狀態，顯示橫線標記 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `change` | `checked: boolean` | 切換狀態時觸發，帶入切換後的值 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `boolean`（預設 `false`） | 核取狀態 |

## 備註
- 勾選或未定時以 `--cml-color-current-color` 填色與邊框，否則為 `border-outline`。
- 勾選顯示打勾標記；`indeterminate && !modelValue` 時顯示橫線標記。
- 固定為方形（`rounded-[2px]`），不提供 `shape` 設定。
- 停用時忽略點擊，不觸發 `change`。

---
[🏠 Wiki](../index.md)

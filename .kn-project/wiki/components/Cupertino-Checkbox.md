# Cupertino Checkbox

> Cupertino（iOS）風格的核取方塊元件，支援方形／圓形與未定狀態。此為 Cupertino 主題實作，通常由 `CamelotCheckbox` 依主題自動載入。

**匯入名稱**：`CamelotCupertinoCheckbox`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `disabled` | `boolean` | `false` | 是否停用 |
| `shape` | `'square' \| 'circle'` | `'square'` | 外框形狀 |
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
- 勾選或未定時以 `--cml-color-current-color` 填色與邊框，否則為 `border-outline-variant`。
- 勾選顯示打勾標記；`indeterminate && !modelValue` 時顯示橫線標記。
- 停用時忽略點擊，不觸發 `change`。

---
[🏠 Wiki](../index.md)

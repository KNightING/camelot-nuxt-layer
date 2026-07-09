# Steps

> 步驟指示器，顯示流程進度並可選擇性允許點擊切換步驟，適配各主題樣式。

**匯入名稱**：`CamelotSteps`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `steps` | `string[]` | — | 步驟文字陣列（必填）。 |
| `enableChangeByClick` | `boolean` | — | 啟用點擊切換步驟。 |
| `disableClickToNext` | `boolean` | — | 禁止點擊切換到後面的步驟。 |
| `disableClickToPrevision` | `boolean` | — | 禁止點擊切換到前面的步驟。 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色。 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model` | `number` | 目前步驟索引（從 0 起算）。預設 `0`。 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `dot` | `{ value, index, isComplete, isDoing }` | 自訂步驟圓點。 |
| `content` | `{ value, index, isComplete, isDoing }` | 自訂步驟文字內容。 |

## 備註
- `isDoing` 表示 `index === 目前步驟`；`isComplete` 表示 `index < 目前步驟`。
- 支援 cupertino / scifi / aqua 主題樣式覆寫。

---
[🏠 Wiki](../index.md)

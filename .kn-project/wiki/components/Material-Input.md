# Material Input

> Material Design 風格的浮動標籤文字輸入框，支援聚焦上浮標籤與必填標記。<主題實作（Material）>

**匯入名稱**：`CamelotMaterialInput`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `label` | `string` | `''` | 浮動標籤文字 |
| `placeholder` | `string` | `''` | 佔位文字（僅於聚焦時顯示） |
| `disabled` | `boolean` | `false` | 是否停用輸入框 |
| `required` | `boolean` | `false` | 是否必填，為真時標籤後顯示紅色 `*` |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `string \| number` | 輸入框的值 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `before` | — | 輸入框前方（左側）內容 |
| `after` | — | 輸入框後方（右側）內容 |

## 備註
- 標籤上浮條件 `isFloating`：聚焦中，或值不為 `undefined` 且不為空字串。
- 底部邊框於聚焦（`focus-within`）時加粗並套用 `--cml-color-current-color`。
- 內部維護 `isFocused` 狀態以控制 placeholder 與標籤動畫。

---
[🏠 Wiki](../index.md)

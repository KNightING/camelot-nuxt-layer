# Cupertino Input

> Cupertino（iOS）風格輸入框，聚焦時切換背景並顯示內框線。<主題實作>

**匯入名稱**：`CamelotCupertinoInput`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `placeholder` | `string` | `''` | 佔位文字 |
| `disabled` | `boolean` | `false` | 是否停用輸入框 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue`（預設） | `string \| number` | 輸入框的值 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `before` | — | 輸入框前方（左側）的內容 |
| `after` | — | 輸入框後方（右側）的內容 |

## 備註
- 聚焦時容器背景改為 `surface`，並顯示以 `--cml-color-current-color` 為色的內框線。

---
[🏠 Wiki](../index.md)

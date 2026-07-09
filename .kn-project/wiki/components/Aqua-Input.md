# Aqua Input

> Aqua（水感玻璃）主題的輸入框實作，聚焦時呈現光暈效果。內部/主題實作，通常由公開元件自動選用。

**匯入名稱**：`CamelotAquaInput`（Nuxt 自動匯入）

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `placeholder` | `string` | `''` | 佔位提示文字 |
| `disabled` | `boolean` | `false` | 是否停用輸入框 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model` | `string \| number` | 輸入框的值 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `before` | — | 輸入框前方內容（如圖示） |
| `after` | — | 輸入框後方內容（如圖示） |

## 備註
- 聚焦時套用 `aqua-glow` 樣式（由內部 `isFocused` 狀態控制）。

---
[🏠 Wiki](../index.md)

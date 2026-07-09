# Scifi Input

> 科幻風格輸入框，以 `CamelotScifiFrame` 包裹原生 input，並依聚焦／懸停狀態切換裝飾效果。內部/主題實作。

**匯入名稱**：`CamelotScifiInput`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `placeholder` | `string` | `''` | 輸入框佔位文字。 |
| `disabled` | `boolean` | `false` | 停用輸入。 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model` | `string \| number` | 輸入框的值。 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `before` | — | 輸入框前方內容（如圖示）。 |
| `after` | — | 輸入框後方內容（如圖示）。 |

## 備註
- 聚焦時 `focused` 生效；懸停且未停用時觸發光澤（shine）；停用時關閉掃描線。

---
[🏠 Wiki](../index.md)

# CustomColorSchemeProvider

> 於自身包裹的 `<div>` 範圍內套用自訂的明亮／暗色配色方案。

**匯入名稱**：`CamelotCustomColorSchemeProvider`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `lightColorScheme` | `CustomColorScheme<T>` | — | 明亮模式使用的自訂配色方案 |
| `darkColorScheme` | `CustomColorScheme<T>` | — | 暗色模式使用的自訂配色方案 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | — | 套用配色方案的內容 |

## Exposed
| 名稱 | 說明 |
| :--- | :--- |
| `usedColorScheme` | 目前實際使用中的配色方案 |

## 備註
- 泛型元件（`generic="T"`），配色方案型別由 `CustomColorScheme<T>` 決定。
- 與 `ColorSchemeProvider` 不同，此元件透過 `useCustomColorScheme` 作用於元件自身的 `provider` 容器 `<div>`，屬於區域套用。
- 於 `onUpdated` 時將 props 合併回內部配色方案。

---
[🏠 Wiki](../index.md)

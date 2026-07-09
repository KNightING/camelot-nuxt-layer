# ColorSchemeProvider

> 於 `document.documentElement` 上套用自訂的明亮／暗色配色方案，並提供給子元件。

**匯入名稱**：`CamelotColorSchemeProvider`

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
- 透過 `useCustomColorScheme` 作用於 `document.documentElement`，屬於全域套用。
- 於 `onMounted` 與 `onUpdated` 時將 props 合併回內部配色方案。

---
[🏠 Wiki](../index.md)

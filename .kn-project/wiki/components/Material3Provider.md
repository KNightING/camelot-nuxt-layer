# Material3Provider

> 於容器元素上套用 Material 3 明亮／暗色配色方案，並提供給子元件。

**匯入名稱**：`CamelotMaterial3Provider`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `lightColorScheme` | `Material3ColorSchemePartial` | — | 明亮模式使用的 Material 3 配色方案（部分） |
| `darkColorScheme` | `Material3ColorSchemePartial` | — | 暗色模式使用的 Material 3 配色方案（部分） |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | — | 套用配色方案的內容 |

## 備註
- 型別 `Material3ColorSchemePartial` 來自 `composables/useMaterial3ColorScheme`。
- 於 `onMounted` 時以內部容器 `ref` 及傳入的明亮／暗色配色方案呼叫 `useMaterial3ColorScheme`，作用範圍為該容器 `div`。

---
[🏠 Wiki](../index.md)

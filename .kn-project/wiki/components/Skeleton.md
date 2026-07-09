# Skeleton

> 載入中的骨架佔位元件，依當前主題（aqua / scifi / cupertino / material）呈現不同的載入動畫。

**匯入名稱**：`CamelotSkeleton`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `isLoading` | `boolean` | `true` | 是否顯示骨架；`false` 時改為渲染 default slot。 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | — | 載入完成（`isLoading` 為 `false`）後顯示的實際內容。 |

## 備註
- `inheritAttrs` 設為 `false`；`$attrs` 會透傳至實際的骨架容器元素。
- 透過 `useCamelotTheme()` 的 `themeMode` 判斷主題：`aqua` 使用毛玻璃 shimmer、`scifi` 使用 `CamelotScifiFrame`、其餘（cupertino / material）使用預設閃光效果。

---
[🏠 Wiki](../index.md)

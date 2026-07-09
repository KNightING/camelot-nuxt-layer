# Breakpoints

> 依裝置斷點（mobile／tablet／laptop／desktop）選擇對應插槽渲染的響應式容器，支援向下相容回退。

**匯入名稱**：`CamelotBreakpoints`（Nuxt 自動匯入）

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `disabledDownward` | `boolean` | — | 關閉向下相容；停用後大斷點不再回退使用較小斷點的插槽 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `mobile` | — | 行動裝置版面 |
| `tablet` | — | 平板版面 |
| `laptop` | — | 筆電版面 |
| `desktop` | — | 桌機版面 |
| `default` | `{ isMobile, isTablet, isLaptop, isDesktop }` | 無對應具名插槽時的後備內容，並提供各斷點布林值 |

## 備註
- 斷點狀態取自 `useDeviceBreakpoints()`。
- 向下相容：未提供當前斷點插槽時，會依序回退至較小斷點插槽（除非 `disabledDownward` 為真）。

---
[🏠 Wiki](../index.md)

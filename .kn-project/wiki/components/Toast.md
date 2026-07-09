# Toast

> 全域通知容器：以九種位置堆疊顯示 toast，含狀態色、動作按鈕與毛玻璃淡入/淡出。

**匯入名稱**：`CamelotToast`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `zIndex` | `number` | `1000` | 容器 z-index |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | `{ toast, type, color }` | 自訂整個 toast 卡片（未提供時使用內建樣式）。`type` 為 `toast.type ?? 'info'`，`color` 由 `toast.color` 或 type 對應狀態色推導 |
| `action` | `{ toast, run, close }` | 自訂動作區。`run()` 執行 `toast.action.handler` 並關閉；`close()` 移除該 toast |

## 備註
- 資料來源與操作皆來自 `useCamelotToast()`（`toasts`、`removeToast`）；本元件僅負責渲染，通常整個 App 掛一個即可。
- 支援位置：`top`、`bottom`、`left`、`right`、`center`、`top-left`、`top-right`、`bottom-left`、`bottom-right`；toast 依 `position`（預設 `bottom`）分組。
- 顏色角色：優先 `toast.color`，否則由 `type` 對應（success/error/warning，其餘 → primary）。
- 內建卡片含狀態圓點、標題/訊息、動作按鈕與關閉鈕；`center` 由中央往下堆疊避免跳動。
- 入場/退場以 `TransitionGroup` 的 JS hooks 控制純透明度淡入/淡出（不使用 transform），opacity 套在具 backdrop-filter 的 box 自身以確保毛玻璃連續淡入。
- 以 `ClientOnly` + `Teleport to="body"` 掛載。

---
[🏠 Wiki](../index.md)

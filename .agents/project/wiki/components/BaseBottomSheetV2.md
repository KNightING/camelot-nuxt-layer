# BaseBottomSheetV2

> 由底部滑入的底部彈出面板（Bottom Sheet），依當前主題（scifi／cupertino／aqua／material）自動切換版面。

**匯入名稱**：`CamelotBaseBottomSheetV2`（Nuxt 自動匯入）

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | — | 面板內容 |

## 備註
- 內部包裹於 `CamelotBaseDialogV2` 的 `#wrapper` 插槽。
- 透過 `useCamelotTheme()` 取得 `themeMode`，依主題渲染對應版面；預設為 Material 版面。
- 各版面皆於頂端顯示拖曳指示條，並以 `slide-up` 動畫由底部滑入。

---
[🏠 Wiki](../index.md)

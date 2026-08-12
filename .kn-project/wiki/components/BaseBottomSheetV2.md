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
- 面板容器寬度為 `w-full` 而非 `w-screen`：`100vw` **包含垂直捲軸寬度**，會使面板比可視區寬而產生水平捲軸。
- 面板層級取自[疊層刻度](../features/layering.md)的 `--cml-z-sheet`，低於 popup 層級，因此 Sheet 內的選單浮層會正確疊在面板之上。
- 本元件**不提供內建關閉按鈕**，僅有拖曳指示條；關閉 UI 由使用端負責。
- 內容請只放內容：外框、內距與寬度已由本元件負責，slot 內再包一層完整盒子會造成雙層邊框與寬度溢出。

---
[🏠 Wiki](../index.md)

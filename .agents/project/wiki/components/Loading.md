# Loading

> 全螢幕遮罩式載入指示器，依主題切換不同樣式的旋轉動畫。

**匯入名稱**：`CamelotLoading`

## 備註
- 無 Props、Emits、v-model、Slots、Exposed。狀態完全由 `useLoading()` 的 `isOpening` 控制顯示。
- 透過 `<Teleport to="body">` 掛載於 `body`，包在 `<ClientOnly>` 中僅於用戶端渲染。
- 顯示時為固定定位（`fixed inset-0`）的半透明黑色遮罩並帶背景模糊，層級 `z-[1100]`。
- 依 `useCamelotTheme()` 的 `themeMode` 切換樣式：
  - `aqua`：霜面玻璃圓環（`aqua-loader`）。
  - `scifi`：雷達掃描動畫（含 `CamelotScifiReticle`、`SYS_LOAD...` 文字）。
  - `cupertino`：iOS 風格 8 葉片旋轉器。
  - 其他（預設）：Material SVG 圓形旋轉器。
- 使用 `fade` 過場動畫（0.35s）。

---
[🏠 Wiki](../index.md)

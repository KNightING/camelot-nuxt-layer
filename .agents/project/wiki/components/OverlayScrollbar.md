# OverlayScrollbar

> 附著於既有捲動容器上的自訂覆蓋式捲軸（不自建容器），支援水平浮動至視窗底。

**匯入名稱**：`CamelotOverlayScrollbar`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `container` | `HTMLElement \| null` | - | 目標捲動容器（附著其上，不自建容器） |
| `orientation` | `CamelotScrollbarOrientation` | - | 捲軸方向（`horizontal` / `vertical`） |
| `floatingEnabled` | `boolean` | `false` | 是否啟用「浮動到視窗底」（僅水平有意義） |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色：捲軸 thumb 上色 |
| `startInset` | `number` | `0` | 主軸起點額外偏移（px），例如垂直捲軸避開 sticky 表頭 |

## 備註
- 定位、可見性、thumb/bar 尺寸與位移皆由 `useCamelotOverlayScrollbar` composable 依 docked/floating 狀態以 inline style 驅動。
- docked 態保留於容器內（受圓角 overflow 裁切）；水平需浮動時才 `Teleport` 至 `body` 固定於視窗底。
- 因 Teleport 後取不到元件內變數，顏色改以全域角色色變數 `var(--color-{role})` 傳入。
- 僅 thumb 可互動（`pointer-events: auto`），其餘不攔截點擊；bar 為固定寬度膠囊，hover/拖曳以 transform 放大。

---
[🏠 Wiki](../index.md)

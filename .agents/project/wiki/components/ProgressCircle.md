# ProgressCircle

> 圓形進度指示器，支援確定／不確定狀態與中央標籤，並依主題切換樣式。

**匯入名稱**：`CamelotProgressCircle`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `value` | `number` | `0` | 目前進度值 |
| `max` | `number` | `100` | 最大值 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色 |
| `indeterminate` | `boolean` | `false` | 是否為不確定狀態（旋轉動畫） |
| `showLabel` | `boolean` | `false` | 是否顯示中央標籤（不確定狀態下不顯示） |
| `labelMode` | `'percent' \| 'fraction'` | `'percent'` | 標籤格式：百分比或分數 |
| `size` | `number` | `64` | 元件尺寸（px） |
| `strokeWidth` | `number` | `6` | 圓環線寬 |

## 備註
- 以 SVG `circle` 搭配 `stroke-dasharray`／`stroke-dashoffset` 繪製進度。
- `percent` 依 `value / max` 夾在 0–100；`max <= 0` 時為 0。不確定狀態 `dashoffset` 固定為周長的 0.7。
- `linecap`：scifi 為 `butt`，其他為 `round`；`aqua` 使用線性漸層 `stroke`（`useId` 產生 `gradId`）。
- 依 `themeMode` 切換 `trackStrokeClass` 與 scifi 的發光 `progressStyle`。
- 使用 `useCamelotRoleColorClass`；尊重 `motion-reduce`。

---
[🏠 Wiki](../index.md)

# ProgressBar

> 水平進度條，支援確定／不確定狀態、標籤顯示，並依主題切換樣式。

**匯入名稱**：`CamelotProgressBar`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `value` | `number` | `0` | 目前進度值 |
| `max` | `number` | `100` | 最大值 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色 |
| `indeterminate` | `boolean` | `false` | 是否為不確定狀態（掃描動畫） |
| `showLabel` | `boolean` | `false` | 是否顯示標籤（不確定狀態下不顯示） |
| `labelMode` | `'percent' \| 'fraction'` | `'percent'` | 標籤格式：百分比或分數 |
| `height` | `string` | `'8px'` | 進度條高度 |
| `rounded` | `boolean` | `true` | 是否圓角（scifi 主題強制無圓角） |

## 備註
- `percent` 依 `value / max` 夾在 0–100；`max <= 0` 時為 0。
- `labelText`：`fraction` 顯示 `value / max`，否則顯示四捨五入百分比。
- 依 `useCamelotTheme()` 的 `themeMode` 切換 `trackClass`／`fillClass`（`aqua`、`scifi`、預設）。
- 使用 `useCamelotRoleColorClass` 依 `color` 產生角色色彩 class。
- 尊重 `motion-reduce`，關閉過場／動畫。

---
[🏠 Wiki](../index.md)

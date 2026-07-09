# ProgressStage

> 以帶左上破口的弧形環顯示「當前階段／總階段」的進度指示器。

**匯入名稱**：`CamelotProgressStage`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `current` | `number` | `1` | 目前階段 |
| `total` | `number` | `1` | 總階段數 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色 |
| `size` | `number` | `96` | 元件尺寸（px） |
| `strokeWidth` | `number` | `7` | 弧線線寬 |

## 備註
- 弧形帶左上（225°）固定 98° 破口；破口處以三段文字（當前階段、斜線、總階段）呈現「突破而出」的視覺。
- `fraction` 依 `current / total` 夾在 0–1；`total <= 0` 時為 0。
- 當前數字字級 `currentFontPx`：3 位數以下 51px，4 位數以上 40px。
- `aqua` 主題使用線性漸層 `stroke`（`useId` 產生 `gradId`）；依 `themeMode` 切換 `trackStrokeClass` 與 scifi 發光 `progressStyle`。
- 使用 `useCamelotRoleColorClass`；尊重 `motion-reduce`。

---
[🏠 Wiki](../index.md)

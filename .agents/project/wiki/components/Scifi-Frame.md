# Scifi Frame

> 科幻風格（HUD）外框容器，提供切角、格線、掃描線、脈衝與光澤等裝飾效果。內部/主題實作。

**匯入名稱**：`CamelotScifiFrame`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `variant` | `'2-corner' \| '4-corner'` | `'2-corner'` | 切角樣式；`4-corner` 為四角皆切。 |
| `showGrid` | `boolean` | `true` | 顯示格線背景。 |
| `showScanline` | `boolean` | `true` | 顯示掃描線動畫。 |
| `showPulse` | `boolean` | `false` | 顯示水平脈衝掃描背景。 |
| `focused` | `boolean` | `false` | 聚焦狀態，套用光暈與內陰影。 |
| `filled` | `boolean` | `false` | 以主色填滿背景。 |
| `showShine` | `boolean` | `false` | 觸發一次光澤滑掠動畫。 |
| `activeReticle` | `boolean` | `false` | 啟用角落準星（Reticle）效果。 |
| `showBorders` | `boolean` | `true` | 顯示外框邊界背景；`false` 時將背景不透明度設為 0。 |
| `showCorners` | `boolean` | `true` | 顯示左上／右下角落裝飾（需同時 `clipCorners`）。 |
| `clipCorners` | `boolean` | `true` | 啟用切角裁切；`false` 時不裁切邊角。 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | — | 外框內容。 |

## 備註
- 主色取自 CSS 變數 `--cml-color-current-color`（回退 `--color-primary` 或 `currentColor`）。
- 內部使用 `CamelotScifiReticle` 呈現準星效果。

---
[🏠 Wiki](../index.md)

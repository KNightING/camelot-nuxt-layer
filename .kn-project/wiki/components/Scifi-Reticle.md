# Scifi Reticle

> 科幻風格的四角瞄準框裝飾，於啟用或滑鼠移入時四角收合聚焦。內部/主題實作，通常由公開元件自動選用。

**匯入名稱**：`CamelotScifiReticle`（Nuxt 自動匯入）

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `active` | `boolean` | — | 是否啟用（四角收合並發光） |
| `hoverable` | `boolean` | — | 是否可由滑鼠移入觸發，並開啟指標事件 |

## 備註
- 以絕對定位置於父層（`inset: -8px`），預設 `pointer-events: none`；`hoverable` 時改為 `auto`。
- 顏色取自 `--cml-color-current-color`（退回 `--color-primary` 或 `currentColor`）。

---
[🏠 Wiki](../index.md)

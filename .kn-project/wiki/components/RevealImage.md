# RevealImage

> 以遮罩動畫將黑白圖片逐步揭示為彩色圖片的元件。

**匯入名稱**：`CamelotRevealImage`（Nuxt 自動匯入）

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `src` | `string` | — | 圖片來源網址 |
| `alt` | `string` | `''` | 圖片替代文字 |
| `trigger` | `'auto' \| 'hover' \| 'manual'` | `'auto'` | 觸發方式：自動播放、滑鼠移入播放、手動控制 |
| `play` | `boolean` | `false` | 於 `manual` 模式下控制是否播放 |
| `angle` | `string` | `'0deg'` | 揭示方向角度（CSS 變數 `--angle`） |
| `duration` | `string` | `'800ms'` | 動畫時長（CSS 變數 `--duration`） |
| `delay` | `string` | `'0s'` | 動畫延遲（CSS 變數 `--delay`） |

## 備註
- 彩色揭示效果透過 `::after` 偽元素與 `mask-image` 線性漸層達成。
- 支援 `prefers-reduced-motion`，減少動態偏好時直接顯示完整揭示。

---
[🏠 Wiki](../index.md)

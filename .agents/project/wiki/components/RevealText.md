# RevealText

> 以遮罩動畫將文字逐步填入指定色彩／背景的揭示文字元件。

**匯入名稱**：`CamelotRevealText`（Nuxt 自動匯入）

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `text` | `string` | — | 要顯示的文字內容 |
| `trigger` | `'auto' \| 'hover' \| 'manual'` | `'auto'` | 觸發方式：自動播放、滑鼠移入播放、手動控制 |
| `play` | `boolean` | `false` | 於 `manual` 模式下控制是否播放 |
| `angle` | `string` | `'0deg'` | 揭示方向角度（CSS 變數 `--angle`） |
| `duration` | `string` | `'500ms'` | 動畫時長（CSS 變數 `--duration`） |
| `delay` | `string` | `'0s'` | 動畫延遲（CSS 變數 `--delay`） |
| `fill` | `string` | `'#ff4d4f'` | 揭示層填充（背景，CSS 變數 `--fill`） |
| `bgSize` | `string` | `'auto'` | 填充背景尺寸（CSS 變數 `--bg-size`） |

## 備註
- 揭示層透過 `::after` 偽元素搭配 `background-clip: text` 與 `mask-image` 達成。
- 支援 `prefers-reduced-motion`，減少動態偏好時直接顯示完整揭示。

---
[🏠 Wiki](../index.md)

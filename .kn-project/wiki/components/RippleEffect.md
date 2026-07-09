# RippleEffect

> 包裝子內容並在指標按下處產生水波紋（ripple）擴散動畫的容器元件。

**匯入名稱**：`CamelotRippleEffect`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `rippleColor` | `string` | — | 水波紋顏色（hex），透過 `useColor().hexToRgbaArray` 轉為 RGB 套用。 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| （預設） | — | 要套用水波紋效果的內容。 |

## 備註
- `@pointerdown` 於點擊座標建立 `.ripple` 元素，650ms 後移除。
- ripple 尺寸依容器對角線計算（`sqrt(h² + w²) × 2`）並寫入 CSS 變數 `--ripple-size`。
- 顏色於 `onUpdated` 時將 `rippleColor` 轉為 `--cml-c-ripple-color`（`r,g,b` 字串）。
- 容器為 `position: relative; overflow: hidden`，水波紋不接收指標事件。

---
[🏠 Wiki](../index.md)

# Material Button

> Material Design 風格的填色按鈕，內建漣漪效果與 hover／disabled 狀態。<主題實作（Material）>

**匯入名稱**：`CamelotMaterialButton`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `disabled` | `boolean` | `false` | 是否停用按鈕 |
| `color` | `string` | `'primary'` | 色彩角色名稱，作為 `isContainer` 時漣漪色的計算依據 |
| `isContainer` | `boolean` | `false` | 是否為 container 樣式，影響漣漪顏色計算 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `click` | `event: MouseEvent` | 點擊按鈕時觸發 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | — | 按鈕內容 |

## 備註
- 背景色使用 `--cml-color-current-color`，文字使用 `--cml-color-current-on-color`。
- 漣漪顏色 `rippleColor`：`isContainer` 為真時為 `var(--color-on-${color}-container)`，否則為 `#ffffff`。
- 透過 `CamelotRippleEffect` 提供漣漪動畫。
- hover 提高亮度與陰影，disabled 時降低透明度並取消亮度／陰影變化。

---
[🏠 Wiki](../index.md)

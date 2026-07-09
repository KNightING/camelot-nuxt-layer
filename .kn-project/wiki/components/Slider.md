# Slider

> 滑桿元件，支援單值與雙滑桿區間、步進吸附、刻度／文字標記與提示氣泡，並適配各主題樣式。

**匯入名稱**：`CamelotSlider`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `min` | `number` | `0` | 最小值。 |
| `max` | `number` | `100` | 最大值。 |
| `step` | `number` | `1` | 間隔停頓：吸附到 step 的倍數。 |
| `range` | `boolean` | `false` | 雙滑桿區間模式（modelValue 為 `[起, 迄]`）。 |
| `height` | `number` | `6` | 軌道高度（px）。 |
| `marks` | `boolean \| { value: number, label?: string }[]` | `false` | 間隔刻度／文字；`true` 時自動依 step 產生，或傳入自訂陣列。 |
| `showTooltip` | `boolean` | `false` | 拖曳把手上方顯示數值提示。 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色。 |
| `disabled` | `boolean` | `false` | 停用滑桿。 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model` | `number \| [number, number]` | 目前值；區間模式為 `[起, 迄]`。預設 `0`。 |

## 備註
- 支援指標拖曳與鍵盤操作（方向鍵依 `step` 增減）。
- 載入或外部值變動時會自動吸附至 `step` 的倍數。
- 標記數量：`marks === true` 時若刻度數超過 20 則不產生。
- 各主題（aqua / scifi / cupertino / material）套用不同軌道、填色與把手樣式。

---
[🏠 Wiki](../index.md)

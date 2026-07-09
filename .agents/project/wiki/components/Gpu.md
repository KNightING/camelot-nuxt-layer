# Gpu

> 以 GPU 加速修正包裹內容，套用 transform 與觸控捲動修正以改善繪製效能。

**匯入名稱**：`CamelotGpu`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `disabledFixTransform` | `boolean` | `false` | 停用 `translate3d(0,0,0)` transform 修正 |
| `disabledFixScrolling` | `boolean` | `false` | 停用 `-webkit-overflow-scrolling:touch` 修正 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | — | 套用 GPU 修正的內容 |

## 備註
- 容器固定套用 `transform-gpu`；另依 props 條件套用 `translate3d(0,0,0)` 與觸控捲動修正。

---
[🏠 Wiki](../index.md)

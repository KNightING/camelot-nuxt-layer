# VirtualScroll

> 虛擬滾動容器，僅渲染可視範圍內的項目，支援動態量測項目尺寸、水平／垂直方向與 overscan。

**匯入名稱**：`CamelotVirtualScroll`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `items` | `T[]` | — | 資料項目陣列（必填）。 |
| `itemKey` | `string \| ((item: T, index: number) => string \| number)` | — | 每項唯一鍵：欄位名或取值函式（預設用索引）。 |
| `estimatedItemSize` | `number` | `44` | 預估單項尺寸（px），用於尚未量測的項目。 |
| `overscan` | `number` | `4` | 視窗前後多渲染的項目數。 |
| `horizontal` | `boolean` | `false` | 水平虛擬滾動。 |
| `height` | `string` | — | 固定高度（如 `'320px'`）。 |
| `maxHeight` | `string` | — | 最大高度（內容不足時自適應）。 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | `{ item, index }` | 單一項目的呈現。 |

## Exposed
| 名稱 | 說明 |
| :--- | :--- |
| `scrollToIndex` | 捲動至指定索引的項目。 |

## 備註
- 以 `useCamelotVirtual` 組合式計算可視索引與上下（左右）留白；使用 `ResizeObserver` 量測已渲染項目的實際尺寸並修正範圍。
- 泛型元件（`generic="T"`）。

---
[🏠 Wiki](../index.md)

# Timeline

> 依項目清單渲染垂直或水平時間軸，支援單側 / 交錯排列與捲動逐一淡入。

**匯入名稱**：`CamelotTimeline`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `items` | `TimelineItem[]` | — | 時間軸項目清單。 |
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | 排列方向。 |
| `side` | `'before' \| 'after' \| 'alternate'` | `'after'` | 內容位置：vertical → before=左 / after=右；horizontal → before=上 / after=下；alternate 交錯。 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色。 |
| `animate` | `boolean` | `false` | 捲動逐一淡入。 |

### TimelineItem
| 欄位 | 型別 | 說明 |
| :--- | :--- | :--- |
| `title` | `string?` | 標題。 |
| `content` | `string?` | 內容文字。 |
| `image` | `string?` | 內容圖片網址（渲染於文字下方，自訂 `#content` slot 時不套用）。 |
| `key` | `string \| number?` | 列表 key。 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `title` | `{ item: TimelineItem, index: number }` | 自訂標題，預設渲染 `item.title`。 |
| `content` | `{ item: TimelineItem, index: number }` | 自訂內容，預設渲染 `item.content` 與 `item.image`。 |
| `node` | `{ item: TimelineItem, index: number }` | 自訂軸點，預設渲染圓點（scifi 主題帶發光）。 |

## 備註
- `animate` 啟用時透過 `IntersectionObserver`（threshold 0.2）於進入視窗時逐一淡入；SSR 或未啟用時直接全部顯示。
- 軸線軌道：`alternate` 使用三軌（軸線置中），單側使用兩軌（軸線靠邊）；垂直用欄、水平用列以維持節點與線對齊。
- 配色由 `useCamelotRoleColorClass(color)` 提供，`themeMode` 影響軸點樣式。

---
[🏠 Wiki](../index.md)

# Table

> 資料表格：支援虛擬滾動、固定欄、置頂列、斑馬紋、hover 底色與自訂覆蓋式捲軸。

**匯入名稱**：`CamelotTable`

> 泛型元件：`<T extends Record<string, unknown>>`。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `columns` | `CamelotTableColumn<T>[]` | - | 欄位定義 |
| `data` | `T[]` | - | 資料列 |
| `rowKey` | `string \| ((row: T) => string \| number)` | - | 列鍵（未給則以索引為鍵） |
| `stripe` | `boolean` | `false` | 斑馬紋 |
| `hover` | `boolean` | `true` | 列 hover 底色 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色：套用於捲軸、列 hover 底色、表頭底線等強調處 |
| `height` | `string` | - | 固定高度（如 `"480px"`）：內容少時保留空白、多時內部捲動 |
| `maxHeight` | `string` | - | 高度上限：內容少於上限時容器會縮短 |
| `floatingScrollbar` | `boolean` | `true` | 浮動水平捲軸：表格底部落在視窗外時於視窗底浮現同步捲軸 |
| `pinnedTopRows` | `T[]` | `[]` | 固定置頂列 |
| `virtual` | `boolean` | `true` | 虛擬滾動（支援可變列高，需搭配 `height`/`maxHeight` 才有效益） |
| `estimatedRowHeight` | `number` | `44` | 預估列高（px），尚未量測的列以此估算 |
| `reserveVerticalScrollbar` | `boolean` | `true` | 是否為垂直捲軸保留固定空間（gutter）；關閉則捲軸覆蓋於表格上 |
| `reserveHorizontalScrollbar` | `boolean` | `true` | 是否為水平捲軸保留固定空間（gutter）；關閉則捲軸覆蓋於表格上 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `head-<col.key>` | `{ column }` | 動態具名：自訂某欄的表頭內容（未提供時顯示 `col.title`） |
| `cell-<col.key>` | `{ row, column, value, rowIndex, pinned }` | 動態具名：自訂某欄的儲存格內容（`pinned` 表示是否為置頂列；未提供時顯示 `value`） |
| `empty` | - | 無資料時顯示（預設「無資料」） |

## 備註
- 欄位（`CamelotTableColumn`）常用屬性：`key`、`title`、`width`、`align`（`left`/`center`/`right`）、`fixed`（`left`/`right`）、`accessor(row)`。
- 固定欄以 `position: sticky` + 累計偏移實作，最後一個左固定欄與第一個右固定欄帶陰影分隔。
- 虛擬滾動：僅渲染可視窗格（保留真實 `rowIndex` 供斑馬紋/插槽使用），並以 `ResizeObserver` 量測實際列高。
- 原生捲軸隱藏，改由兩個 `CamelotOverlayScrollbar`（水平可浮動、垂直 docked）呈現，皆走色彩角色。
- 儲存格取值：優先 `col.accessor(row)`，否則 `row[col.key]`。

---
[🏠 Wiki](../index.md)

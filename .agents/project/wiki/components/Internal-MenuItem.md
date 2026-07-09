# MenuItem

> 側邊選單的單一項目，內部實作，遞迴渲染子項並支援展開/收合與選中高亮。

**匯入名稱**：`CamelotInternalMenuItem`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `item` | `CamelotMenuItem` | — | 選單項目資料 |
| `level` | `number` | `0` | 層級深度（影響縮排與字重） |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `node` | （由 `MenuItem` 遞迴傳遞，本元件不定義具名內容） | 透過遞迴傳遞的自訂項目內容 |

（注：本元件模板未直接宣告 slot，僅遞迴渲染子項 `CamelotInternalMenuItem`。）

## 備註
- 為內部元件，透過 `CAMELOT_MENU_KEY` 注入 `CamelotMenuContext`（提供 isActive、isActiveAncestor、isExpanded、toggleExpand、select）。
- 有子項時點擊切換展開，否則觸發選取。
- 選中樣式依 `themeMode`（aqua/scifi/cupertino/default）套用不同外觀。
- 巢狀層以左側導引線（垂直線＋L 形轉角）呈現階層，使用 `CamelotExpanded` 做展開動畫。
- chevron 圖示於展開時旋轉 90 度。

---
[🏠 Wiki](../index.md)

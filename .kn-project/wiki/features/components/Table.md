# Table

## Summary

泛型資料表格：以原生表格結構呈現欄與列，支援虛擬滾動、固定表頭、左右固定欄、置頂列、斑馬紋、懸停底色與自訂覆蓋式捲軸。列資料型別為任意物件。匯入名稱為 `CamelotTable`（Nuxt 自動匯入）。

## 運作方式

### 欄位定義與取值

| 欄位屬性 | 說明 |
|---|---|
| key | 對應列資料的欄位，也用於表頭與儲存格插槽命名 |
| title | 表頭標題 |
| width | 欄寬；固定欄建議明確指定，偏移才算得準 |
| align | 對齊：left、center、right |
| fixed | 固定欄：left 或 right |
| accessor | 取值函式，供巢狀或衍生欄位使用 |

1. 儲存格值優先取 accessor 的結果，否則取列資料中與 key 同名的欄位。
2. 列鍵依序取：列鍵函式的結果、列資料中指定欄位的值，都沒有時用列索引。

來源：1. [Table.vue][]　2. [table.ts][]

### 虛擬滾動

開啟虛擬滾動時，表格只渲染可視範圍內的列，並在表身上下各插一列空白列，撐出其餘列的高度。

這個做法保留原生表格的欄寬對齊，固定表頭、固定欄、斑馬紋、懸停、置頂列與儲存格插槽都照常運作，插槽拿到的列索引仍是真實索引。

列高不需固定：尚未量測的列以預估列高計算，渲染後再量實際高度修正；同一列只註冊一次尺寸觀察。

關閉虛擬滾動時一次渲染全部資料列。虛擬滾動要搭配固定高度或高度上限，容器有高度上限才有效益。

來源：1. [Table.vue][]　2. [useCamelotVirtual.ts][]

### 固定表頭、固定欄與置頂列

三者都以 sticky 定位實作。置頂列的頂端位置等於量測到的表頭高度，因此固定在表頭正下方。

固定欄依前面各固定欄的寬度累計偏移；最後一個左固定欄與第一個右固定欄帶陰影，與捲動內容分隔。

外層容器負責圓角並裁切內容，捲動發生在內層容器，捲軸因此不會溢出圓角。

來源：1. [Table.vue][]

### 捲軸與表頭底色

1. 原生捲軸隱藏，改用兩條覆蓋式捲軸：水平捲軸可浮動在視窗底，垂直捲軸貼在右側，都跟隨色彩角色。
2. 保留捲軸空間時，右側與底部各留 6px 透明邊框給捲軸；關閉時捲軸直接覆蓋在表格上。
3. 表頭底色刻意不透明，Aqua 主題也一樣。每個表頭格若各自半透明加模糊，都會成為獨立合成層，欄越多越吃效能。
4. Aqua 的玻璃質感改由表格容器承擔。

來源：1. [Table.vue][]　2. [OverlayScrollbar.vue][]

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `columns` | `CamelotTableColumn<T>[]` | — | 欄位定義。 |
| `data` | `T[]` | — | 資料列。 |
| `rowKey` | `string \| ((row: T) => string \| number)` | — | 列鍵，未給則以索引為鍵。 |
| `stripe` | `boolean` | `false` | 斑馬紋。 |
| `hover` | `boolean` | `true` | 列懸停底色。 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色，套用於捲軸、列懸停底色、表頭底線等強調處。 |
| `height` | `string` | — | 固定高度，例如 `"480px"`；內容少時保留空白、多時內部捲動。 |
| `maxHeight` | `string` | — | 高度上限，內容少於上限時容器會縮短。 |
| `floatingScrollbar` | `boolean` | `true` | 表格底部落在視窗外時，於視窗底浮現同步的水平捲軸。 |
| `pinnedTopRows` | `T[]` | `[]` | 固定置頂列。 |
| `virtual` | `boolean` | `true` | 虛擬滾動，支援可變列高，需搭配 `height` 或 `maxHeight`。 |
| `estimatedRowHeight` | `number` | `44` | 預估列高，單位 px，尚未量測的列以此估算。 |
| `reserveVerticalScrollbar` | `boolean` | `true` | 是否為垂直捲軸保留固定空間；關閉則捲軸覆蓋於表格上。 |
| `reserveHorizontalScrollbar` | `boolean` | `true` | 是否為水平捲軸保留固定空間；關閉則捲軸覆蓋於表格上。 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `head-${key}` | `{ column }` | 自訂某欄的表頭內容，未提供時顯示欄位標題。 |
| `cell-${key}` | `{ row, column, value, rowIndex, pinned }` | 自訂某欄的儲存格內容，`pinned` 表示是否為置頂列。 |
| `empty` | — | 無資料時顯示，預設為「無資料」。 |

## 相關頁面

- [OverlayScrollbar](./OverlayScrollbar.md)
- [VirtualScroll](./VirtualScroll.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Table.vue | [app/components/Camelot/Table.vue](../../../../app/components/Camelot/Table.vue) |
| table.ts | [shared/types/table.ts](../../../../shared/types/table.ts) |
| useCamelotVirtual.ts | [app/composables/useCamelotVirtual.ts](../../../../app/composables/useCamelotVirtual.ts) |
| OverlayScrollbar.vue | [app/components/Camelot/OverlayScrollbar.vue](../../../../app/components/Camelot/OverlayScrollbar.vue) |

[Table.vue]: #references
[table.ts]: #references
[useCamelotVirtual.ts]: #references
[OverlayScrollbar.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

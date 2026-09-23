# OverlayScrollbar

## Summary

`CamelotOverlayScrollbar` 是附著在既有捲動容器上的自訂覆蓋式捲軸，不自建容器，一個實例只負責一個方向。水平捲軸可在容器底部捲出視窗時浮動到視窗底；Table 的兩軸都用它取代原生捲軸。整體設計與和 Scrollbar 的分工見 [OverlayScrollbar 系統](../../platform/overlay-scrollbar.md)。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `container` | `HTMLElement \| null` | — | 目標捲動容器（必填） |
| `orientation` | `CamelotScrollbarOrientation` | — | 捲軸方向：`'horizontal'` 或 `'vertical'`（必填） |
| `floatingEnabled` | `boolean` | `false` | 是否允許浮動到視窗底，只對水平捲軸有效 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色，用於捲軸滑塊 |
| `startInset` | `number` | `0` | 主軸起點額外偏移（px），例如垂直捲軸避開 sticky 表頭 |

## 運作方式

### 擺放方式

1. 把捲動容器包在一個 `relative` 的外層裡，捲軸元件放在捲動容器旁邊、同一個外層內。
2. 把捲動容器的元素傳給 `container`；水平與垂直各放一個實例。
3. 平時捲軸以絕對定位貼在外層內：水平貼底、垂直貼右，兩端各內縮 6px，會被外層的圓角裁切。

來源：1. [OverlayScrollbar.vue][]　2. [Table.vue][]

### 顯示與浮動

| 情境 | 行為 |
| :--- | :--- |
| 容器在該方向沒有溢出 | 不顯示 |
| 容器完全在視窗外 | 不顯示 |
| 水平、`floatingEnabled` 為真，且容器底部在視窗下方 | 移到頁面最外層，固定在視窗底上方 6px |
| 垂直 | 永遠貼在容器右側，不會浮動 |

容器尺寸、內容尺寸、視窗捲動與縮放都會觸發重新量測，每個畫面幀最多量測一次。

來源：1. [OverlayScrollbar.vue][]　2. [useCamelotOverlayScrollbar.ts][]

### 滑塊

1. 滑塊長度依可見比例計算，最短 40px。
2. 只有滑塊接收指標事件，其餘區域不攔截點擊；拖曳滑塊即捲動容器。
3. 平時滑塊是半寬、半透明的膠囊；hover 或拖曳時放大到全寬、改用實色並加一圈淡光暈。
4. 顏色取全域的色彩角色變數，所以浮動到頁面最外層後仍維持同一顏色。

來源：1. [OverlayScrollbar.vue][]　2. [useCamelotOverlayScrollbar.ts][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| OverlayScrollbar.vue | [app/components/Camelot/OverlayScrollbar.vue](../../../../app/components/Camelot/OverlayScrollbar.vue) |
| Table.vue | [app/components/Camelot/Table.vue](../../../../app/components/Camelot/Table.vue) |
| useCamelotOverlayScrollbar.ts | [app/composables/useCamelotOverlayScrollbar.ts](../../../../app/composables/useCamelotOverlayScrollbar.ts) |

[OverlayScrollbar.vue]: #references
[Table.vue]: #references
[useCamelotOverlayScrollbar.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

# 自訂捲軸系統

## Summary

`CamelotOverlayScrollbar` 是附著在既有捲動容器上的自訂 overlay 捲軸，本身不建立捲動容器，以 `orientation` 切換水平或垂直；Table 的兩軸都用它取代原生捲軸。核心邏輯在方向感知的 `useCamelotOverlayScrollbar`。它與自建捲動容器、以 slot 包內容的包裝式 `CamelotScrollbar` 定位不同，兩者並存。

## 運作方式

### 架構

這張圖回答：Table 的兩條捲軸怎麼附著在同一個捲動容器上？

```json diagram id=圖1
{
  "type": "flow",
  "dir": "TD",
  "title": "Table 捲軸附著",
  "desc": "Table 隱藏捲動容器的原生捲軸，疊上水平與垂直兩個 overlay 捲軸，兩者共用方向感知核心去量測與拖曳容器",
  "nodes": [
    {"id": "Table", "text": "Table", "shape": "stadium"},
    {"id": "Scroll", "text": "捲動容器", "key": true},
    {"id": "HBar", "text": "水平捲軸"},
    {"id": "VBar", "text": "垂直捲軸"},
    {"id": "Core", "text": "方向感知核心"}
  ],
  "edges": [
    {"from": "Table", "to": "Scroll", "label": "隱藏原生軸"},
    {"from": "Table", "to": "HBar", "label": "傳入容器"},
    {"from": "Table", "to": "VBar", "label": "傳入容器"},
    {"from": "HBar", "to": "Core"},
    {"from": "VBar", "to": "Core"},
    {"from": "Core", "to": "Scroll", "label": "量測與定位"}
  ]
}
```

![Table 捲軸附著](overlay-scrollbar.圖1.svg)

| 單元 | 職責 |
| :--- | :--- |
| 核心 composable | 抽象主軸與交叉軸：水平的主軸是 X，垂直的主軸是 Y；負責量測、thumb 幾何、拖曳、hover、停靠與浮動 |
| 捲軸元件 | 呼叫核心，渲染 track、thumb 與 bar；水平浮動時 Teleport 到 body |

來源：1. [useCamelotOverlayScrollbar.ts][]　2. [OverlayScrollbar.vue][]

### 行為

| 行為 | 說明 |
| :--- | :--- |
| thumb 尺寸 | 視覺 bar 8px，未 hover 時縮放一半成 4px；水平往上長、垂直往左長，帶淡邊陰影；命中區 10px |
| 水平停靠 | 平時以絕對定位留在容器內，被圓角裁切 |
| 水平浮動 | 啟用浮動且表格底部超出視窗時，Teleport 到 body，固定在視窗底 |
| 垂直 | 恆停靠在右側；以起點偏移從表頭下方開始，可蓋過固定列 |
| 重新量測 | 監聽容器與 window 的 scroll、resize，並以 ResizeObserver 同時觀察容器與內容元素 |

換頁或資料變動時容器尺寸不變、內容高度改變，觀察內容元素才能即時重算並顯示捲軸。

來源：1. [useCamelotOverlayScrollbar.ts][]　2. [OverlayScrollbar.vue][]

## Props

| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `container` | `HTMLElement \| null` | — | 目標捲動容器，捲軸附著其上 |
| `orientation` | `'horizontal' \| 'vertical'` | — | 捲軸方向 |
| `floatingEnabled` | `boolean` | `false` | 只對水平有效：表格底部超出視窗時是否浮動到視窗底 |
| `color` | `CamelotColorRole` | `primary` | thumb 的色彩角色 |
| `startInset` | `number` | `0` | 主軸起點偏移，例如垂直軸避開 sticky 表頭時傳表頭高度 |

## Table 整合

### 隱藏原生軸與疊加捲軸

1. 捲動容器維持 overflow auto，保留原生滾輪、觸控與鍵盤捲動。
2. 以 scrollbar-width 與 webkit 捲軸樣式隱藏雙軸原生捲軸。
3. 疊上兩個 overlay 捲軸：水平的浮動開關由 Table 的 `floatingScrollbar` 帶入，垂直的起點偏移帶表頭高度。

來源：1. [Table.vue][]

### 保留空間

| 規則 | 說明 |
| :--- | :--- |
| 用透明 border | overflow 裁切在 padding box 內，內容不會進到 border 區，gutter 乾淨不漏，固定欄與固定列停在邊緣 |
| 寬度 6px | 等於未 hover 的 bar 4px 加內縮 2px |
| 可開關 | 關閉保留空間時不加 border，捲軸直接蓋在表格上 |

來源：1. [Table.vue][]

### Table 捲軸相關 props

| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `height` | `string` | — | 固定高度，內容少於容器時不縮短；優先於 `maxHeight` |
| `maxHeight` | `string` | — | 高度上限，內容少時縮短 |
| `floatingScrollbar` | `boolean` | `true` | 水平軸在表格底部超出視窗時是否浮動 |
| `reserveVerticalScrollbar` | `boolean` | `true` | 是否保留垂直捲軸 gutter |
| `reserveHorizontalScrollbar` | `boolean` | `true` | 是否保留水平捲軸 gutter |
| `color` | `CamelotColorRole` | `primary` | 捲軸、列 hover 與表頭底線的色彩角色 |

來源：1. [Table.vue][]

## 實作限制

| 限制 | 對策 |
| :--- | :--- |
| thumb 拖曳時頻繁 re-render 會重啟放大 transition | thumb 拆成負責定位的父層與負責視覺的 bar 子層 |
| 依方向隱藏原生軸的 webkit 選擇器在此引擎無效 | 整體隱藏原生軸，改用自訂雙軸 |
| 捲動容器的 padding 區會顯示捲動內容 | gutter 改用透明 border |
| 只觀察容器尺寸時，內容變動不會重算 | ResizeObserver 也觀察內容元素 |

來源：1. [OverlayScrollbar.vue][]　2. [useCamelotOverlayScrollbar.ts][]　3. [Table.vue][]

## 相關頁面

- [Table](../features/components/Table.md)
- [OverlayScrollbar](../features/components/OverlayScrollbar.md)
- [Scrollbar](../features/components/Scrollbar.md)：包裝式捲軸

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useCamelotOverlayScrollbar.ts | [app/composables/useCamelotOverlayScrollbar.ts](../../../app/composables/useCamelotOverlayScrollbar.ts) |
| OverlayScrollbar.vue | [app/components/Camelot/OverlayScrollbar.vue](../../../app/components/Camelot/OverlayScrollbar.vue) |
| Table.vue | [app/components/Camelot/Table.vue](../../../app/components/Camelot/Table.vue) |

[useCamelotOverlayScrollbar.ts]: #references
[OverlayScrollbar.vue]: #references
[Table.vue]: #references

---
[⚙️ Env](../environment.md) | [🏠 Wiki](../index.md)

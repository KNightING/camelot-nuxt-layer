# Timeline

## Summary

時間軸元件：依項目清單沿一條軸線排列軸點與內容，支援垂直或水平方向、單側或交錯排列，以及捲動時逐一淡入。項目型別定義在元件內，每項可帶標題、內容文字與圖片。匯入名稱為 `CamelotTimeline`（Nuxt 自動匯入）。

## 運作方式

### 排列

| 方向 | before | after |
|---|---|---|
| 垂直 | 內容在軸線左側，文字靠右 | 內容在軸線右側 |
| 水平 | 內容在軸線上方，貼齊軸線 | 內容在軸線下方，貼齊軸線 |

1. 交錯排列時，第 1、3、5… 項放 after 側，第 2、4、6… 項放 before 側。
2. 交錯排列用三條軌道，軸線置中；單側排列用兩條軌道，軸線靠邊。
3. 垂直方向以欄分軌、水平方向以列分軌，讓軸點與軸線永遠對齊。

來源：1. [Timeline.vue][]

### 軸點與淡入

1. 預設軸點為圓點，Sci-Fi 主題帶發光；可用插槽自訂。
2. 開啟淡入時，項目進入視窗 20% 後才淡入並滑入定位，每項只觸發一次。
3. 未開啟淡入或在伺服器端渲染時，所有項目直接顯示。

來源：1. [Timeline.vue][]

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `items` | `TimelineItem[]` | — | 時間軸項目清單。 |
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | 排列方向。 |
| `side` | `'before' \| 'after' \| 'alternate'` | `'after'` | 內容位置，`alternate` 為交錯。 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色。 |
| `animate` | `boolean` | `false` | 捲動逐一淡入。 |

### TimelineItem
| 欄位 | 型別 | 說明 |
| :--- | :--- | :--- |
| `title` | `string?` | 標題。 |
| `content` | `string?` | 內容文字。 |
| `image` | `string?` | 內容圖片網址，渲染於文字下方；自訂 `content` 插槽時不套用。 |
| `key` | `string \| number?` | 列表 key。 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `title` | `{ item: TimelineItem, index: number }` | 自訂標題，預設渲染 `item.title`。 |
| `content` | `{ item: TimelineItem, index: number }` | 自訂內容，預設渲染 `item.content` 與 `item.image`。 |
| `node` | `{ item: TimelineItem, index: number }` | 自訂軸點，預設渲染圓點。 |

## 相關頁面

- [時間軸](../timeline.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Timeline.vue | [app/components/Camelot/Timeline.vue](../../../../app/components/Camelot/Timeline.vue) |

[Timeline.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

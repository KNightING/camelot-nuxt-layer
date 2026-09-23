# 🕒 時間軸

## Summary

`CamelotTimeline` 是垂直或水平排列的時間軸元件，每個項目由標題、內容、選填圖片與軸上的圓點組成。內容可以放在軸線的同一側或左右（上下）交錯，支援捲動時逐項淡入、`#title`／`#content`／`#node` 三個 slot，以及四種主題下的 `color` 色彩角色。

## 運作方式

### 版面機制

這張圖回答：內容位置怎麼決定 grid 軌道與軸線位置？

```json diagram id=圖1
{
  "type": "flow",
  "dir": "LR",
  "title": "時間軸版面",
  "desc": "每個項目是一個 grid；交錯排列用三軌讓軸線置中，單側排列用兩軌讓軸線靠邊",
  "nodes": [
    {"id": "G", "text": "每個項目\n一個 grid"},
    {"id": "T1", "text": "三軌\n軸線置中"},
    {"id": "T2", "text": "兩軌\n軸線靠邊"},
    {"id": "A", "text": "軸軌\n圓點與連接線", "key": true}
  ],
  "edges": [
    {"from": "G", "to": "T1", "label": "alternate"},
    {"from": "G", "to": "T2", "label": "before 或 after"},
    {"from": "T1", "to": "A"},
    {"from": "T2", "to": "A"}
  ]
}
```

![時間軸版面](timeline.圖1.svg)

| 規則 | 說明 |
| :--- | :--- |
| 軌道方向 | 垂直排列用欄，水平排列用列，節點與線恆在同一直線上 |
| 交錯排列 | 三軌依序為「內容、軸、內容」，第 0 項內容在後側，之後逐項交替 |
| 單側排列 | before 為「內容、軸」，after 為「軸、內容」 |
| 垂直對齊 | 軸軌靠上並留 6px，12px 圓點的中心對齊標題 24px 行高的中心 |
| 水平對齊 | 圓點置中於軸列；內容貼齊軸線，before 靠下、after 靠上 |
| 水平項目寬 | 平均分配，最小 140px |

來源：1. [Timeline.vue][]

### 連接線與圖片

1. 垂直排列時，每項的連接線分上下兩段：非第一項畫上段、非最後一項畫下段，相鄰項目無縫接續，列高不一也是連續直線。
2. 水平排列時，非最後一項從圓點畫一條橫線到下一項。
3. 項目有 `image` 時，圖片顯示在文字下方，寬 200px、圓角加邊框。
4. 垂直排列的 before 側圖片靠右貼軸，水平排列時圖片置中。
5. 自訂 `#content` slot 時不渲染內建圖片。
6. scifi 主題的圓點帶光暈。

來源：1. [Timeline.vue][]

### 捲動淡入

1. `animate` 開啟時，每個項目以 IntersectionObserver 觀察，露出 20% 才淡入並位移歸位，每項只觸發一次。
2. 位移方向：水平排列由下往上，垂直 before 由左往右，其餘由右往左。
3. `animate` 關閉或在伺服器端時，所有項目直接顯示。

來源：1. [Timeline.vue][]

## Props

| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :--- | :--- |
| `items` | `TimelineItem[]` | 必填 | 欄位為 `title`、`content`、`image`、`key`，皆選填 |
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | 排列方向 |
| `side` | `'before' \| 'after' \| 'alternate'` | `'after'` | 內容位置：垂直時為左右，水平時為上下 |
| `color` | `CamelotColorRole` | `'primary'` | 圓點顏色 |
| `animate` | `boolean` | `false` | 捲動逐項淡入 |

Slots 有 title、content、node 三個，scope 都是 `item` 與 `index`。

來源：1. [Timeline.vue][]

## 相關頁面

- [Timeline](./components/Timeline.md)
- [元件清單](./components.md)
- [主題系統](../platform/theme-system.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Timeline.vue | [app/components/Camelot/Timeline.vue](../../../app/components/Camelot/Timeline.vue) |

[Timeline.vue]: #references

---
[⚙️ Env](../environment.md) | [🏠 Wiki](../index.md)

# CarouselIndicator

## Summary

CarouselIndicator 是輪播指標（圓點）元件，匯入名稱 `CamelotCarouselIndicator`（Nuxt 自動匯入）。當前點拉長成膠囊狀凸顯，點擊任一點即切換索引；[Carousel](./Carousel.md) 內建使用它，也可單獨搭配其他輪播使用。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `total` | `number` | —（必填） | 指標數量 |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | 排列方向 |
| `gap` | `number` | `8` | 點與點間距（px） |
| `size` | `number` | `8` | 點尺寸（px） |
| `color` | `CamelotColorRole` | `'primary'` | 角色色彩 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `number` | 目前選中的索引（預設 `0`） |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `dot` | `{ index, active, go }` | 自訂單一指標點；`go` 為切換至指定索引的函式 |

## 運作方式

| 規則 | 說明 |
|---|---|
| 結構 | 每個點是一顆按鈕，整組標記為分頁列，當前點標記為已選取 |
| 當前點 | 沿排列方向拉長為尺寸的 2.2 倍，填入角色色 |
| 其他點 | 半透明圓點，hover 時加深 |
| Scifi 主題 | 當前點附帶同色發光陰影 |

來源：1. [CarouselIndicator.vue][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| CarouselIndicator.vue | [app/components/Camelot/CarouselIndicator.vue](../../../../app/components/Camelot/CarouselIndicator.vue) |

[CarouselIndicator.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

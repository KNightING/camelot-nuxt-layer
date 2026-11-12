WIKI_PAGE("features/components/CarouselIndicator.md",{
"title":"CarouselIndicator",
"summary":"CarouselIndicator 是輪播指標（圓點）元件，匯入名稱 `CamelotCarouselIndicator`（Nuxt 自動匯入）。當前點拉長成膠囊狀凸顯，點擊任一點即切換索引；[Carousel](./Carousel.md) 內建使用它，也可單獨搭配其他輪播使用。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# CarouselIndicator\n\n## Summary\n\nCarouselIndicator 是輪播指標（圓點）元件，匯入名稱 `CamelotCarouselIndicator`（Nuxt 自動匯入）。當前點拉長成膠囊狀凸顯，點擊任一點即切換索引；[Carousel](./Carousel.md) 內建使用它，也可單獨搭配其他輪播使用。\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :---: | :--- |\n| `total` | `number` | —（必填） | 指標數量 |\n| `direction` | `'horizontal' \\| 'vertical'` | `'horizontal'` | 排列方向 |\n| `gap` | `number` | `8` | 點與點間距（px） |\n| `size` | `number` | `8` | 點尺寸（px） |\n| `color` | `CamelotColorRole` | `'primary'` | 角色色彩 |\n\n## v-model\n| Model | 型別 | 說明 |\n| :--- | :--- | :--- |\n| `modelValue` | `number` | 目前選中的索引（預設 `0`） |\n\n## Slots\n| Slot | 作用域參數 | 說明 |\n| :--- | :--- | :--- |\n| `dot` | `{ index, active, go }` | 自訂單一指標點；`go` 為切換至指定索引的函式 |\n\n## 運作方式\n\n| 規則 | 說明 |\n|---|---|\n| 結構 | 每個點是一顆按鈕，整組標記為分頁列，當前點標記為已選取 |\n| 當前點 | 沿排列方向拉長為尺寸的 2.2 倍，填入角色色 |\n| 其他點 | 半透明圓點，hover 時加深 |\n| Scifi 主題 | 當前點附帶同色發光陰影 |\n\n來源：1. [CarouselIndicator.vue](../../../../app/components/Camelot/CarouselIndicator.vue)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

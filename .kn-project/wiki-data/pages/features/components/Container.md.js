WIKI_PAGE("features/components/Container.md",{
"title":"Container",
"summary":"Container 是帶 Camelot 自訂捲軸的容器，匯入名稱 `CamelotContainer`（Nuxt 自動匯入）。它撐滿父層可用空間，並把內容包進 [Scrollbar](./Scrollbar.md) 的捲動區域，可切換為水平捲動。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# Container\n\n## Summary\n\nContainer 是帶 Camelot 自訂捲軸的容器，匯入名稱 `CamelotContainer`（Nuxt 自動匯入）。它撐滿父層可用空間，並把內容包進 [Scrollbar](./Scrollbar.md) 的捲動區域，可切換為水平捲動。\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :---: | :--- |\n| `horizontal` | `boolean` | — | 是否開啟水平滾動模式 |\n\n## Slots\n| Slot | 作用域參數 | 說明 |\n| :--- | :--- | :--- |\n| `default` | — | 容器內容 |\n\n## 運作方式\n\n1. 外層以 grid 撐滿父層寬高，並允許在 flex 版面中縮小，捲動才會發生在容器內。\n2. 內層使用 Scrollbar，並把 `horizontal` 原樣傳下去。\n\n來源：1. [Container.vue](../../../../app/components/Camelot/Container.vue)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

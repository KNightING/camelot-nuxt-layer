WIKI_PAGE("features/components/Scifi-Input.md",{
"title":"Scifi Input",
"summary":"Sci-Fi 主題的輸入框實作：以 HUD 外框包住原生輸入欄，依聚焦與懸停切換光暈、光澤與準星效果。內容區最低 40px，加上外框共 42px，字級繼承外層。通常由公開的 Input 依主題自動選用，匯入名稱為 `CamelotScifiInput`（Nuxt 自動匯入）。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# Scifi Input\n\n## Summary\n\nSci-Fi 主題的輸入框實作：以 HUD 外框包住原生輸入欄，依聚焦與懸停切換光暈、光澤與準星效果。內容區最低 40px，加上外框共 42px，字級繼承外層。通常由公開的 Input 依主題自動選用，匯入名稱為 `CamelotScifiInput`（Nuxt 自動匯入）。\n\n## 運作方式\n\n| 狀態 | 外框效果 |\n|---|---|\n| 聚焦 | 外框光暈與內陰影，準星收合 |\n| 懸停且未停用 | 播放一次光澤滑掠，準星收合 |\n| 停用 | 關閉掃描線 |\n| 任何狀態 | 不顯示格線背景 |\n\n內容區最低高度 40px，輸入欄本身不設字級，沿用外層字級。\n\n來源：1. [Scifi/Input.vue](../../../../app/components/Camelot/Scifi/Input.vue)　2. [Scifi/Frame.vue](../../../../app/components/Camelot/Scifi/Frame.vue)\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :---: | :--- |\n| `placeholder` | `string` | `''` | 輸入框佔位文字。 |\n| `disabled` | `boolean` | `false` | 停用輸入。 |\n| `type` | `CamelotInputType` | `'text'` | 原生 input type，由公開 Input 依實際類型下傳。 |\n\n## v-model\n| Model | 型別 | 說明 |\n| :--- | :--- | :--- |\n| `v-model` | `string \\| number` | 輸入框的值。 |\n\n## Slots\n| Slot | 作用域參數 | 說明 |\n| :--- | :--- | :--- |\n| `before` | — | 輸入框前方內容，例如圖示。 |\n| `after` | — | 輸入框後方內容，例如圖示。 |\n\n## Exposed\n| 名稱 | 型別 | 說明 |\n| :--- | :--- | :--- |\n| `inputEl` | `HTMLInputElement \\| null` | 原生 input 元素，供公開 Input 轉接給使用端呼叫聚焦或選取。 |\n\n## 相關頁面\n\n- [Scifi Frame](./Scifi-Frame.md)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

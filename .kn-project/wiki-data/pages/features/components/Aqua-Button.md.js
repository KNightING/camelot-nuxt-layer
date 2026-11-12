WIKI_PAGE("features/components/Aqua-Button.md",{
"title":"Aqua Button",
"summary":"Aqua Button 是 Aqua 主題（毛玻璃風格）的按鈕外觀實作，匯入名稱 `CamelotAquaButton`（Nuxt 自動匯入）。一般不直接使用，而是在 Aqua 主題下由公開元件 [Button](./Button.md) 自動選用；它只負責外觀、停用狀態與轉發點擊事件。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# Aqua Button\n\n## Summary\n\nAqua Button 是 Aqua 主題（毛玻璃風格）的按鈕外觀實作，匯入名稱 `CamelotAquaButton`（Nuxt 自動匯入）。一般不直接使用，而是在 Aqua 主題下由公開元件 [Button](./Button.md) 自動選用；它只負責外觀、停用狀態與轉發點擊事件。\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :---: | :--- |\n| `disabled` | `boolean` | `false` | 是否停用按鈕 |\n\n## Emits\n| 事件 | 參數 | 說明 |\n| :--- | :--- | :--- |\n| `click` | `event: MouseEvent` | 按鈕點擊事件 |\n\n## Slots\n| Slot | 作用域參數 | 說明 |\n| :--- | :--- | :--- |\n| `default` | — | 按鈕內容 |\n\n## 運作方式\n\n| 項目 | 行為 |\n|---|---|\n| 尺寸 | 最低高度 42px，字級沿用外層（由 Button 設為 1rem）；字級變大時按鈕跟著撐高 |\n| 外觀 | 玻璃填色、半粗體文字、12px 控制項圓角 |\n| 互動 | hover 略微提亮，按下時縮小回彈 |\n| 停用 | 降低不透明度並灰階，游標改為禁止 |\n\n來源：1. [Aqua/Button.vue](../../../../app/components/Camelot/Aqua/Button.vue)\n\n## 相關頁面\n- [Button](./Button.md)\n- [主題系統](../../platform/theme-system.md)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

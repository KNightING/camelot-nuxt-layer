WIKI_PAGE("features/components/Aqua-Switch.md",{
"title":"Aqua Switch",
"summary":"Aqua Switch 是 Aqua 主題（毛玻璃風格）的開關外觀實作，匯入名稱 `CamelotAquaSwitch`。一般在 Aqua 主題下由 [Switch](./Switch.md) 自動選用，點擊切換開關並送出 change 事件。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# Aqua Switch\n\n## Summary\n\nAqua Switch 是 Aqua 主題（毛玻璃風格）的開關外觀實作，匯入名稱 `CamelotAquaSwitch`。一般在 Aqua 主題下由 [Switch](./Switch.md) 自動選用，點擊切換開關並送出 change 事件。\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :---: | :--- |\n| `disabled` | `boolean` | `false` | 停用開關 |\n\n## Emits\n| 事件 | 參數 | 說明 |\n| :--- | :--- | :--- |\n| `change` | `checked: boolean` | 切換狀態改變時觸發 |\n\n## v-model\n| Model | 型別 | 說明 |\n| :--- | :--- | :--- |\n| `modelValue` | `boolean`（預設 `false`） | 開關狀態 |\n\n## 運作方式\n\n| 狀態 | 外觀 |\n|---|---|\n| 關 | 玻璃軌道底色，圓鈕在左 |\n| 開 | 玻璃填色，圓鈕滑到右側 |\n| 停用 | 半透明並灰階，點擊不切換 |\n\n來源：1. [Aqua/Switch.vue](../../../../app/components/Camelot/Aqua/Switch.vue)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

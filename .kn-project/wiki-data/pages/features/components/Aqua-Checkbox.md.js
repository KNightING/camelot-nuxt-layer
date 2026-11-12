WIKI_PAGE("features/components/Aqua-Checkbox.md",{
"title":"Aqua Checkbox",
"summary":"Aqua Checkbox 是 Aqua 主題（毛玻璃風格）的核取方塊外觀實作，匯入名稱 `CamelotAquaCheckbox`。支援方形與圓形外框、未定（半選）狀態，一般在 Aqua 主題下由 [Checkbox](./Checkbox.md) 自動選用。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# Aqua Checkbox\n\n## Summary\n\nAqua Checkbox 是 Aqua 主題（毛玻璃風格）的核取方塊外觀實作，匯入名稱 `CamelotAquaCheckbox`。支援方形與圓形外框、未定（半選）狀態，一般在 Aqua 主題下由 [Checkbox](./Checkbox.md) 自動選用。\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :---: | :--- |\n| `disabled` | `boolean` | `false` | 是否停用 |\n| `shape` | `'square' \\| 'circle'` | `'square'` | 外框形狀 |\n| `indeterminate` | `boolean` | `false` | 未定（半選）狀態，顯示橫線標記 |\n\n## Emits\n| 事件 | 參數 | 說明 |\n| :--- | :--- | :--- |\n| `change` | `checked: boolean` | 切換狀態時觸發，帶入切換後的值 |\n\n## v-model\n| Model | 型別 | 說明 |\n| :--- | :--- | :--- |\n| `modelValue` | `boolean`（預設 `false`） | 核取狀態 |\n\n## 運作方式\n\n| 狀態 | 外觀 |\n|---|---|\n| 未勾選 | 玻璃軌道底色 |\n| 勾選 | 玻璃填色，顯示打勾標記 |\n| 未定且未勾選 | 玻璃填色，顯示橫線標記 |\n| 停用 | 半透明並灰階，點擊無效、不觸發 change |\n\n來源：1. [Aqua/Checkbox.vue](../../../../app/components/Camelot/Aqua/Checkbox.vue)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

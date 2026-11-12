WIKI_PAGE("features/components/Cupertino-Switch.md",{
"title":"Cupertino Switch",
"summary":"Cupertino Switch 是 Cupertino 主題（iOS 風格）的開關外觀實作，匯入名稱 `CamelotCupertinoSwitch`。一般在 Cupertino 主題下由 [Switch](./Switch.md) 自動選用，點擊切換開關並送出 change 事件。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# Cupertino Switch\n\n## Summary\n\nCupertino Switch 是 Cupertino 主題（iOS 風格）的開關外觀實作，匯入名稱 `CamelotCupertinoSwitch`。一般在 Cupertino 主題下由 [Switch](./Switch.md) 自動選用，點擊切換開關並送出 change 事件。\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :---: | :--- |\n| `disabled` | `boolean` | `false` | 停用開關 |\n\n## Emits\n| 事件 | 參數 | 說明 |\n| :--- | :--- | :--- |\n| `change` | `checked: boolean` | 切換狀態改變時觸發 |\n\n## v-model\n| Model | 型別 | 說明 |\n| :--- | :--- | :--- |\n| `modelValue` | `boolean`（預設 `false`） | 開關狀態 |\n\n## 運作方式\n\n| 狀態 | 外觀 |\n|---|---|\n| 關 | 半透明灰色軌道，白色圓鈕在左 |\n| 開 | 軌道改為目前角色色，圓鈕滑到右側 |\n| 停用 | 半透明並灰階，點擊不切換 |\n\n來源：1. [Cupertino/Switch.vue](../../../../app/components/Camelot/Cupertino/Switch.vue)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

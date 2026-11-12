WIKI_PAGE("features/components/Cupertino-Button.md",{
"title":"Cupertino Button",
"summary":"Cupertino Button 是 Cupertino 主題（iOS 風格）的按鈕外觀實作，匯入名稱 `CamelotCupertinoButton`。一般在 Cupertino 主題下由公開元件 [Button](./Button.md) 自動選用，按壓時縮小並淡出；它只負責外觀、停用狀態與轉發點擊事件。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# Cupertino Button\n\n## Summary\n\nCupertino Button 是 Cupertino 主題（iOS 風格）的按鈕外觀實作，匯入名稱 `CamelotCupertinoButton`。一般在 Cupertino 主題下由公開元件 [Button](./Button.md) 自動選用，按壓時縮小並淡出；它只負責外觀、停用狀態與轉發點擊事件。\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :---: | :--- |\n| `disabled` | `boolean` | `false` | 是否停用按鈕 |\n\n## Emits\n| 事件 | 參數 | 說明 |\n| :--- | :--- | :--- |\n| `click` | `event: MouseEvent` | 點擊按鈕時觸發 |\n\n## Slots\n| Slot | 作用域參數 | 說明 |\n| :--- | :--- | :--- |\n| `default` | — | 按鈕內容 |\n\n## 運作方式\n\n| 項目 | 行為 |\n|---|---|\n| 尺寸 | 最低高度 42px，字級沿用外層（由 Button 設為 1rem）；字級變大時按鈕跟著撐高 |\n| 色彩 | 背景用目前角色色，文字用對應的 on 色 |\n| 按壓 | 啟用時按下縮放到 0.97 並降低不透明度 |\n| 停用 | 降低不透明度並灰階，游標改為禁止 |\n\n來源：1. [Cupertino/Button.vue](../../../../app/components/Camelot/Cupertino/Button.vue)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

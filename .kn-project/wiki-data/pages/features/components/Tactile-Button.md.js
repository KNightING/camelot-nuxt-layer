WIKI_PAGE("features/components/Tactile-Button.md",{
"title":"Tactile Button",
"summary":"Tactile Button 是 Tactile 主題的按鈕外觀實作，匯入名稱 `CamelotTactileButton`。一般在 Tactile 主題下由 [Button](./Button.md) 自動選用：角色色平塗、14px 圓角，按下縮小後以彈簧回彈。",
"svgs":{},
"seq":{},
"ext":["archive/2611121356-tactile-theme-and-new-components.md"],
"changelog":[{"plan": "2611121356-tactile-theme-and-new-components", "date": "2026-11-12", "version": "4.6.4.2", "note": "新增第五種主題風格 tactile、Button loading 與七個新元件", "issue": "[#76](https://github.com/KNightING/camelot-nuxt-layer/issues/76)", "pr": "[PR #77](https://github.com/KNightING/camelot-nuxt-layer/pull/77)"}],
"md":"# Tactile Button\n\n## Summary\n\nTactile Button 是 Tactile 主題的按鈕外觀實作，匯入名稱 `CamelotTactileButton`。一般在 Tactile 主題下由 [Button](./Button.md) 自動選用：角色色平塗、14px 圓角，按下縮小後以彈簧回彈。\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :--- | :--- |\n| `disabled` | `boolean` | `false` | 停用按鈕 |\n| `loading` | `boolean` | `false` | 處理中：文字透明佔位，中央顯示轉圈 |\n\n## Emits\n| 事件 | 參數 | 說明 |\n| :--- | :--- | :--- |\n| `click` | `event: MouseEvent` | 按鈕點擊事件 |\n\n## 外觀\n| 狀態 | 外觀 |\n| :--- | :--- |\n| 一般 | 角色色平塗加同色柔影，文字用配對前景色 |\n| 按下 | 縮小到 95%，放開以彈簧回彈 |\n| 鍵盤聚焦 | 2px 角色色焦點環 |\n| 停用 | 半透明並灰階，沒有落影 |\n\n來源：1. [Tactile/Button.vue](../../../../app/components/Camelot/Tactile/Button.vue)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

WIKI_PAGE("features/components/LevelMeter.md",{
"title":"LevelMeter",
"summary":"LevelMeter 是分段音量表，匯入名稱 `CamelotLevelMeter`。依 0 到 1 的音量點亮對應數量的分段，超過峰值門檻的分段亮起時改用警示色，左側可放聲道名稱。",
"svgs":{},
"seq":{},
"ext":["archive/2611121356-tactile-theme-and-new-components.md"],
"changelog":[{"plan": "2611121356-tactile-theme-and-new-components", "date": "2026-11-12", "version": "4.6.4.2", "note": "新增第五種主題風格 tactile、Button loading 與七個新元件", "issue": "[#76](https://github.com/KNightING/camelot-nuxt-layer/issues/76)", "pr": "[PR #77](https://github.com/KNightING/camelot-nuxt-layer/pull/77)"}],
"md":"# LevelMeter\n\n## Summary\n\nLevelMeter 是分段音量表，匯入名稱 `CamelotLevelMeter`。依 0 到 1 的音量點亮對應數量的分段，超過峰值門檻的分段亮起時改用警示色，左側可放聲道名稱。\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :--- | :--- |\n| `level` | `number` | `0` | 目前音量，0 到 1 |\n| `segments` | `number` | `16` | 分段數 |\n| `peakFrom` | `number` | `0.85` | 超過這個比例的分段視為峰值區 |\n| `label` | `string` | `''` | 聲道名稱等標籤 |\n| `color` | `CamelotColorRole` | `'primary'` | 一般分段亮起時的色彩角色 |\n\n## Slots\n| Slot | 作用域參數 | 說明 |\n| :--- | :--- | :--- |\n| `label` | — | 自訂標籤 |\n\n## 外觀\n| 主題 | 分段形狀 |\n| :--- | :--- |\n| scifi | 直角，亮起時帶外發光 |\n| aqua、cupertino | 膠囊 |\n| tactile、material | 2px 圓角 |\n\n來源：1. [LevelMeter.vue](../../../../app/components/Camelot/LevelMeter.vue)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

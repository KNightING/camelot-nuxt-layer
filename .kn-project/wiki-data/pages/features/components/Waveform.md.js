WIKI_PAGE("features/components/Waveform.md",{
"title":"Waveform",
"summary":"Waveform 是音訊波形元件，匯入名稱 `CamelotWaveform`。依傳入的振幅陣列畫出一排長條，已播放的部分上色；可點擊、拖曳或用方向鍵跳轉，進度以 0 到 1 的數值雙向綁定。元件只負責畫面與跳轉，不播放聲音。",
"svgs":{},
"seq":{},
"ext":["archive/2611121356-tactile-theme-and-new-components.md"],
"changelog":[{"plan": "2611121356-tactile-theme-and-new-components", "date": "2026-11-12", "version": "4.6.4.2", "note": "新增第五種主題風格 tactile、Button loading 與七個新元件", "issue": "[#76](https://github.com/KNightING/camelot-nuxt-layer/issues/76)", "pr": "[PR #77](https://github.com/KNightING/camelot-nuxt-layer/pull/77)"}],
"md":"# Waveform\n\n## Summary\n\nWaveform 是音訊波形元件，匯入名稱 `CamelotWaveform`。依傳入的振幅陣列畫出一排長條，已播放的部分上色；可點擊、拖曳或用方向鍵跳轉，進度以 0 到 1 的數值雙向綁定。元件只負責畫面與跳轉，不播放聲音。\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :--- | :--- |\n| `peaks` | `number[]` | `[]` | 每根長條的振幅，0 到 1；陣列長度即長條數 |\n| `height` | `string` | `'72px'` | 整體高度 |\n| `seekable` | `boolean` | `true` | 是否可點擊、拖曳或用方向鍵跳轉 |\n| `disabled` | `boolean` | `false` | 停用後變淡且無法跳轉 |\n| `color` | `CamelotColorRole` | `'primary'` | 已播放部分的色彩角色 |\n\n## Emits\n| 事件 | 參數 | 說明 |\n| :--- | :--- | :--- |\n| `seek` | `progress: number` | 使用者跳轉後觸發，值為 0 到 1 |\n\n## v-model\n| Model | 型別 | 說明 |\n| :--- | :--- | :--- |\n| `progress` | `number`（預設 `0`） | 播放進度，0 到 1 |\n\n## 規則\n| 規則 | 說明 |\n| :--- | :--- |\n| 最小高度 | 振幅再小的長條也保留 8% 高度，靜音段才看得到 |\n| 方向鍵 | 左右鍵每次移動 5% |\n| 拖曳 | 按下後拖出元件範圍仍持續跳轉 |\n| 超出範圍的值 | 進度與振幅都會限制在 0 到 1 |\n\n來源：1. [Waveform.vue](../../../../app/components/Camelot/Waveform.vue)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

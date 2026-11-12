WIKI_PAGE("features/components/Tactile-Switch.md",{
"title":"Tactile Switch",
"summary":"Tactile Switch 是 Tactile 主題的開關外觀實作，匯入名稱 `CamelotTactileSwitch`。一般在 Tactile 主題下由 [Switch](./Switch.md) 自動選用。它是可用鍵盤操作的按鈕，按住時拇指會橫向拉伸，放開後以彈簧滑到另一側。",
"svgs":{},
"seq":{},
"ext":["archive/2611121356-tactile-theme-and-new-components.md"],
"changelog":[{"plan": "2611121356-tactile-theme-and-new-components", "date": "2026-11-12", "version": "4.6.4.2", "note": "新增第五種主題風格 tactile、Button loading 與七個新元件", "issue": "[#76](https://github.com/KNightING/camelot-nuxt-layer/issues/76)", "pr": "[PR #77](https://github.com/KNightING/camelot-nuxt-layer/pull/77)"}],
"md":"# Tactile Switch\n\n## Summary\n\nTactile Switch 是 Tactile 主題的開關外觀實作，匯入名稱 `CamelotTactileSwitch`。一般在 Tactile 主題下由 [Switch](./Switch.md) 自動選用。它是可用鍵盤操作的按鈕，按住時拇指會橫向拉伸，放開後以彈簧滑到另一側。\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :--- | :--- |\n| `disabled` | `boolean` | `false` | 停用開關 |\n\n## Emits\n| 事件 | 參數 | 說明 |\n| :--- | :--- | :--- |\n| `change` | `checked: boolean` | 切換狀態改變時觸發 |\n\n## v-model\n| Model | 型別 | 說明 |\n| :--- | :--- | :--- |\n| `modelValue` | `boolean`（預設 `false`） | 開關狀態 |\n\n## 外觀\n| 狀態 | 外觀 |\n| :--- | :--- |\n| 關 | 46×28 灰階軌道，22px 白色拇指在左 |\n| 開 | 軌道改為角色色平塗，拇指滑到右側 |\n| 按住 | 拇指拉長到 28px；開啟狀態下往左長，不會超出軌道 |\n| 停用 | 半透明並灰階，無法切換 |\n\n來源：1. [Tactile/Switch.vue](../../../../app/components/Camelot/Tactile/Switch.vue)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

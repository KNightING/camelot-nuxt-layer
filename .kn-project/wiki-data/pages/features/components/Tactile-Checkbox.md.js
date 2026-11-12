WIKI_PAGE("features/components/Tactile-Checkbox.md",{
"title":"Tactile Checkbox",
"summary":"Tactile Checkbox 是 Tactile 主題的勾選框外觀實作，匯入名稱 `CamelotTactileCheckbox`。一般在 Tactile 主題下由 [Checkbox](./Checkbox.md) 自動選用。它是可用鍵盤操作的按鈕，勾號以描線方式出現，支援半選與圓形外框。",
"svgs":{},
"seq":{},
"ext":["archive/2611121356-tactile-theme-and-new-components.md"],
"changelog":[{"plan": "2611121356-tactile-theme-and-new-components", "date": "2026-11-12", "version": "4.6.4.2", "note": "新增第五種主題風格 tactile、Button loading 與七個新元件", "issue": "[#76](https://github.com/KNightING/camelot-nuxt-layer/issues/76)", "pr": "[PR #77](https://github.com/KNightING/camelot-nuxt-layer/pull/77)"}],
"md":"# Tactile Checkbox\n\n## Summary\n\nTactile Checkbox 是 Tactile 主題的勾選框外觀實作，匯入名稱 `CamelotTactileCheckbox`。一般在 Tactile 主題下由 [Checkbox](./Checkbox.md) 自動選用。它是可用鍵盤操作的按鈕，勾號以描線方式出現，支援半選與圓形外框。\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :--- | :--- |\n| `disabled` | `boolean` | `false` | 停用勾選框 |\n| `shape` | `'square' | 'circle'` | `'square'` | 外框形狀 |\n| `indeterminate` | `boolean` | `false` | 半選狀態；已勾選時不顯示 |\n\n## Emits\n| 事件 | 參數 | 說明 |\n| :--- | :--- | :--- |\n| `change` | `checked: boolean` | 勾選狀態改變時觸發 |\n\n## v-model\n| Model | 型別 | 說明 |\n| :--- | :--- | :--- |\n| `modelValue` | `boolean`（預設 `false`） | 勾選狀態 |\n\n## 外觀\n| 狀態 | 外觀 |\n| :--- | :--- |\n| 未勾選 | 22×22，1.5px 內框線 |\n| 勾選 | 角色色平塗，勾號描線出現 |\n| 半選 | 角色色平塗，中央一條橫線 |\n| 按下 | 縮小到 85%，放開以彈簧回彈 |\n\n來源：1. [Tactile/Checkbox.vue](../../../../app/components/Camelot/Tactile/Checkbox.vue)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

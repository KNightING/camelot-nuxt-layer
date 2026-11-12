WIKI_PAGE("features/components/Tactile-Radio.md",{
"title":"Tactile Radio",
"summary":"Tactile Radio 是 Tactile 主題的單選圓鈕外觀實作，匯入名稱 `CamelotTactileRadio`。一般在 Tactile 主題下由 [Radio](./Radio.md) 自動選用。它是可用鍵盤操作的按鈕，選取時中央圓點以彈簧放大。",
"svgs":{},
"seq":{},
"ext":["archive/2611121356-tactile-theme-and-new-components.md"],
"changelog":[{"plan": "2611121356-tactile-theme-and-new-components", "date": "2026-11-12", "version": "4.6.4.2", "note": "新增第五種主題風格 tactile、Button loading 與七個新元件", "issue": "[#76](https://github.com/KNightING/camelot-nuxt-layer/issues/76)", "pr": "[PR #77](https://github.com/KNightING/camelot-nuxt-layer/pull/77)"}],
"md":"# Tactile Radio\n\n## Summary\n\nTactile Radio 是 Tactile 主題的單選圓鈕外觀實作，匯入名稱 `CamelotTactileRadio`。一般在 Tactile 主題下由 [Radio](./Radio.md) 自動選用。它是可用鍵盤操作的按鈕，選取時中央圓點以彈簧放大。\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :--- | :--- |\n| `disabled` | `boolean` | `false` | 停用圓鈕 |\n| `deselectable` | `boolean` | `false` | 點擊已選取的圓鈕可取消選取 |\n\n## Emits\n| 事件 | 參數 | 說明 |\n| :--- | :--- | :--- |\n| `change` | `checked: boolean` | 選取狀態改變時觸發 |\n\n## v-model\n| Model | 型別 | 說明 |\n| :--- | :--- | :--- |\n| `modelValue` | `boolean`（預設 `false`） | 選取狀態 |\n\n## 外觀\n| 狀態 | 外觀 |\n| :--- | :--- |\n| 未選取 | 22×22 圓形，1.5px 內框線 |\n| 選取 | 角色色平塗，中央圓點以彈簧放大 |\n| 按下 | 縮小到 85%，放開以彈簧回彈 |\n\n來源：1. [Tactile/Radio.vue](../../../../app/components/Camelot/Tactile/Radio.vue)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

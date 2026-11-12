WIKI_PAGE("features/components/Tactile-Input.md",{
"title":"Tactile Input",
"summary":"Tactile Input 是 Tactile 主題的輸入框外觀實作，匯入名稱 `CamelotTactileInput`。一般在 Tactile 主題下由 [Input](./Input.md) 自動選用：實心灰階底、14px 圓角，聚焦時轉為亮底並加上 2px 角色色外框。",
"svgs":{},
"seq":{},
"ext":["archive/2611121356-tactile-theme-and-new-components.md"],
"changelog":[{"plan": "2611121356-tactile-theme-and-new-components", "date": "2026-11-12", "version": "4.6.4.2", "note": "新增第五種主題風格 tactile、Button loading 與七個新元件", "issue": "[#76](https://github.com/KNightING/camelot-nuxt-layer/issues/76)", "pr": "[PR #77](https://github.com/KNightING/camelot-nuxt-layer/pull/77)"}],
"md":"# Tactile Input\n\n## Summary\n\nTactile Input 是 Tactile 主題的輸入框外觀實作，匯入名稱 `CamelotTactileInput`。一般在 Tactile 主題下由 [Input](./Input.md) 自動選用：實心灰階底、14px 圓角，聚焦時轉為亮底並加上 2px 角色色外框。\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :--- | :--- |\n| `placeholder` | `string` | `''` | 提示文字 |\n| `disabled` | `boolean` | `false` | 停用輸入 |\n| `type` | `CamelotInputType` | `'text'` | 原生輸入類型 |\n\n## Emits\n| 事件 | 參數 | 說明 |\n| :--- | :--- | :--- |\n| `focus` | `event: FocusEvent` | 原生輸入框取得焦點 |\n| `blur` | `event: FocusEvent` | 原生輸入框失去焦點 |\n\n## v-model\n| Model | 型別 | 說明 |\n| :--- | :--- | :--- |\n| `modelValue` | `string | number` | 輸入值 |\n\n## Slots\n| Slot | 作用域參數 | 說明 |\n| :--- | :--- | :--- |\n| `before` | — | 輸入框左側內容 |\n| `after` | — | 輸入框右側內容 |\n\n## 對外公開\n| 名稱 | 說明 |\n| :--- | :--- |\n| `inputEl` | 原生輸入框元素，供外層呼叫聚焦或全選 |\n\n來源：1. [Tactile/Input.vue](../../../../app/components/Camelot/Tactile/Input.vue)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

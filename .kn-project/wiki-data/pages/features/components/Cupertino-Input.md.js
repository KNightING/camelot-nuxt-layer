WIKI_PAGE("features/components/Cupertino-Input.md",{
"title":"Cupertino Input",
"summary":"Cupertino Input 是 Cupertino 主題（iOS 風格）的輸入框外觀實作，匯入名稱 `CamelotCupertinoInput`。一般在 Cupertino 主題下由公開元件 [Input](./Input.md) 自動選用，聚焦時切換背景並顯示內框線；它提供前後插槽，並把原生 input 元素暴露給外層。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# Cupertino Input\n\n## Summary\n\nCupertino Input 是 Cupertino 主題（iOS 風格）的輸入框外觀實作，匯入名稱 `CamelotCupertinoInput`。一般在 Cupertino 主題下由公開元件 [Input](./Input.md) 自動選用，聚焦時切換背景並顯示內框線；它提供前後插槽，並把原生 input 元素暴露給外層。\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :---: | :--- |\n| `placeholder` | `string` | `''` | 佔位文字 |\n| `disabled` | `boolean` | `false` | 是否停用輸入框 |\n| `type` | `CamelotInputType` | `'text'` | 原生 input type，由 Input 依密碼顯示切換狀態下傳 |\n\n## v-model\n| Model | 型別 | 說明 |\n| :--- | :--- | :--- |\n| `modelValue` | `string \\| number` | 輸入框的值 |\n\n## Slots\n| Slot | 作用域參數 | 說明 |\n| :--- | :--- | :--- |\n| `before` | — | 輸入框前方（左側）的內容 |\n| `after` | — | 輸入框後方（右側）的內容 |\n\n## Exposed\n| 名稱 | 型別 | 說明 |\n| :--- | :--- | :--- |\n| `inputEl` | `Ref<HTMLInputElement \\| null>` | 原生 input，供 Input 轉接給消費端呼叫 focus、select |\n\n## 運作方式\n\n| 項目 | 行為 |\n|---|---|\n| 尺寸 | 最低高度 42px，字級繼承自 Input 根節點；字級變大時跟著撐高 |\n| 外觀 | 淺灰填色底、10px 圓角、無外框 |\n| 聚焦 | 背景改為 surface 色，並顯示目前角色色的內框線 |\n\n來源：1. [Cupertino/Input.vue](../../../../app/components/Camelot/Cupertino/Input.vue)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

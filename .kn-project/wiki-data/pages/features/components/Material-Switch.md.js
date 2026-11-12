WIKI_PAGE("features/components/Material-Switch.md",{
"title":"Material Switch",
"summary":"`CamelotMaterialSwitch` 是 Material 主題的開關：40×22px 的膠囊軌道，開啟時軌道填滿色彩角色、圓鈕放大並移到右側。一般不直接使用，而是由 `CamelotSwitch` 在 Material 主題（也是預設主題）下自動選用；色彩角色由外層元件提供。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# Material Switch\n\n## Summary\n\n`CamelotMaterialSwitch` 是 Material 主題的開關：40×22px 的膠囊軌道，開啟時軌道填滿色彩角色、圓鈕放大並移到右側。一般不直接使用，而是由 `CamelotSwitch` 在 Material 主題（也是預設主題）下自動選用；色彩角色由外層元件提供。\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :---: | :--- |\n| `disabled` | `boolean` | `false` | 停用開關 |\n\n## Emits\n| 事件 | 參數 | 說明 |\n| :--- | :--- | :--- |\n| `change` | `checked: boolean` | 切換狀態改變時觸發，帶入切換後的值 |\n\n## v-model\n| Model | 型別 | 說明 |\n| :--- | :--- | :--- |\n| `modelValue` | `boolean`（預設 `false`） | 開關狀態 |\n\n## 運作方式\n\n### 狀態外觀\n\n| 狀態 | 外觀 |\n| :--- | :--- |\n| 關閉 | 外框線色框線、淺色容器底，左側 12px 小圓鈕 |\n| 開啟 | 軌道與框線填滿色彩角色，右側 16px 圓鈕用角色前景色 |\n| 停用 | 軌道改為淡灰、透明度 38%，游標顯示禁止 |\n\n1. 點擊軌道即切換狀態並發出 `change`。\n2. 停用時點擊不會切換，也不發出事件。\n\n來源：1. [Material/Switch.vue](../../../../app/components/Camelot/Material/Switch.vue)\n\n## 相關頁面\n\n- [Switch](./Switch.md)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

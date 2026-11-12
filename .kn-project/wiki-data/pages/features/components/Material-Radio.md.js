WIKI_PAGE("features/components/Material-Radio.md",{
"title":"MaterialRadio",
"summary":"`CamelotMaterialRadio` 是 Material 主題的單選圓鈕：20px 圓框，選取時框線與內部圓點改用色彩角色。一般不直接使用，而是由 `CamelotRadio` 在 Material 主題（也是預設主題）下自動選用；標籤與色彩角色由外層元件提供。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# MaterialRadio\n\n## Summary\n\n`CamelotMaterialRadio` 是 Material 主題的單選圓鈕：20px 圓框，選取時框線與內部圓點改用色彩角色。一般不直接使用，而是由 `CamelotRadio` 在 Material 主題（也是預設主題）下自動選用；標籤與色彩角色由外層元件提供。\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :---: | :--- |\n| `disabled` | `boolean` | `false` | 是否停用 |\n| `deselectable` | `boolean` | `false` | 點擊已選取項可取消選取（非必填情境） |\n\n## Emits\n| 事件 | 參數 | 說明 |\n| :--- | :--- | :--- |\n| `change` | `checked: boolean` | 選取狀態切換時觸發 |\n\n## v-model\n| Model | 型別 | 說明 |\n| :--- | :--- | :--- |\n| `modelValue` | `boolean`（預設 `false`） | 是否為選取狀態 |\n\n## 運作方式\n\n### 點擊\n\n1. 未選取時點擊：改為選取並發出 `change`。\n2. 已選取時點擊：只有 `deselectable` 為真才會取消選取；否則不動作。\n3. 停用時不接受點擊，透明度降為 38%。\n\n來源：1. [Material/Radio.vue](../../../../app/components/Camelot/Material/Radio.vue)\n\n### 外觀\n\n外圈為 2px 框線；選取時內部圓點由中心放大到框內寬度的 62.5%，框線與圓點都用色彩角色，未選取時框線為外框線色。\n\n來源：1. [Material/Radio.vue](../../../../app/components/Camelot/Material/Radio.vue)\n\n## 相關頁面\n\n- [Radio](./Radio.md)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

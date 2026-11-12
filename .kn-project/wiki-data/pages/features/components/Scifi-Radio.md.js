WIKI_PAGE("features/components/Scifi-Radio.md",{
"title":"ScifiRadio",
"summary":"Sci-Fi 主題的單選圓鈕視覺實作，選取時邊框發光、中央指示點以縮放方式出現。通常由公開的 Radio 依主題自動選用，匯入名稱為 `CamelotScifiRadio`（Nuxt 自動匯入）。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# ScifiRadio\n\n## Summary\n\nSci-Fi 主題的單選圓鈕視覺實作，選取時邊框發光、中央指示點以縮放方式出現。通常由公開的 Radio 依主題自動選用，匯入名稱為 `CamelotScifiRadio`（Nuxt 自動匯入）。\n\n## 運作方式\n\n1. 停用時點擊不作用。\n2. 已選取且未開啟可取消選取時，再次點擊不會取消。\n3. 其餘情況點擊會切換選取狀態，並發出變更事件。\n4. 選取時邊框發光，中央指示點縮為一半大小，顏色取目前色彩變數。\n\n來源：1. [Scifi/Radio.vue](../../../../app/components/Camelot/Scifi/Radio.vue)\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :---: | :--- |\n| `disabled` | `boolean` | `false` | 是否停用。 |\n| `deselectable` | `boolean` | `false` | 點擊已選取項可取消選取，用於非必填情境。 |\n\n## Emits\n| 事件 | 參數 | 說明 |\n| :--- | :--- | :--- |\n| `change` | `checked: boolean` | 選取狀態切換時觸發。 |\n\n## v-model\n| Model | 型別 | 說明 |\n| :--- | :--- | :--- |\n| `modelValue` | `boolean`，預設 `false` | 是否為選取狀態。 |\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

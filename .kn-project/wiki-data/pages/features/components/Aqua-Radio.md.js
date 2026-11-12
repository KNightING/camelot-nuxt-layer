WIKI_PAGE("features/components/Aqua-Radio.md",{
"title":"Aqua Radio",
"summary":"Aqua Radio 是 Aqua 主題（毛玻璃風格）的單選圓鈕外觀實作，匯入名稱 `CamelotAquaRadio`。一般在 Aqua 主題下由 [Radio](./Radio.md) 自動選用；預設選取後不能再點掉，開啟可取消選取時才允許點已選項取消。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# Aqua Radio\n\n## Summary\n\nAqua Radio 是 Aqua 主題（毛玻璃風格）的單選圓鈕外觀實作，匯入名稱 `CamelotAquaRadio`。一般在 Aqua 主題下由 [Radio](./Radio.md) 自動選用；預設選取後不能再點掉，開啟可取消選取時才允許點已選項取消。\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :---: | :--- |\n| `disabled` | `boolean` | `false` | 是否停用 |\n| `deselectable` | `boolean` | `false` | 是否允許點擊已選取項目以取消選取（非必填情境） |\n\n## Emits\n| 事件 | 參數 | 說明 |\n| :--- | :--- | :--- |\n| `change` | `checked: boolean` | 切換狀態時觸發，帶入切換後的值 |\n\n## v-model\n| Model | 型別 | 說明 |\n| :--- | :--- | :--- |\n| `modelValue` | `boolean`（預設 `false`） | 是否選取 |\n\n## 運作方式\n\n| 狀態 | 行為 |\n|---|---|\n| 未選取 | 玻璃軌道底色，點擊後選取 |\n| 已選取 | 玻璃填色，中央圓點放大浮現 |\n| 已選取再點 | 預設不變；開啟可取消選取時改回未選取 |\n| 停用 | 半透明並灰階，點擊無效 |\n\n中央圓點以滿版圓縮放呈現，避免非整數像素比螢幕下的半像素偏移。\n\n來源：1. [Aqua/Radio.vue](../../../../app/components/Camelot/Aqua/Radio.vue)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

WIKI_PAGE("features/components/Scifi-Switch.md",{
"title":"Scifi Switch",
"summary":"Sci-Fi 主題的開關切換元件：滑塊旁顯示 ON 或 OFF 狀態字，外圍有準星裝飾，切換時閃一下亮光。通常由公開的 Switch 依主題自動選用，匯入名稱為 `CamelotScifiSwitch`（Nuxt 自動匯入）。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# Scifi Switch\n\n## Summary\n\nSci-Fi 主題的開關切換元件：滑塊旁顯示 ON 或 OFF 狀態字，外圍有準星裝飾，切換時閃一下亮光。通常由公開的 Switch 依主題自動選用，匯入名稱為 `CamelotScifiSwitch`（Nuxt 自動匯入）。\n\n## 運作方式\n\n1. 點擊時切換開關狀態，並發出變更事件，帶入切換後的值。\n2. 切換瞬間播放約 200ms 的亮度閃爍與光暈動畫。\n3. 準星裝飾平時半透明，懸停或開啟時完整顯示。\n4. 停用時忽略點擊、不發出事件，外觀轉為灰階半透明。\n\n來源：1. [Scifi/Switch.vue](../../../../app/components/Camelot/Scifi/Switch.vue)\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :---: | :--- |\n| `disabled` | `boolean` | `false` | 是否停用，停用時不可點擊並套用灰階透明樣式。 |\n\n## Emits\n| 事件 | 參數 | 說明 |\n| :--- | :--- | :--- |\n| `change` | `checked: boolean` | 切換狀態時觸發，帶入切換後的值。 |\n\n## v-model\n| Model | 型別 | 說明 |\n| :--- | :--- | :--- |\n| `modelValue` | `boolean`，預設 `false` | 開關狀態，開為 `true`、關為 `false`。 |\n\n## 相關頁面\n\n- [Scifi Reticle](./Scifi-Reticle.md)\n- [Switch](./Switch.md)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

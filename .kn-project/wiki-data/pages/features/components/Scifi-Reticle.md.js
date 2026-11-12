WIKI_PAGE("features/components/Scifi-Reticle.md",{
"title":"Scifi Reticle",
"summary":"Sci-Fi 主題的四角瞄準框裝飾，啟用或滑鼠移入時四角向內收合並發光。它由 HUD 外框與 Sci-Fi 開關內建使用，通常不直接放在頁面上，匯入名稱為 `CamelotScifiReticle`（Nuxt 自動匯入）。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# Scifi Reticle\n\n## Summary\n\nSci-Fi 主題的四角瞄準框裝飾，啟用或滑鼠移入時四角向內收合並發光。它由 HUD 外框與 Sci-Fi 開關內建使用，通常不直接放在頁面上，匯入名稱為 `CamelotScifiReticle`（Nuxt 自動匯入）。\n\n## 運作方式\n\n1. 以絕對定位貼在父層外圍，四邊各向外延伸 8px。\n2. 預設不接收滑鼠事件；開啟可懸停時改為接收，讓滑鼠移入也能觸發收合。\n3. 顏色取目前色彩變數，沒有時退回主題主色，再退回文字顏色。\n\n來源：1. [Scifi/Reticle.vue](../../../../app/components/Camelot/Scifi/Reticle.vue)\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :---: | :--- |\n| `active` | `boolean` | — | 是否啟用，四角收合並發光。 |\n| `hoverable` | `boolean` | — | 是否可由滑鼠移入觸發，並開啟指標事件。 |\n\n## 相關頁面\n\n- [Scifi Frame](./Scifi-Frame.md)\n- [Scifi Switch](./Scifi-Switch.md)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

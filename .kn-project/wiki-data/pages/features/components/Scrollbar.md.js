WIKI_PAGE("features/components/Scrollbar.md",{
"title":"Scrollbar",
"summary":"自訂捲軸容器：隱藏原生捲軸，捲動時淡入一條可拖曳的細捲軸，停止捲動後自動淡出，支援垂直與水平兩種模式。匯入名稱為 `CamelotScrollbar`（Nuxt 自動匯入）。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# Scrollbar\n\n## Summary\n\n自訂捲軸容器：隱藏原生捲軸，捲動時淡入一條可拖曳的細捲軸，停止捲動後自動淡出，支援垂直與水平兩種模式。匯入名稱為 `CamelotScrollbar`（Nuxt 自動匯入）。\n\n## 運作方式\n\n1. 原生捲軸以樣式隱藏，內容仍可正常捲動。\n2. 捲動時捲軸淡入；停止捲動 1 秒後淡出。\n3. 捲軸滑塊的長度與位置依可視範圍占總內容的比例計算。\n4. 按住滑塊拖曳時，依拖曳距離換算並同步內容的捲動位置。\n5. 捲動與視窗縮放觸發的量測合併到下一個畫面幀，每幀最多重算一次；捲動監聽為 passive。\n6. 掛載時立即量測一次。\n\n來源：1. [Scrollbar.vue](../../../../app/components/Camelot/Scrollbar.vue)\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :---: | :--- |\n| `horizontal` | `boolean` | — | 是否為水平捲動模式，否則為垂直。 |\n\n## Slots\n| Slot | 作用域參數 | 說明 |\n| :--- | :--- | :--- |\n| `default` | — | 捲動容器內容。 |\n\n## Exposed\n| 名稱 | 說明 |\n| :--- | :--- |\n| `scrollToTop(options?)` | 捲動至頂端；`options.behavior` 預設 `'smooth'`。 |\n| `scrollToBottom(options?)` | 捲動至底端；`options.behavior` 預設 `'smooth'`。 |\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

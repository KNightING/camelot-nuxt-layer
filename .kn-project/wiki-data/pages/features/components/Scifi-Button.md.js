WIKI_PAGE("features/components/Scifi-Button.md",{
"title":"Scifi Button",
"summary":"`CamelotScifiButton` 是 Sci-Fi 主題的按鈕：外層包 HUD 外框，平時有掃描線，hover 時有光澤掠過與準星，按下時整個外框填滿色彩角色。文字為粗體大寫並加寬字距。一般不直接使用，而是由 `CamelotButton` 在 Sci-Fi 主題下自動選用；色彩角色由外層元件提供。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# Scifi Button\n\n## Summary\n\n`CamelotScifiButton` 是 Sci-Fi 主題的按鈕：外層包 HUD 外框，平時有掃描線，hover 時有光澤掠過與準星，按下時整個外框填滿色彩角色。文字為粗體大寫並加寬字距。一般不直接使用，而是由 `CamelotButton` 在 Sci-Fi 主題下自動選用；色彩角色由外層元件提供。\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :---: | :--- |\n| `disabled` | `boolean` | `false` | 是否停用按鈕 |\n\n## Emits\n| 事件 | 參數 | 說明 |\n| :--- | :--- | :--- |\n| `click` | `event: MouseEvent` | 點擊按鈕時觸發 |\n\n## Slots\n| Slot | 作用域參數 | 說明 |\n| :--- | :--- | :--- |\n| `default` | — | 按鈕內容 |\n\n## 運作方式\n\n### 互動狀態\n\n| 狀態 | HUD 外框效果 |\n| :--- | :--- |\n| 平時 | 顯示掃描線 |\n| hover | 光澤掠過，準星啟動 |\n| 聚焦 | 外框聚焦樣式，準星啟動 |\n| 按下 | 外框填滿色彩角色，文字改用角色前景色 |\n| 停用 | 關閉掃描線與所有互動效果，透明度 60%，不接受點擊，也無法以 Tab 聚焦 |\n\n來源：1. [Scifi/Button.vue](../../../../app/components/Camelot/Scifi/Button.vue)　2. [Scifi/Frame.vue](../../../../app/components/Camelot/Scifi/Frame.vue)\n\n### 外觀\n\n按鈕內容區最低 40px、最窄 120px，左右留白 24px；文字取色彩角色混入兩成白色，粗體、全大寫、字距加寬。\n\n來源：1. [Scifi/Button.vue](../../../../app/components/Camelot/Scifi/Button.vue)\n\n## 相關頁面\n\n- [Button](./Button.md)\n- [Scifi Frame](./Scifi-Frame.md)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

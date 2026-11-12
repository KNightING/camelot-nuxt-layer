WIKI_PAGE("features/components/RippleEffect.md",{
"title":"RippleEffect",
"summary":"`CamelotRippleEffect` 是包住任意內容的容器，指標按下時從按下的位置擴散一圈水波紋，650 毫秒後自動移除。Material 按鈕、RippleTabs、NumberCounter 的加減按鈕都用它提供點擊回饋。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md", "archive/2609231702-fix-wiki-review-code-defects.md"],
"changelog":[{"plan": "2609231702-fix-wiki-review-code-defects", "date": "2026-09-23", "version": "—", "note": "修正程式碼缺陷後更新為修正後的行為", "issue": "[#47](https://github.com/KNightING/camelot-nuxt-layer/issues/47)", "pr": "—"}, {"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# RippleEffect\n\n## Summary\n\n`CamelotRippleEffect` 是包住任意內容的容器，指標按下時從按下的位置擴散一圈水波紋，650 毫秒後自動移除。Material 按鈕、RippleTabs、NumberCounter 的加減按鈕都用它提供點擊回饋。\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :---: | :--- |\n| `rippleColor` | `string` | — | 水波紋顏色，可為任何 CSS 色值；未指定時沿用全域主題 |\n\n## Slots\n| Slot | 作用域參數 | 說明 |\n| :--- | :--- | :--- |\n| `default` | — | 要套用水波紋效果的內容 |\n\n## 運作方式\n\n### 水波紋\n\n1. 指標按下時，當場量測一次容器大小，不做常駐追蹤；同一頁可能有數十個實例，常駐追蹤會掛上大量捲動與縮放監聽。\n2. 水波紋直徑為容器對角線的兩倍，保證從任一點擴散都能蓋滿容器。\n3. 水波紋以按下點為圓心，在 600 毫秒內從 0 放大並淡出。\n4. 容器裁切溢出，水波紋不接收指標事件，不影響內容的點擊。\n\n來源：1. [RippleEffect.vue](../../../../app/components/Camelot/RippleEffect.vue)\n\n### 顏色\n\n`rippleColor` 可以是 hex、rgb 函式或 CSS 變數等任何色值，由模板直接綁到容器的漣漪色 CSS 變數，掛載時就生效。\n\n沒指定時不覆寫變數，沿用全域色彩方案的漣漪色。\n\n來源：1. [RippleEffect.vue](../../../../app/components/Camelot/RippleEffect.vue)　2. [useCustomColorScheme.ts](../../../../app/composables/useCustomColorScheme.ts)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

WIKI_PAGE("features/components/RevealText.md",{
"title":"RevealText",
"summary":"`CamelotRevealText` 顯示一段文字，再以一道沿指定角度推進的遮罩，把同一段文字以指定的填色或背景逐步覆蓋上去。可自動播放、滑鼠移入播放或由外部控制播放，時長、延遲、方向與填色都可調。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# RevealText\n\n## Summary\n\n`CamelotRevealText` 顯示一段文字，再以一道沿指定角度推進的遮罩，把同一段文字以指定的填色或背景逐步覆蓋上去。可自動播放、滑鼠移入播放或由外部控制播放，時長、延遲、方向與填色都可調。\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :---: | :--- |\n| `text` | `string` | — | 要顯示的文字（必填） |\n| `trigger` | `'auto' \\| 'hover' \\| 'manual'` | `'auto'` | 觸發方式：自動播放、滑鼠移入播放、手動控制 |\n| `play` | `boolean` | `false` | `manual` 模式下設為真即播放 |\n| `angle` | `string` | `'0deg'` | 揭示推進方向（CSS 角度） |\n| `duration` | `string` | `'500ms'` | 動畫時長（CSS 時間） |\n| `delay` | `string` | `'0s'` | 動畫延遲（CSS 時間） |\n| `fill` | `string` | `'#ff4d4f'` | 揭示層的背景，可為顏色、漸層或圖片 |\n| `bgSize` | `string` | `'auto'` | 揭示層背景尺寸（CSS 長度或關鍵字） |\n\n## 運作方式\n\n### 揭示\n\n1. 元件先以一般文字色顯示整段文字。\n2. 上方疊一層同樣的文字，以 `fill` 為背景並裁切成文字形狀，背景置中。\n3. 揭示層以線性漸層遮罩控制可見範圍，播放時可見比例從 0% 推到 100%，播完停在全填色。\n4. `hover` 模式只在滑鼠停留期間播放，移出後回到原色。\n5. 使用者偏好減少動態時不播放動畫，直接顯示全填色。\n\n來源：1. [RevealText.vue](../../../../app/components/Camelot/RevealText.vue)\n\n### 預設樣式\n\n元件內建字級 64px、文字色近黑，不跟隨主題或外層字級；要改變時需從外層覆寫元件的樣式。\n\n來源：1. [RevealText.vue](../../../../app/components/Camelot/RevealText.vue)\n\n## 相關頁面\n\n- [RevealImage](./RevealImage.md)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

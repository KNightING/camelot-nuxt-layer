WIKI_PAGE("features/components/ProgressCircle.md",{
"title":"ProgressCircle",
"summary":"`CamelotProgressCircle` 是圓環進度指示器：以 SVG 圓環從頂端順時針畫出進度，也可切成不確定狀態、以缺口圓環持續旋轉；中央可顯示百分比或分數標籤，外觀依主題切換。系列元件的比較見 [進度元件](../progress-components.md)。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# ProgressCircle\n\n## Summary\n\n`CamelotProgressCircle` 是圓環進度指示器：以 SVG 圓環從頂端順時針畫出進度，也可切成不確定狀態、以缺口圓環持續旋轉；中央可顯示百分比或分數標籤，外觀依主題切換。系列元件的比較見 [進度元件](../progress-components.md)。\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :---: | :--- |\n| `value` | `number` | `0` | 目前進度值 |\n| `max` | `number` | `100` | 最大值 |\n| `color` | `CamelotColorRole` | `'primary'` | 色彩角色 |\n| `indeterminate` | `boolean` | `false` | 不確定狀態，顯示旋轉動畫 |\n| `showLabel` | `boolean` | `false` | 顯示中央標籤；不確定狀態下不顯示 |\n| `labelMode` | `'percent' \\| 'fraction'` | `'percent'` | 標籤格式：百分比或分數 |\n| `size` | `number` | `64` | 元件尺寸（px） |\n| `strokeWidth` | `number` | `6` | 圓環線寬（px） |\n\n## 運作方式\n\n### 進度與標籤\n\n1. 進度百分比等於目前值除以最大值，夾在 0 到 100；最大值小於等於 0 時為 0。\n2. 圓環從頂端起算，依百分比畫出對應長度的弧，變化時以彈性曲線過渡。\n3. 不確定狀態固定畫出 30% 的弧並整圈旋轉。\n4. 中央標籤字級為尺寸的 26%；百分比四捨五入到整數，分數直接顯示原始值。\n\n來源：1. [ProgressCircle.vue](../../../../app/components/Camelot/ProgressCircle.vue)\n\n### 各主題外觀\n\n| 主題 | 軌道 | 進度弧 |\n| :--- | :--- | :--- |\n| aqua | 14% 角色色 | 角色色到偏白的斜向漸層，圓頭 |\n| scifi | 18% 角色色 | 角色色加外光暈，平頭 |\n| cupertino、material | 淡外框線色 | 角色色，圓頭 |\n\n使用者偏好減少動態時，關閉過渡與旋轉動畫。\n\n來源：1. [ProgressCircle.vue](../../../../app/components/Camelot/ProgressCircle.vue)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

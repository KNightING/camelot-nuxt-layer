WIKI_PAGE("features/components/ProgressBar.md",{
"title":"ProgressBar",
"summary":"`CamelotProgressBar` 是水平進度條：依目前值與最大值填滿軌道，也可切成不確定狀態、以由左往右反覆掃過的色塊表示進行中；可在右側顯示百分比或分數標籤，外觀依主題切換。系列元件的比較見 [進度元件](../progress-components.md)。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# ProgressBar\n\n## Summary\n\n`CamelotProgressBar` 是水平進度條：依目前值與最大值填滿軌道，也可切成不確定狀態、以由左往右反覆掃過的色塊表示進行中；可在右側顯示百分比或分數標籤，外觀依主題切換。系列元件的比較見 [進度元件](../progress-components.md)。\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :---: | :--- |\n| `value` | `number` | `0` | 目前進度值 |\n| `max` | `number` | `100` | 最大值 |\n| `color` | `CamelotColorRole` | `'primary'` | 色彩角色 |\n| `indeterminate` | `boolean` | `false` | 不確定狀態，顯示掃描動畫 |\n| `showLabel` | `boolean` | `false` | 顯示右側標籤；不確定狀態下不顯示 |\n| `labelMode` | `'percent' \\| 'fraction'` | `'percent'` | 標籤格式：百分比或分數 |\n| `height` | `string` | `'8px'` | 軌道高度（CSS 長度） |\n| `rounded` | `boolean` | `true` | 是否圓角；Sci-Fi 主題一律無圓角 |\n\n## 運作方式\n\n### 進度與標籤\n\n1. 進度百分比等於目前值除以最大值，夾在 0 到 100；最大值小於等於 0 時為 0。\n2. 百分比標籤四捨五入到整數，例如「42%」。\n3. 分數標籤直接顯示原始值，例如「3 / 8」，不做夾限。\n4. 進度變化時填色寬度以彈性曲線過渡；不確定狀態以 40% 寬的色塊由左往右反覆掃過，一趟 1.4 秒。\n\n來源：1. [ProgressBar.vue](../../../../app/components/Camelot/ProgressBar.vue)\n\n### 各主題外觀\n\n| 主題 | 軌道 | 填色 |\n| :--- | :--- | :--- |\n| aqua | 玻璃軌道加背景模糊 | 玻璃填滿 |\n| scifi | 淡角色色框線與 8% 角色色底，無圓角 | 角色色加外光暈 |\n| cupertino、material | 淺色容器底 | 角色色 |\n\n使用者偏好減少動態時，關閉過渡與掃描動畫。\n\n來源：1. [ProgressBar.vue](../../../../app/components/Camelot/ProgressBar.vue)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

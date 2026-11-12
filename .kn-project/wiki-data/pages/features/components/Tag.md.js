WIKI_PAGE("features/components/Tag.md",{
"title":"Tag",
"summary":"標籤徽章：以短文字標示狀態或分類，支援實心、柔色、外框三種外觀，兩種尺寸，並可加上關閉按鈕。形狀依主題切換。匯入名稱為 `CamelotTag`（Nuxt 自動匯入）。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# Tag\n\n## Summary\n\n標籤徽章：以短文字標示狀態或分類，支援實心、柔色、外框三種外觀，兩種尺寸，並可加上關閉按鈕。形狀依主題切換。匯入名稱為 `CamelotTag`（Nuxt 自動匯入）。\n\n## 運作方式\n\n### 外觀與尺寸\n\n| 外觀 | 樣式 |\n|---|---|\n| solid | 主色底、配對前景色文字 |\n| soft | 主色淡底、主色文字；Sci-Fi 另加半透明邊框與外發光 |\n| outline | 主色框線、主色文字 |\n\n| 主題 | 形狀 |\n|---|---|\n| Aqua | 藥丸形，背景模糊 |\n| Sci-Fi | 切角、直角，文字大寫加寬字距 |\n| Cupertino | 圓角 |\n| 其他 | 中圓角 |\n\n小尺寸用較小字級與內距，預設為中尺寸。\n\n來源：1. [Tag.vue](../../../../app/components/Camelot/Tag.vue)\n\n### 關閉與停用\n\n1. 開啟可關閉時，文字後方顯示關閉按鈕；點擊發出關閉事件，不會冒泡到外層。\n2. 停用時整個標籤半透明，關閉按鈕不可點。\n\n來源：1. [Tag.vue](../../../../app/components/Camelot/Tag.vue)\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :---: | :--- |\n| `label` | `string` | — | 標籤文字，也可用預設插槽覆寫。 |\n| `color` | `CamelotColorRole` | `'primary'` | 色彩角色。 |\n| `variant` | `'solid' \\| 'soft' \\| 'outline'` | `'soft'` | 外觀。 |\n| `size` | `'sm' \\| 'md'` | `'md'` | 尺寸。 |\n| `closable` | `boolean` | — | 是否顯示關閉按鈕。 |\n| `disabled` | `boolean` | — | 停用，降低透明度、關閉按鈕不可點。 |\n\n## Emits\n| 事件 | 參數 | 說明 |\n| :--- | :--- | :--- |\n| `close` | — | 點擊關閉按鈕時觸發。 |\n\n## Slots\n| Slot | 作用域參數 | 說明 |\n| :--- | :--- | :--- |\n| `icon` | — | 標籤前置圖示。 |\n| `default` | — | 標籤內容，未提供時顯示 `label`。 |\n\n## 相關頁面\n\n- [TagGroup](./TagGroup.md)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

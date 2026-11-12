WIKI_PAGE("features/components/Breadcrumb.md",{
"title":"Breadcrumb",
"summary":"Breadcrumb 是麵包屑導覽列，匯入名稱 `CamelotBreadcrumb`。它依序顯示層級路徑，項目之間以分隔符號隔開；最後一項代表目前頁面，以角色色加粗顯示且不可點擊，其餘項目點擊時送出 select 事件。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# Breadcrumb\n\n## Summary\n\nBreadcrumb 是麵包屑導覽列，匯入名稱 `CamelotBreadcrumb`。它依序顯示層級路徑，項目之間以分隔符號隔開；最後一項代表目前頁面，以角色色加粗顯示且不可點擊，其餘項目點擊時送出 select 事件。\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :---: | :--- |\n| `items` | `BreadcrumbItem[]` | —（必填） | 麵包屑項目陣列 |\n| `separator` | `string` | — | 自訂分隔字元；留空則用 chevron 圖示 |\n| `color` | `CamelotColorRole` | `'primary'` | 角色色彩，用於目前頁與 hover 文字色 |\n\n### BreadcrumbItem\n| 欄位 | 型別 | 說明 |\n| :--- | :--- | :--- |\n| `label` | `string` | 顯示文字 |\n| `value` | `string \\| number` | 選填；有值時作為列表 key |\n| `href` | `string` | 選填；有值時渲染為連結 |\n| `disabled` | `boolean` | 選填；為 true 時點擊不送出 select |\n\n## Emits\n| 事件 | 參數 | 說明 |\n| :--- | :--- | :--- |\n| `select` | `(item: BreadcrumbItem, index: number)` | 點擊非最後一項且未停用時觸發 |\n\n## Slots\n| Slot | 作用域參數 | 說明 |\n| :--- | :--- | :--- |\n| `item` | `{ item, index, isLast }` | 自訂單一項目內容；預設顯示項目文字 |\n| `separator` | — | 自訂分隔符號；預設 chevron 圖示或 `separator` 字元 |\n\n## 運作方式\n\n| 規則 | 說明 |\n|---|---|\n| 元素 | 有 href 的項目渲染為連結，否則為按鈕 |\n| 最後一項 | 標記為目前頁面，停用滑鼠事件，不送出 select |\n| 停用項目 | 仍照常顯示，點擊不送出 select |\n| Scifi 主題 | 改用等寬字體、全大寫與加寬字距 |\n\n來源：1. [Breadcrumb.vue](../../../../app/components/Camelot/Breadcrumb.vue)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

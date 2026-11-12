WIKI_PAGE("features/components/Accordion.md",{
"title":"Accordion",
"summary":"Accordion 是多個可收合項目的群組，匯入名稱 `CamelotAccordion`。傳入項目陣列，以 v-model 取得目前展開的項目；預設一次只展開一個，可改為允許多個同時展開。五種主題各有對應的容器外觀。",
"svgs":{},
"seq":{},
"ext":["archive/2611121356-tactile-theme-and-new-components.md"],
"changelog":[{"plan": "2611121356-tactile-theme-and-new-components", "date": "2026-11-12", "version": "4.6.4.2", "note": "新增第五種主題風格 tactile、Button loading 與七個新元件", "issue": "[#76](https://github.com/KNightING/camelot-nuxt-layer/issues/76)", "pr": "[PR #77](https://github.com/KNightING/camelot-nuxt-layer/pull/77)"}],
"md":"# Accordion\n\n## Summary\n\nAccordion 是多個可收合項目的群組，匯入名稱 `CamelotAccordion`。傳入項目陣列，以 v-model 取得目前展開的項目；預設一次只展開一個，可改為允許多個同時展開。五種主題各有對應的容器外觀。\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :--- | :--- |\n| `items` | `CamelotAccordionItem[]` | `[]` | 項目清單；每項有 value、title，選填 content 與 disabled |\n| `multiple` | `boolean` | `false` | 允許同時展開多個項目 |\n| `color` | `CamelotColorRole` | `'primary'` | 展開指示圖示使用的角色色 |\n\n## Emits\n| 事件 | 參數 | 說明 |\n| :--- | :--- | :--- |\n| `change` | `expandedValues: CamelotAccordionValue[]` | 展開的項目改變時觸發 |\n\n## v-model\n| Model | 型別 | 說明 |\n| :--- | :--- | :--- |\n| `modelValue` | `CamelotAccordionValue[]`（預設 `[]`） | 目前展開項目的 value；單開模式最多一個 |\n\n## Slots\n| Slot | 作用域參數 | 說明 |\n| :--- | :--- | :--- |\n| `title` | `item`、`expanded` | 自訂項目標題 |\n| `content` | `item` | 自訂項目內容；未提供時顯示項目的 content 文字 |\n\n## 規則\n| 規則 | 說明 |\n| :--- | :--- |\n| 單開模式 | 展開一個項目會收合其他項目 |\n| 多開模式 | 各項目獨立展開與收合 |\n| 再點一次 | 已展開的項目會收合 |\n| 停用項目 | 標題變淡，無法點擊 |\n\n來源：1. [Accordion.vue](../../../../app/components/Camelot/Accordion.vue)　2. [AccordionItem.vue](../../../../app/components/Camelot/AccordionItem.vue)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

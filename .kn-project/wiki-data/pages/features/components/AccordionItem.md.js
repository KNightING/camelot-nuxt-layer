WIKI_PAGE("features/components/AccordionItem.md",{
"title":"AccordionItem",
"summary":"AccordionItem 是 [Accordion](./Accordion.md) 的單一項目，匯入名稱 `CamelotAccordionItem`：一列可點擊的標題加展開指示圖示，下方是以高度過場展開的內容區。展開與否由外層傳入，自己不保存狀態。",
"svgs":{},
"seq":{},
"ext":["archive/2611121356-tactile-theme-and-new-components.md"],
"changelog":[{"plan": "2611121356-tactile-theme-and-new-components", "date": "2026-11-12", "version": "4.6.4.2", "note": "新增第五種主題風格 tactile、Button loading 與七個新元件", "issue": "[#76](https://github.com/KNightING/camelot-nuxt-layer/issues/76)", "pr": "[PR #77](https://github.com/KNightING/camelot-nuxt-layer/pull/77)"}],
"md":"# AccordionItem\n\n## Summary\n\nAccordionItem 是 [Accordion](./Accordion.md) 的單一項目，匯入名稱 `CamelotAccordionItem`：一列可點擊的標題加展開指示圖示，下方是以高度過場展開的內容區。展開與否由外層傳入，自己不保存狀態。\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :--- | :--- |\n| `title` | `string` | `''` | 標題文字 |\n| `expanded` | `boolean` | `false` | 是否展開 |\n| `disabled` | `boolean` | `false` | 停用後無法點擊 |\n\n## Emits\n| 事件 | 參數 | 說明 |\n| :--- | :--- | :--- |\n| `toggle` | — | 標題被點擊或以鍵盤觸發 |\n\n## Slots\n| Slot | 作用域參數 | 說明 |\n| :--- | :--- | :--- |\n| `title` | — | 自訂標題 |\n| `default` | — | 展開後顯示的內容 |\n\n## 外觀\n| 主題 | 展開指示圖示 |\n| :--- | :--- |\n| tactile | 灰階圓鈕；展開時轉為角色色平塗並旋轉半圈 |\n| aqua | 玻璃軌道圓鈕；展開時轉為玻璃填色 |\n| scifi | 展開時改為角色色並帶外發光 |\n| 其他 | 展開時改為角色色 |\n\n來源：1. [AccordionItem.vue](../../../../app/components/Camelot/AccordionItem.vue)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

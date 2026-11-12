WIKI_PAGE("features/components/IdxForm.md",{
"title":"IdxForm",
"summary":"IdxForm（匯入名稱 `CamelotIdxForm`）是依欄位順序移動焦點的表單容器：在欄位上按 Enter 跳到下一個欄位，Shift+Tab 回到上一個，最後一個欄位按 Enter 時觸發 submit。適合需要連續鍵盤輸入的資料登打畫面。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# IdxForm\n\n## Summary\n\nIdxForm（匯入名稱 `CamelotIdxForm`）是依欄位順序移動焦點的表單容器：在欄位上按 Enter 跳到下一個欄位，Shift+Tab 回到上一個，最後一個欄位按 Enter 時觸發 submit。適合需要連續鍵盤輸入的資料登打畫面。\n\n## Emits\n| 事件 | 參數 | 說明 |\n| :--- | :--- | :--- |\n| `submit` | — | 在最後一個欄位按 Enter 時觸發 |\n\n## Slots\n| Slot | 作用域參數 | 說明 |\n| :--- | :--- | :--- |\n| `default` | — | 表單內容，其中的 input 與 select 會自動編號 |\n\n## 運作方式\n\n### 欄位編號\n\n表單掛載後，依文件順序替內容中所有 input 與 select 寫上 data-idx 索引，從 0 開始。編號只在掛載時做一次，之後才動態加入的欄位不會編號。\n\n來源：1. [IdxForm.vue](../../../../app/components/Camelot/IdxForm.vue)\n\n### 鍵盤導覽\n\n1. 按下 Enter 的 keydown 記錄目前欄位的索引。\n2. 同一次 Enter 的 keypress 找索引加一的欄位；找到就聚焦並阻止預設行為。\n3. 找不到下一個欄位時觸發 submit。\n4. Shift+Tab 聚焦索引減一的欄位；已是第一個時交給瀏覽器預設行為。\n\nEnter 拆成 keydown 與 keypress 兩段處理，是為了避開中文輸入法組字時按 Enter 的衝突。\n\n來源：1. [IdxForm.vue](../../../../app/components/Camelot/IdxForm.vue)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

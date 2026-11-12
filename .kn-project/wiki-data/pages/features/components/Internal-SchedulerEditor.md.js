WIKI_PAGE("features/components/Internal-SchedulerEditor.md",{
"title":"SchedulerEditor",
"summary":"SchedulerEditor（匯入名稱 `CamelotInternalSchedulerEditor`）是 Scheduler 內建的事件編輯面板，屬內部元件：標題、開始與結束時間、人員、顏色，編輯既有事件時多一顆刪除。結束時間必須晚於開始時間才能儲存；鎖定的事件以唯讀方式開啟。",
"svgs":{},
"seq":{},
"ext":["archive/2611121501-scheduler-component.md"],
"changelog":[{"plan": "2611121501-scheduler-component", "date": "2026-11-12", "version": "4.6.4.2", "note": "新增行事曆與排班表元件 CamelotScheduler", "issue": "[#82](https://github.com/KNightING/camelot-nuxt-layer/issues/82)", "pr": "[PR #83](https://github.com/KNightING/camelot-nuxt-layer/pull/83)"}],
"md":"# SchedulerEditor\n\n## Summary\n\nSchedulerEditor（匯入名稱 `CamelotInternalSchedulerEditor`）是 Scheduler 內建的事件編輯面板，屬內部元件：標題、開始與結束時間、人員、顏色，編輯既有事件時多一顆刪除。結束時間必須晚於開始時間才能儲存；鎖定的事件以唯讀方式開啟。\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :--- | :--- |\n| `event` | `CamelotSchedulerEvent \\| null` | `null` | 正在編輯的事件；新增時是暫時事件 |\n| `isNew` | `boolean` | `false` | 新增或編輯 |\n| `resources` | `CamelotSchedulerResource[]` | `[]` | 人員清單；空的時候不顯示人員欄 |\n| `labels` | `CamelotSchedulerLabels` | 必填 | 顯示文字 |\n| `readonly` | `boolean` | `false` | 唯讀：欄位停用，沒有儲存與刪除 |\n| `color` | `CamelotColorRole` | `'primary'` | 預設顏色 |\n\n## Emits\n| 事件 | 參數 | 說明 |\n| :--- | :--- | :--- |\n| `save` | `event` | 按儲存，帶完整的事件 |\n| `delete` | — | 按刪除 |\n| `cancel` | — | 對話框被取消 |\n\n## v-model\n| Model | 型別 | 說明 |\n| :--- | :--- | :--- |\n| `open` | `boolean`（預設 `false`） | 面板是否開啟 |\n\n來源：1. [Internal/SchedulerEditor.vue](../../../../app/components/Camelot/Internal/SchedulerEditor.vue)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

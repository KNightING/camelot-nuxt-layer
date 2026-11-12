WIKI_PAGE("features/components/Internal-SchedulerResourceWeek.md",{
"title":"排班週視圖",
"summary":"SchedulerResourceWeek（匯入名稱 `CamelotInternalSchedulerResourceWeek`）是 Scheduler 的排班週視圖，屬內部元件：人員為列、7 天為欄，班次排在儲存格內；拖到另一個儲存格就換人與換日，時間不變。",
"svgs":{},
"seq":{},
"ext":["archive/2611121501-scheduler-component.md"],
"changelog":[{"plan": "2611121501-scheduler-component", "date": "2026-11-12", "version": "4.6.4.2", "note": "新增行事曆與排班表元件 CamelotScheduler", "issue": "[#82](https://github.com/KNightING/camelot-nuxt-layer/issues/82)", "pr": "[PR #83](https://github.com/KNightING/camelot-nuxt-layer/pull/83)"}],
"md":"# 排班週視圖\n\n## Summary\n\nSchedulerResourceWeek（匯入名稱 `CamelotInternalSchedulerResourceWeek`）是 Scheduler 的排班週視圖，屬內部元件：人員為列、7 天為欄，班次排在儲存格內；拖到另一個儲存格就換人與換日，時間不變。\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :--- | :--- |\n| `days` | `Date[]` | `[]` | 一週的 7 天 |\n| `resources` | `CamelotSchedulerResource[]` | `[]` | 列 |\n| `events` | `CamelotSchedulerEvent[]` | `[]` | 事件；只顯示對應到某個人員的 |\n| `defaultMinutes`、`readonly`、`color`、`locale`、`untitled` | — | — | 同 Scheduler；人員有自己的 color 時以它為準 |\n\n## Emits\n| 事件 | 參數 | 說明 |\n| :--- | :--- | :--- |\n| `change` | `event`、`previous` | 拖移或調整長度放開後，帶新舊兩個版本 |\n| `create` | `event` | 新增手勢完成（拖曳選取或點一下空白處） |\n| `open` | `event` | 在事件上點一下，或在事件上按 Enter、空白鍵 |\n| `select-day` | `day` | 點標頭的日期 |\n\n來源：1. [Internal/SchedulerResourceWeek.vue](../../../../app/components/Camelot/Internal/SchedulerResourceWeek.vue)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

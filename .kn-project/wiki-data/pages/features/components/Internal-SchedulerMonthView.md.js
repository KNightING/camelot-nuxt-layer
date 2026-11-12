WIKI_PAGE("features/components/Internal-SchedulerMonthView.md",{
"title":"SchedulerMonthView",
"summary":"SchedulerMonthView（匯入名稱 `CamelotInternalSchedulerMonthView`）是 Scheduler 的月視圖，屬內部元件：6 週 × 7 天的日期格，事件以單行條排在格內，拖到別格就換日、時間不變。",
"svgs":{},
"seq":{},
"ext":["archive/2611121501-scheduler-component.md"],
"changelog":[{"plan": "2611121501-scheduler-component", "date": "2026-11-12", "version": "4.6.4.2", "note": "新增行事曆與排班表元件 CamelotScheduler", "issue": "[#82](https://github.com/KNightING/camelot-nuxt-layer/issues/82)", "pr": "[PR #83](https://github.com/KNightING/camelot-nuxt-layer/pull/83)"}],
"md":"# SchedulerMonthView\n\n## Summary\n\nSchedulerMonthView（匯入名稱 `CamelotInternalSchedulerMonthView`）是 Scheduler 的月視圖，屬內部元件：6 週 × 7 天的日期格，事件以單行條排在格內，拖到別格就換日、時間不變。\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :--- | :--- |\n| `date` | `Date` | 今天 | 目前顯示的月份 |\n| `events` | `CamelotSchedulerEvent[]` | `[]` | 事件 |\n| `weekStartsOn` | `0 \\| 1` | `0` | 週起始 |\n| `maxEvents` | `number` | `3` | 每格最多顯示幾筆 |\n| `moreText` | `string` | 還有 {count} 筆 | 收合文字 |\n| `defaultMinutes`、`readonly`、`color`、`locale`、`untitled` | — | — | 同 Scheduler |\n\n## Emits\n| 事件 | 參數 | 說明 |\n| :--- | :--- | :--- |\n| `change` | `event`、`previous` | 拖移或調整長度放開後，帶新舊兩個版本 |\n| `create` | `event` | 新增手勢完成（拖曳選取或點一下空白處） |\n| `open` | `event` | 在事件上點一下，或在事件上按 Enter、空白鍵 |\n| `select-day` | `day` | 點日期數字或「還有 N 筆」 |\n\n來源：1. [Internal/SchedulerMonthView.vue](../../../../app/components/Camelot/Internal/SchedulerMonthView.vue)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

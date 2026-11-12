WIKI_PAGE("features/components/Internal-SchedulerResourceDay.md",{
"title":"排班日視圖",
"summary":"SchedulerResourceDay（匯入名稱 `CamelotInternalSchedulerResourceDay`）是 Scheduler 的排班日視圖，屬內部元件：人員為列、小時為欄的橫向時間軸；班次可橫向換時間、縱向換人、拖右緣調整長度，同時段重疊的班次疊成多條。",
"svgs":{},
"seq":{},
"ext":["archive/2611121501-scheduler-component.md"],
"changelog":[{"plan": "2611121501-scheduler-component", "date": "2026-11-12", "version": "4.6.4.2", "note": "新增行事曆與排班表元件 CamelotScheduler", "issue": "[#82](https://github.com/KNightING/camelot-nuxt-layer/issues/82)", "pr": "[PR #83](https://github.com/KNightING/camelot-nuxt-layer/pull/83)"}],
"md":"# 排班日視圖\n\n## Summary\n\nSchedulerResourceDay（匯入名稱 `CamelotInternalSchedulerResourceDay`）是 Scheduler 的排班日視圖，屬內部元件：人員為列、小時為欄的橫向時間軸；班次可橫向換時間、縱向換人、拖右緣調整長度，同時段重疊的班次疊成多條。\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :--- | :--- |\n| `day` | `Date` | 今天 | 要顯示的那一天 |\n| `resources` | `CamelotSchedulerResource[]` | `[]` | 列 |\n| `events` | `CamelotSchedulerEvent[]` | `[]` | 事件 |\n| `startHour`、`endHour` | `number` | `0`、`24` | 可見範圍（時） |\n| `hourWidth` | `number` | `72` | 每小時寬度（px） |\n| `snapMinutes`、`defaultMinutes`、`readonly`、`color`、`untitled` | — | — | 同 Scheduler |\n\n## Emits\n| 事件 | 參數 | 說明 |\n| :--- | :--- | :--- |\n| `change` | `event`、`previous` | 拖移或調整長度放開後，帶新舊兩個版本 |\n| `create` | `event` | 新增手勢完成（拖曳選取或點一下空白處） |\n| `open` | `event` | 在事件上點一下，或在事件上按 Enter、空白鍵 |\n\n來源：1. [Internal/SchedulerResourceDay.vue](../../../../app/components/Camelot/Internal/SchedulerResourceDay.vue)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

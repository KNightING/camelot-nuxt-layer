WIKI_PAGE("features/components/Internal-SchedulerTimeGrid.md",{
"title":"SchedulerTimeGrid",
"summary":"SchedulerTimeGrid（匯入名稱 `CamelotInternalSchedulerTimeGrid`）是 Scheduler 週與日視圖共用的時間軸，屬內部元件：標頭黏在捲動區上緣，左側是時間刻度，每一天一欄，事件依時間定位並在重疊時並排。",
"svgs":{},
"seq":{},
"ext":["archive/2611121501-scheduler-component.md"],
"changelog":[{"plan": "2611121501-scheduler-component", "date": "2026-11-12", "version": "4.6.4.2", "note": "新增行事曆與排班表元件 CamelotScheduler", "issue": "[#82](https://github.com/KNightING/camelot-nuxt-layer/issues/82)", "pr": "[PR #83](https://github.com/KNightING/camelot-nuxt-layer/pull/83)"}],
"md":"# SchedulerTimeGrid\n\n## Summary\n\nSchedulerTimeGrid（匯入名稱 `CamelotInternalSchedulerTimeGrid`）是 Scheduler 週與日視圖共用的時間軸，屬內部元件：標頭黏在捲動區上緣，左側是時間刻度，每一天一欄，事件依時間定位並在重疊時並排。\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :--- | :--- |\n| `days` | `Date[]` | `[]` | 要顯示的每一天（週 7 天、日 1 天） |\n| `events` | `CamelotSchedulerEvent[]` | `[]` | 事件 |\n| `startHour`、`endHour` | `number` | `0`、`24` | 可見範圍（時） |\n| `hourHeight` | `number` | `48` | 每小時高度（px） |\n| `snapMinutes`、`defaultMinutes` | `number` | `15`、`60` | 吸附與預設長度（分鐘） |\n| `scrollToHour` | `number` | `8` | 打開時捲動到這個小時 |\n| `readonly`、`color`、`locale`、`untitled` | — | — | 同 Scheduler |\n\n## Emits\n| 事件 | 參數 | 說明 |\n| :--- | :--- | :--- |\n| `change` | `event`、`previous` | 拖移或調整長度放開後，帶新舊兩個版本 |\n| `create` | `event` | 新增手勢完成（拖曳選取或點一下空白處） |\n| `open` | `event` | 在事件上點一下，或在事件上按 Enter、空白鍵 |\n| `select-day` | `day` | 點標頭的日期 |\n\n## 規則\n| 規則 | 說明 |\n| :--- | :--- |\n| 目前時間 | 今天那一欄畫一條紅線，每分鐘更新一次；不在可見範圍內就不畫 |\n| 最短顯示 | 再短的事件也至少畫 15 分鐘的高度，才點得到 |\n\n來源：1. [Internal/SchedulerTimeGrid.vue](../../../../app/components/Camelot/Internal/SchedulerTimeGrid.vue)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

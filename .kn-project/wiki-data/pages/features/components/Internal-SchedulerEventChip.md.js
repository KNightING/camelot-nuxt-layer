WIKI_PAGE("features/components/Internal-SchedulerEventChip.md",{
"title":"SchedulerEventChip",
"summary":"SchedulerEventChip（匯入名稱 `CamelotInternalSchedulerEventChip`）是 Scheduler 四個視圖共用的事件外觀，屬內部元件。`block` 是時間軸上的色塊（標題加時間範圍），`chip` 是日期格與排班列裡的單行條；可聚焦，按下時發出手勢起點給所在的視圖。",
"svgs":{},
"seq":{},
"ext":["archive/2611121501-scheduler-component.md"],
"changelog":[{"plan": "2611121501-scheduler-component", "date": "2026-11-12", "version": "4.6.4.2", "note": "新增行事曆與排班表元件 CamelotScheduler", "issue": "[#82](https://github.com/KNightING/camelot-nuxt-layer/issues/82)", "pr": "[PR #83](https://github.com/KNightING/camelot-nuxt-layer/pull/83)"}],
"md":"# SchedulerEventChip\n\n## Summary\n\nSchedulerEventChip（匯入名稱 `CamelotInternalSchedulerEventChip`）是 Scheduler 四個視圖共用的事件外觀，屬內部元件。`block` 是時間軸上的色塊（標題加時間範圍），`chip` 是日期格與排班列裡的單行條；可聚焦，按下時發出手勢起點給所在的視圖。\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :--- | :--- |\n| `event` | `CamelotSchedulerEvent` | 必填 | 事件 |\n| `variant` | `'block' \\| 'chip'` | `'block'` | 外觀 |\n| `resizable` | `'bottom' \\| 'right'` | 無 | 調整長度的把手位置；鎖定或唯讀時不顯示 |\n| `color` | `CamelotColorRole` | `'primary'` | 事件自己的 color 優先 |\n| `isDraft` | `boolean` | `false` | 手勢進行中的預覽，加外框 |\n| `readonly`、`untitled` | — | — | 同 Scheduler |\n\n## Emits\n| 事件 | 參數 | 說明 |\n| :--- | :--- | :--- |\n| `move-start` | `PointerEvent` | 在事件上按下 |\n| `resize-start` | `PointerEvent` | 在調整長度的把手上按下 |\n| `open` | — | 按 Enter 或空白鍵 |\n\n來源：1. [Internal/SchedulerEventChip.vue](../../../../app/components/Camelot/Internal/SchedulerEventChip.vue)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

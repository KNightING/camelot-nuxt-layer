WIKI_PAGE("features/composables/useCamelotSchedulerTheme.md",{
"title":"排程主題",
"summary":"`useCamelotSchedulerTheme()` 集中 Scheduler 各視圖的五主題樣式，回傳 `containerClass`、`lineClass`、`headerTextClass`、`todayClass`、`todayNumberClass`、`eventClass`、`draftClass`、`lockedClass`、`nowLineClass` 與 `easeClass`。",
"svgs":{},
"seq":{},
"ext":["archive/2611121501-scheduler-component.md"],
"changelog":[{"plan": "2611121501-scheduler-component", "date": "2026-11-12", "version": "4.6.4.2", "note": "新增行事曆與排班表元件 CamelotScheduler", "issue": "[#82](https://github.com/KNightING/camelot-nuxt-layer/issues/82)", "pr": "[PR #83](https://github.com/KNightING/camelot-nuxt-layer/pull/83)"}],
"md":"# 排程主題\n\n## Summary\n\n`useCamelotSchedulerTheme()` 集中 Scheduler 各視圖的五主題樣式，回傳 `containerClass`、`lineClass`、`headerTextClass`、`todayClass`、`todayNumberClass`、`eventClass`、`draftClass`、`lockedClass`、`nowLineClass` 與 `easeClass`。\n\n## 外觀\n| 主題 | 外框 | 事件 |\n| :--- | :--- | :--- |\n| tactile | 實心表面 | 角色色填滿，圓角 |\n| aqua | 玻璃面板 | 玻璃填色 |\n| scifi | 直角、主色邊框、等寬字 | 角色色框線加淡底與外發光 |\n| cupertino | surface 底，大圓角 | 當前色實心底 |\n| material | surface 底加邊框 | 左側粗線加淡底 |\n\n來源：1. [useCamelotSchedulerTheme.ts](../../../../app/composables/useCamelotSchedulerTheme.ts)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

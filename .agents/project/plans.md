# Current Plans

| Plan | Status | Affected Components | Summary |
| :--- | :--- | :--- | :--- |
| [2607081458-table-fixed-height](plans/2607081458-table-fixed-height/plan.md) | Awaiting Archive | CamelotTable、playground | 新增 `height` prop 讓表格真正固定高度(內容少於容器時不縮短),demo 改用固定高度示範 |
| [2607091145-datepicker-daylabel-locale](plans/2607091145-datepicker-daylabel-locale/plan.md) | In Progress | Calendar、DateV2、DateRangeV2、playground | DatePicker 加 `showDayLabel`(可不保留節日名空間)+ `locale`/`weekStartsOn`(Intl 週/月/年月各國語系)+ demo |
| [2607081704-overlay-scrollbar-component](plans/2607081704-overlay-scrollbar-component/plan.md) | In Progress | OverlayScrollbar 新元件、composable、Table | 把水平 overlay 捲軸元件化(H/V prop 切換),Table 兩軸皆改用自訂 overlay 捲軸,移除 wheel workaround |
| [2607081506-table-floating-hscrollbar](plans/2607081506-table-floating-hscrollbar/plan.md) | Awaiting Archive | CamelotTable、新 composable、playground | 表格底在視窗外時於視窗底浮現自訂水平捲軸(Teleport 代理 + 雙向同步),opt-in `floatingScrollbar` prop |

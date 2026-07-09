# Plan: 2606101530 - timeline-alignment-and-image

- Created: 2026-06-10
- Completed: 2026-06-10 15:38
- Branch: feature/2606101530-timeline-alignment-and-image
- Status: Archived
- Wiki: [timeline](../wiki/features/timeline.md)

## 成果
`app/components/Camelot/Timeline.vue`：

1. **垂直模式圓點對齊標題行**：axis 由 `justify-center`（圓點置中整列，受 content `pb-6` 影響而與標題錯位）改為 `justify-start + pt-1.5`——12px 圓點（h-3）中心 12px 正對 `text-base` 標題 24px 行高中心。水平模式維持置中。
2. **連接線兩段式**：原單段 `top-1/2 bottom-[-100%]` 假設等高列；改為 `i>0` 上段（`top-0 h-3`）+ `i<last` 下段（`top-3 bottom-0`），列（grid rows）相鄰無縫，列高不一（如含圖片）仍連續。
3. **圖片內容**：`TimelineItem` 新增 `image?: string`；預設 content 區塊於文字下渲染 `w-[200px] rounded-lg border` 圖片（`before` 側 `ml-auto` 靠右、水平模式 `mx-auto` 置中）；自訂 `#content` slot 時不套用。

## 影響檔
- `app/components/Camelot/Timeline.vue`
- `.playground/app/pages/index.vue`（「出貨」項目加示範圖）

## 驗證
- Preview（CDP）：垂直 alternate 與單側模式圓點/標題中心 y 相同（3878==3878）；連接線四個接縫 gap 全為 0（含 185px 圖片高列）；水平模式無回歸；eslint 通過、console 無錯誤。

## 使用者決策
- 使用 feature branch（`feature/2606101530-timeline-alignment-and-image`）。

## Tasks
- [x] 垂直 axis justify-start + pt-1.5
- [x] 連接線兩段式
- [x] TimelineItem.image + 預設渲染
- [x] Playground 展示 + Preview 驗證

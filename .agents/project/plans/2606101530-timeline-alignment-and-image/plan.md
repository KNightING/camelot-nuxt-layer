<!-- REMINDER: Relative Paths Only! No file:///c:/... -->
# Plan: 2606101530 - timeline-alignment-and-image
- Created: 2026-06-10
- Branch: feature/2606101530-timeline-alignment-and-image
- Status: In Progress
- Completed: [Wait for Finish]

## Goals
1. **垂直模式圓點對齊標題**（`app/components/Camelot/Timeline.vue`）：
   - 現況：axis `justify-center` 使圓點垂直置中整列，內容 `pb-6` + 標題在頂 → 標題與圓點錯位。
   - 修正：垂直模式 axis 改 `justify-start pt-1.5`（12px 圓點置中對齊 24px 標題行高）；水平模式維持置中。
2. **連接線改兩段式**：原 `top-1/2 bottom-[-100%]` 假設等高列；改為 `i>0` 畫上段（`top-0 h-3`）、`i<items.length-1` 畫下段（`top-3 bottom-0`），列高不一仍連續。水平模式不變。
3. **內容圖片支援**：`TimelineItem` 新增 `image?: string`；預設 content 區塊在 before/after 兩側都渲染 `<img>`（rounded + border、限制寬度）。自訂 `#content` slot 不受影響。
4. **Playground**：Timeline 展示加入含圖片的項目。

## Impact Files
- `app/components/Camelot/Timeline.vue`
- `.playground/app/pages/index.vue`

## Git Completion Policy
- After user-approved commits, completion will run `git rebase main` and update the remote work branch with `git push --force-with-lease`.
- PR/archive order: Archive automatically triggered on PR request

## References
- 對齊規格：dot 12px（h-3）+ `pt-1.5`（6px）→ 中心 12px = `text-base` 行高 24px 的一半。

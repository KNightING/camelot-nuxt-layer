# Tasks for 2610301742

## Phase 1 — 共用 composable
- [x] 新增 `app/composables/useCamelotAnchor.ts`(支援偵測、唯一名稱、style)
- [x] 新增 `tests/composables/useCamelotAnchor.test.ts`

## Phase 2 — PopupV2(Select/Date/Time/DateRange)
- [x] 外層定位改 anchor,保留 JS 退回路徑並降低其延遲
- [x] 翻轉判斷(isBottom/isRight)改由 scroll/resize/ResizeObserver 更新
- [x] target 捲出可視範圍時隱藏浮層

## Phase 3 — Tooltip
- [x] anchor 定位 + 翻轉/夾進視窗,保留退回路徑

## Phase 4 — CascadeMenu
- [x] 根面板與子面板 anchor 定位,保留退回路徑
- [x] 依 Q1 決議處理視窗捲動行為

## Phase 5 — 驗證
- [x] lint、typecheck、vitest、build
- [x] headless Chromium:anchor 路徑與強制退回路徑皆驗證四個元件跟隨、翻轉、寬度模式、dialog 內
- [x] playground 實際操作無 console 警告

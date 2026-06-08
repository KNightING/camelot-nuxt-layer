<!-- REMINDER: Relative Paths Only! No file:///c:/... -->
# Plan: 2606081900 - UI 批次（Tabs/Steps 色彩 + 主題漸變 + Pagination/VirtualScroll/Carousel + DatePicker 手機 + Playground 重構）

- Created: 2026-06-08 19:00
- Branch: feature/2606081900-ui-batch-tabs-color-carousel-virtual
- Status: In Progress
- Completed: [Wait for Finish]

## Goals（使用者 9 項）
1. Tabs / Steps 支援 color role（不再只有 primary）。
2. 切換主題 / 色系時有顏色漸變動畫。
3. 新增 Pagination 元件，範例與 Table 結合。
4. 新增 Carousel 元件：左右/上下、無限、自動、卡片疊加、多種切換動畫、可設定前後 N 個可見。
5. 新增 VirtualScroll 元件；Table 預設虛擬滾動（**支援可變列高**，vue-virtual-scroller 式）。
6. DateRange 手機模式下個月按鈕消失 → 修正。
7. DatePicker 手機模式改用置中 modal（非 popup）。
8. 首頁下半部測試區整合進上半部展示區。
9. 主題控制面板（Active Style Theme / Dark-Light / Color Palette Role / Global Brand Color）改用會跟著主題切換的 Camelot 元件。

## 交付方式
- 單一分支、分階段 commit（每階段回報）、最後一次開 PR。
- 四主題（material/cupertino/scifi/aqua）+ color role 一致。

## 階段
- Phase 1：Tabs/Steps color prop + role class，取代硬編 primary。
- Phase 2：`cml-theme-transitioning` 暫態 class + CSS 漸變（reduced-motion guard）。
- Phase 3：手機 `showType=auto→dialog`；DateRange 單曆顯示 prev+next。
- Phase 4：VirtualScroll.vue（量測快取可變高）；Table spacer-row 虛擬化（預設開、可 fallback）。
- Phase 5：Pagination.vue（presentational + 省略號演算法）+ Table 範例切片。
- Phase 6：Carousel.vue（track/stacked 兩策略、loop/autoplay/peek/卡疊、slide/fade/zoom/coverflow/cardStack/flip、拖曳）。
- Phase 7：控制面板改 Camelot 元件；下半部整合進上半部 + 新元件展示卡。
- Phase 8：lint/build/preview 驗證、歸檔 + wiki、開 PR。

## 影響檔案
- 修改：`Tabs.vue`、`Steps.vue`、`RippleTabs.vue?`、`Table.vue`、`DateV2.vue`、`DateRangeV2.vue`、`Internal/Calendar.vue`、`useCamelotTheme.ts`、`useCustomColorScheme.ts`、`useMaterial3ColorScheme.ts`、`tailwind.css`、`.playground/app/pages/index.vue`。
- 新增：`VirtualScroll.vue`、`Pagination.vue`、`Carousel.vue`。
- 重用：`useCamelotRoleColorClass`、`useDeviceBreakpoints`、`useVirtualList`(快路)、`useIntervalFn`/`useSwipe`/ResizeObserver、`CamelotBaseDialogV2`、`CamelotSelectV2`、`CamelotNumberCounter`。

## 參考
- 主題系統：`.agents/project/wiki/features/theme-system.md`、`useCamelotRoleColorClass.ts`
- 浮層裁切前例（記憶）：popup-shadow-clip-pattern

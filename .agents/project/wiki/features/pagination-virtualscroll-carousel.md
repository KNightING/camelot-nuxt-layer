# 🧩 Pagination / VirtualScroll / Carousel + 主題色彩批次

> 一個批次：Tabs/Steps 色彩角色、主題顏色漸變、三個新元件（Pagination / VirtualScroll / Carousel）、Table 預設虛擬滾動、DatePicker 手機 modal、Playground 重構。皆四主題（material/cupertino/scifi/aqua）+ color role。

## 🎨 Tabs / Steps / RippleTabs 色彩角色
- 三者新增 `color?: CamelotColorRole`（預設 `primary`），以 `useCamelotRoleColorClass` 注入 `--cml-color-current-color` / `--cml-color-current-on-color`。
- 取代硬編 `bg-primary` / `text-primary` / `var(--cml-c-m3-primary)`；Steps material 區塊改為與 cupertino/scifi/aqua 相同的 `var(--cml-color-current-color, var(--color-primary))`。RippleTabs 選中態用 container 色階。

## 🌈 主題顏色漸變
- `useCamelotTheme` 匯出 `triggerThemeTransition()`：切換主題風格 / 深淺色 / 色系 / 品牌色時，在 `<html>` 暫加 `cml-theme-transitioning`（單例 360ms 計時器），CSS 對 bg/text/border/fill/stroke 做 0.32s `ease-ios` 過場；尊重 `prefers-reduced-motion`，不使用 `!important` 以免覆蓋元件自身過場。
- 觸發點：themeMode/colorMode watcher、`setThemeColor`（品牌色）、playground 的色彩角色變更。

## 📑 CamelotPagination（`Pagination.vue`）
- presentational（父層自行切片）。`v-model` 頁碼、`v-model:pageSize`、`total` 或 `totalPages`、`siblingCount`/`boundaryCount` 省略號演算法、prev/next、`showTotal`/`showJumper`/`showPageSize`、`color`。
- 四主題 + color role（當前頁用 `--cml-color-current-color` / aqua-fill）。與 Table 結合：`data.slice((page-1)*pageSize, page*pageSize)`。

## 📜 CamelotVirtualScroll（`VirtualScroll.vue`）+ `useCamelotVirtual`
- **可變高度**虛擬滾動（vue-virtual-scroller 風格，不需固定列高）。`useCamelotVirtual` 維護量測快取 + 前綴和 offset，二分搜尋可視範圍，回傳 `topPad`/`bottomPad`/`visibleIndices`/`setSize`/`scrollToIndex`。
- `VirtualScroll.vue`：泛用 div 清單（垂直/水平），`items`/`itemKey`/`estimatedItemSize`/`overscan`/`height`/`maxHeight`；default slot `{ item, index }`；ResizeObserver 量測；expose `scrollToIndex`。

## ▦ Table 預設虛擬滾動
- `Table.vue` 新增 `virtual`（預設 `true`）、`estimatedRowHeight`。以 **spacer-row** 策略虛擬化 `<tbody>`：上/下 spacer `<tr>` 撐高 + 中間實渲染窗格，保留 `<table>` 欄寬對齊、sticky header、fixed columns、stripe/hover、pinned 列與 `#cell-*` slot；真實 `rowIndex` 不變。`virtual=false` 回退原本自動撐高渲染。需搭配 `maxHeight` 才有效益。

## 🎠 CamelotCarousel（`Carousel.vue`）
- 統一「依帶號距離計算 transform」策略：每張投影片的 transform/opacity 由其（loop 環繞後）與當前項距離推導 → 無限循環自動成立、只渲染可視窗。
- 效果：`slide` / `fade` / `zoom` / `coverflow` / `cardStack` / `flip`。橫向/縱向、`loop`、`autoplay`（`useIntervalFn`，hover/拖曳暫停）、`peek`（前後各 N 個鄰項，slide/coverflow/zoom）、`gap`、門檻式 swipe、themed 箭頭 + dots、`prefers-reduced-motion`。`v-model` index；expose `next/prev/go`；default slot `{ item, index, isActive }`。

## 📅 DatePicker 手機
- DateV2 / DateRangeV2：`showType='auto'` 在手機（`useDeviceBreakpoints().isMobile`，<md）改用置中 `CamelotBaseDialogV2`（modal），桌機維持 popup。
- DateRangeV2：第二月曆改由斷點驅動（`showSecondCalendar`），單月曆（手機/收合）時第一月曆保留 prev+next 箭頭。trigger 的 `onClickOutside` 僅在 popup 模式關閉（dialog 由 modal 自行處理遮罩/Esc）。

## 🧪 Playground
- 控制面板（Active Style Theme / Dark-Light / Color Palette Role / Global Brand Color）改用 `CamelotButton`，跟著主題切換（active 實心、inactive container/淡化）。
- 下半部 ad-hoc 測試區整合進上方展示卡（Date Pickers / Virtual Scroll / Utilities / Carousel / Pagination），移除舊測試區。

## 🩹 後續強化（同分支）
- **色彩角色擴展**：Tree / Menu / SelectV2（options）/ DateV2 / DateRangeV2 新增 `color` prop，注入 `--cml-color-current-color` 取代硬編 primary（MenuItem active、Select 選中項 + scoped CSS、Calendar 選中/今日/區間/dot）。Tree 透過 context 的 **reactive getter** 把 color 傳給列內 Checkbox。
- **CamelotCarouselIndicator（新元件）**：獨立指標點，橫/縱排、`#dot` slot 自訂、`v-model` index、color role。Carousel 改用它並轉送 `#dot`；`showDots` 仍可整個關閉。
- **Carousel 觸控/箭頭**：依方向設 `touch-action`（pan-y / pan-x）支援觸控換頁；`showArrows` 關閉左右按鈕。
- **CamelotSlider（新元件）**：單值或雙滑桿 `range`；`min`/`max`/`step`（間隔停頓吸附）/`height`/`marks`（true 或 `{value,label}[]` 間隔文字）/`showTooltip`/`color`；pointer 拖曳 + 點軌道移最近 thumb + 方向鍵 a11y；四主題。
- **DatePicker 修正**：手機 dialog 移除內層 `panelClass`（BaseDialogV2 已有外框）避免雙層框；DateRange trigger 依值寬度（避免多餘空白）並保留高度。

## 參考
- 浮層落影裁切前例：[[popup-shadow-clip-pattern]]
- 主題系統：[theme-system.md](./theme-system.md)、`useCamelotRoleColorClass.ts`、`useCamelotVirtual.ts`

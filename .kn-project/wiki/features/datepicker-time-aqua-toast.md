# 🗓️🪟🔔 DatePicker 時間/確認・Aqua 邊框 Token・Toast 動畫批次

> 一個收尾批次：DatePicker 時間模式（完整顯示、確認按鈕、小螢幕垂直、月/年選擇橫跨雙月曆）、Aqua 浮層邊框走主題 `--color-border` token、`on-*` 前景配對修正、Toast 透明度與滑入玻璃漸入動畫。對應計畫 `2606082359`。

## 🗓️ DatePicker（DateV2 / DateRangeV2 / Internal/Calendar）
- **時間完整顯示**：DateRangeV2 trigger 的起/迄 input 改為依內容自適應寬度（`:style` ch），修正 `enableTime` 時 `yyyy-MM-dd HH:mm:ss` 被裁切。
- **確認按鈕（兩者一致）**：時間模式於「迄」時間列旁／月曆下方加入 `CamelotButton`「確認」（`confirmRange`/`confirmTime` → `open=false`），讓手機 modal 有明確離開入口。DateV2 比照 range：月曆設 `hide-time`，把單一時間列抽出與確認鈕置於同一 `border-t` 區塊（消除雙分隔線）。
- **小螢幕垂直 trigger**：`isMobile && enableTime` 時，DateRangeV2 trigger 由「起 ~ 迄」水平改為起/迄 **垂直堆疊並各帶「起」「迄」標籤**；桌機維持水平 `~`。
- **月/年選擇橫跨雙月曆**：雙月曆 range 中任一月曆進入月/年選擇時，隱藏另一個月曆、選擇器撐滿兩個月曆寬度並置中（`Calendar` 開放 `v-model:picker-mode` + `pickerExpand`；DateRangeV2 以 `useElementSize` 釘住列寬避免收縮）。

## 🎨 Aqua 邊框 → 主題 Token
- 新增語意化 **`--color-border`** token（`@theme` 預設＝M3 `outline-variant`，同時產生 `border-border` 工具）。
- per-theme 覆寫：`:root[data-camelot-theme-mode="aqua"]` → `color-mix(current-color 12%)`（與 Tabs `aqua-track` 同等髮絲）。
- `aqua-glass` / `aqua-track` 邊框改吃 `var(--color-border)`，**不再硬編** `color-mix`；玻璃頂部高光由 `white 60%`→`18%`，Select/Date 等亮高光 `0.5`→`0.16`。一次到位讓 Dialog/Sheet/Toast/Table/Options/DatePicker 邊框同步變輕。

## 🅰️ `on-*` 前景配對修正
- **原則**：背景使用某色角色（`--cml-color-current-color`）的表面，前景必須用配對的 `--cml-color-current-on-color`，而非寫死 `on-primary`/白。
- 修正：SelectV2 scifi option hover/selected、`useCamelotPickerTheme` aqua `selectedSurfaceClass`（`aqua-fill`）、Steps cupertino 進行中圓點 → 改用 `var(--cml-color-current-on-color)`。
- BottomSheet：aqua 玻璃面板補上 `text-on-surface`（與 Dialog 一致）。

## 🔔 Toast / 通知
- **背景更透明**：aqua 通知背景 `surface 72%`→`55%`（僅通知）。
- **滑入 + 玻璃漸入**：入/退場改用 `TransitionGroup` JS hooks——以 `transform` 滑入+淡入（GPU 流暢），滑完移除 `transform` 後再把 `backdrop-filter` 模糊 `0→目標` 漸入。因為 **`transform` 期間 `backdrop-filter` 會失效**（祖先 transform 使元素自成合成群組，backdrop 取樣到空白），無法在位移中保有毛玻璃，故改為「位移後漸入」避免結尾閃現。
- **center 不跳動**：center 堆疊移除 `-translate-y-1/2`，改頂端錨點由中心往下堆疊，新增通知不再瞬間重新置中／推擠既有通知。

## References
- 計畫：`.kn-project/archive/2606082359-daterange-time-aqua-toast.md`
- 相關 Wiki：[Calendar](./calendar.md)、[主題系統](./theme-system.md)、[Pagination/Virtual/Carousel 批次](./pagination-virtualscroll-carousel.md)
- 浮層落影裁切前例：[[popup-shadow-clip-pattern]]

---

[🗓️ Calendar](./calendar.md) | [🎨 主題系統](./theme-system.md) | [🏠 Wiki](../index.md)

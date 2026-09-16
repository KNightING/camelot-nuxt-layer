# 2609161544 - marquee-tooltip-sheet-gesture-scroll-lock

- Created: 2026-09-16 15:44 / Archived: 2026-09-16
- Issue: KNightING/camelot-nuxt-layer#41
- Milestone: N/A / Base Branch: main

## Summary
新增 `CamelotMarquee` 跑馬燈與 `CamelotTooltip`（hover／觸控長壓／Tab focus-visible、自行找空間定位），`BaseBottomSheetV2` 支援從頂部把手向下拖曳關閉且遮罩隨進度漸淡，並以 `html { scrollbar-gutter: stable }` 讓 Dialog／Sheet／Drawer 鎖捲動時版面寬度不再跳動。
執行中併入三項修正：Date／DateRange／Time picker 觸發器點 icon 或 `~` 不會開啟（`<label>` 啟用行為二次 toggle）；Calendar 日期 label 改單行截斷（格高 52→42px），截斷時以 Tooltip 顯示完整內容；Tooltip 的 focus 觸發只認 `:focus-visible`，點擊不再觸發。
影響模組：`tailwind.css`、`BaseDialogV2`、`BaseBottomSheetV2`、`Internal/SheetHandle`（new）、`Tooltip`（new）、`Marquee`（new）、`DateV2` / `TimeV2` / `DateRangeV2`、`Internal/Calendar`、playground。

## Cross-Repo Scope
無（單一 repo）

## Key Decisions
- **[拆分]** 四項需求合為一份計畫、一個 PR — 使用者選擇。
- **[Scroll lock]** 採 `scrollbar-gutter: stable`（一行 CSS，thumb 消失可接受）；全 repo 只有 `BaseDialogV2.vue`（`body:has(dialog[open])`）與 `Drawer.vue`（`body.style.overflow`）兩處鎖 body 捲動，皆靠 overflow 傳播到 viewport 而受惠；PopupV2／SelectV2／CascadeMenuPanel／TimeField 用 `<dialog>` 但不鎖捲動。
- **[Sheet]** 只允許從把手起手、只允許向下（向上位移會露出面板底下空白）；門檻 35% 高度或甩動（≥0.6px/ms 且 ≥32px，放開前停頓 >100ms 視為無速度）；拖曳位移放在 `.wrapper` 內另一層 `.sheet-drag`，因 `.wrapper` 的 slide-up keyframe 以 `forwards` 填充會蓋過 inline transform；遮罩透明度由 `::backdrop` 讀 dialog 的 `--cml-backdrop-progress`（`::backdrop` 繼承 originating element 的 custom property）。
- **[Sheet]** BottomSheet 只定義 `open` model 與 `draggable`／`dismissThreshold`，其餘 props 仍靠 attrs 落到 BaseDialogV2。
- **[Tooltip]** 自行定位而非包 PopupV2（PopupV2 左對齊、無置中，邊緣顯示不到）：偏好上方、不足時翻下方，水平置中並夾進 visualViewport（8px 邊距），開啟期間每幀重算；經 `useCamelotTeleportTarget` teleport 進最近的 `<dialog>`。
- **[Tooltip]** touch 長壓開啟後手指放開即關；focus 只認 `:focus-visible`，滑鼠點擊／觸控輕點的 focus 不開；`onlyWhenTruncated` 只量水平截斷（1px 容差）。
- **[Marquee]** 不給容器尺寸 class（`h-full` 會壓過使用端的 `h-16`），垂直方向需自行給高度；外部 `paused` 規則特異度須壓過 `animation` 縮寫（縮寫會重設 play-state）。
- **[Picker]** 觸發器 `<label>` 改 `@click.prevent="togglePopup"` 並移除 icon 上繞過 label 的 `@click.stop` — 點非 input 子元素時 label 啟用行為會對內層 input 補發 click、冒泡回來再 toggle 一次。
- **[Calendar]** 日期 label 單行 `truncate`、格高 `min-h-[42px]`，截斷時 Tooltip（`block` + `onlyWhenTruncated`）顯示完整內容。
- **[Milestone]** 不指定，PR 併回 `main`。

## Deviations
- 原計畫四項；執行中依使用者回饋併入 picker icon 點擊修正、Calendar label 單行化、Tooltip 定位重寫與 focus 限制，皆記於 Key Decisions。

## Impact Files
- `app/assets/css/tailwind.css:150`（`@layer base` `html`）— `scrollbar-gutter: stable`
- `app/components/Camelot/Internal/SheetHandle.vue` (new) — 拖曳把手（44px 熱區、`touch-none`、四主題指示條）
- `app/components/Camelot/BaseBottomSheetV2.vue` — `draggable`／`dismissThreshold`，`.sheet-drag` 跟手、門檻／甩動判定、彈回
- `app/components/Camelot/BaseDialogV2.vue` — `backdropProgress`／`backdropImmediate` props，`::backdrop` `opacity: calc(1 - var(--cml-backdrop-progress))`
- `app/components/Camelot/Tooltip.vue` (new) — `content`／`placement`／`openDelay`／`longPressDuration`／`offset`／`disabled`／`zIndex`／`block`／`onlyWhenTruncated`
- `app/components/Camelot/Marquee.vue` (new) — `direction`／`speed`／`pauseOnHover`／`gap`／`paused`
- `app/components/Camelot/DateV2.vue:36`、`TimeV2.vue:36`、`DateRangeV2.vue:43` — label `@click.prevent`
- `app/components/Camelot/Internal/Calendar.vue:99`、`:132` — 格高 42px、label truncate + Tooltip
- `.playground/app/pages/index.vue` — Tooltip／Marquee 卡、Sheet 拖曳說明

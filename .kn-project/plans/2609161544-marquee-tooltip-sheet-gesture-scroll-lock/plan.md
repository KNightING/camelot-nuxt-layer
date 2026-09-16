# Plan: 2609161544 - 跑馬燈、Tooltip、Sheet 手勢關閉、Scroll lock 保留捲軸空間
- Created: 2026-09-16
- Branch: feature/2609161544-marquee-tooltip-sheet-gesture-scroll-lock
- Issue: KNightING/camelot-nuxt-layer#41
- Milestone: N/A（未指定）
- Base Branch: main
- Status: In Progress
- Completed: [Wait for Finish]

## Goals
1. 新增 `CamelotMarquee` 跑馬燈：內容無縫循環捲動，支援方向、速度、hover 暫停、`prefers-reduced-motion`。
2. 新增 `CamelotTooltip`：pointer `fine` 時 hover 顯示；touch 時長壓（預設 500ms）顯示、手指放開即關。四主題外觀。
3. `BaseBottomSheetV2` 支援手勢拖曳關閉：只能從頂部把手起手（觸控或滑鼠壓住把手），sheet 跟手位移，遮罩透明度依拖曳進度漸變；放開超過門檻或速度即關閉，否則彈回。
4. Dialog / Sheet / Drawer 開啟時的 scroll lock 不再讓版面寬度跳動：`html { scrollbar-gutter: stable }` 永遠保留捲軸空間。

## Architecture
### 1. Marquee（`app/components/Camelot/Marquee.vue`，new）
- 結構：外層 `overflow-hidden` 容器 → 內層 `flex` 軌道，`<slot />` 內容渲染兩份（第二份 `aria-hidden`）達成無縫接續。
- 動畫：CSS `@keyframes` translate 0 → −50%（軌道含兩份內容），`animation-duration` 由 `ResizeObserver` 量到的單份內容尺寸 ÷ `speed`（px/s）計算，寫入 CSS 變數；內容或容器尺寸變動即重算。
- Props：`direction: 'left' | 'right' | 'up' | 'down'`（預設 left）、`speed`（px/s，預設 60）、`pauseOnHover`（預設 true）、`gap`（預設 `1rem`）、`paused`（外部暫停）。
- `prefers-reduced-motion: reduce` → 停止動畫、僅顯示一份內容；內容未超出容器寬度時也不捲（`autoFill` 不做，維持簡單）。
- 主題：不分主題（純版面元件）。

### 2. Tooltip（`app/components/Camelot/Tooltip.vue`，new）
- 以 `CamelotPopupV2 manual` 包裝，由 Tooltip 自己控制 `open`：
  - （定位改為自行實作，見 Key Decisions）
  - `pointerenter`（`pointerType !== 'touch'`）→ `openDelay`（預設 150ms）後開；`pointerleave` → 關。
  - `pointerdown`（`pointerType === 'touch'`）→ 計時 `longPressDuration`（預設 500ms）開；`pointerup` / `pointercancel` / `pointerleave` / 移動超過 10px → 清計時並關（手指放開即關）。長壓期間以 `touch-action: none`／`contextmenu.prevent` 抑制系統選單。
  - 鍵盤：觸發元素 `focusin` 開、`focusout` 關（a11y）。
- Props：`content?: string`（或用 `#content` slot）、`placement: 'top' | 'bottom'`（映射 PopupV2 `verticalPosition`）、`openDelay`、`longPressDuration`、`disabled`。
- 外觀：四主題各一組 class（material `bg-inverse-surface text-inverse-on-surface`、cupertino 毛玻璃、aqua `aqua-glass`、scifi 髮絲框+等寬）、`role="tooltip"` 並以 `aria-describedby` 連結觸發元素。

### 3. Sheet 手勢關閉（`BaseBottomSheetV2.vue` + `BaseDialogV2.vue`）
- 四個主題的指示條改為同一個 `CamelotInternalSheetHandle`（new，`Internal/SheetHandle.vue`）：`touch-action: none`、`cursor: grab`、熱區放大到 44px 高、`role="button"`、`aria-label="拖曳關閉"`。
- 拖曳只從把手起手：把手 `pointerdown` → `setPointerCapture`，`pointermove` 累積 `dy`（只允許 ≥ 0，向上以阻尼 0.2 表現）；sheet 容器 `transform: translateY(dy)`，拖曳期間停用 transition。
- 遮罩漸變：進度 `p = clamp(dy / sheetHeight, 0, 1)` 寫入 `<dialog>` 的 CSS 變數 `--cml-sheet-drag`；`BaseDialogV2` 的 `dialog::backdrop { opacity: calc(1 - var(--cml-sheet-drag, 0)) }`（`::backdrop` 繼承 originating element 的 custom property）。需在 `BaseDialogV2` 暴露 dialog 元素或提供 `dragProgress` model 給 wrapper slot 寫回。
- 放開：`dy > sheetHeight * 0.35` 或 釋放速度 > 0.6px/ms → 關閉（沿用既有 leave transition，從當前位移續滑出）；否則以 `ease-spring` 彈回 0。
- 不影響 `closeByMask`、Esc 既有行為。

### 4. Scroll lock 保留捲軸空間（`tailwind.css` + Drawer 檢查）
- `@layer base` 的 `html` 加 `scrollbar-gutter: stable`。`body { overflow: hidden }`（Dialog 的 `:global(body:has(dialog[open].camelot-dialog))` 與 Drawer 的 `body.style.overflow`）都會傳播到 viewport，gutter 因此保留，寬度不變；捲軸軌道仍顯示但 thumb 消失（無可捲內容）。
- 全 repo 審視：只有 `BaseDialogV2.vue:213`（涵蓋所有基於它的 Dialog / BottomSheet / ConfirmDialog / ErrorDialog）與 `Drawer.vue:69` 兩處鎖 body 捲動；`PopupV2` / `SelectV2` / `CascadeMenuPanel` / `TimeField` 雖用 `<dialog>` 但不鎖捲動，不受影響。兩處鎖定邏輯本身不改。
- playground 疊層檢查點加一段「開啟 Dialog / Sheet / Drawer 時量測 `document.documentElement.clientWidth` 不變」的說明。

## Cross-Repo Scope
無（單一 repo）

## Impact Files
- `app/components/Camelot/Marquee.vue` (new) — 跑馬燈
- `app/components/Camelot/Tooltip.vue` (new) — Tooltip，包裝 `PopupV2 manual`（`PopupV2.vue:91` `manual`、`:111` `triggerMode`、`:119` `open` model）
- `app/components/Camelot/Internal/SheetHandle.vue` (new) — Sheet 拖曳把手
- `app/components/Camelot/BaseBottomSheetV2.vue:17`、`:27`、`:35`、`:44`（四主題指示條）— 換成 `SheetHandle`；`:80`（`.wrapper`）— 拖曳位移、進度回寫
- `app/components/Camelot/BaseDialogV2.vue:5`（`ref="dialog"`）、`:262`（`dialog::backdrop`）— `--cml-sheet-drag` 遮罩透明度；提供進度寫入管道給 wrapper slot
- `app/assets/css/tailwind.css:150`（`@layer base` `html`）— `scrollbar-gutter: stable`
- `app/components/Camelot/Drawer.vue:69` — 僅驗證（body overflow 鎖與 gutter 相容），不改碼
- `app/components/Camelot/DateV2.vue:36`、`TimeV2.vue:36`、`DateRangeV2.vue:43` — label `@click.prevent`，DateV2/TimeV2 移除 icon `@click.stop`
- `.playground/app/pages/index.vue` — Marquee、Tooltip 範例；Sheet 手勢示範說明；scroll lock 寬度驗證說明
- `.playground/app/pages/page/…`（疊層檢查點頁，Phase 3 定位）— 視需要補 Sheet 手勢

## Open Questions / 待確認事項
無（拆分方式、scroll lock 方案、tooltip 關閉時機、milestone 已於對話中確認）

## Key Decisions
- **[拆分]** 四項合為一份計畫、一個 PR — 使用者選擇（來源：對話確認）
- **[Scroll lock]** 採 `scrollbar-gutter: stable`，Drawer 一併涵蓋；全 repo 只有 BaseDialogV2 與 Drawer 兩處鎖 body 捲動 — 一行 CSS、零 JS；thumb 消失可接受（來源：對話確認）
- **[Tooltip]** touch 長壓開啟後手指放開即關 — 類 iOS 預覽，不留下無人關的 tooltip（來源：對話確認）
- **[Tooltip]** 以 `PopupV2 manual` 包裝而非另寫定位 — 重用既有定位／teleport／dialog 內疊層處理
- **[Sheet]** 只允許從把手起手拖曳 — 使用者明確要求；避免與 sheet 內容捲動衝突
- **[Sheet]** 遮罩透明度走 `::backdrop` 讀 dialog 的 CSS 變數 — 不另加一層遮罩元素
- **[執行中]** Sheet 拖曳位移放在 `.wrapper` 內另一層 `.sheet-drag` — `.wrapper` 的 slide-up keyframe 以 `forwards` 填充，其 transform 會蓋過同元素 inline transform
- **[執行中]** BottomSheet 只定義 `open` model 與 `draggable` / `dismissThreshold`，其餘 props 仍靠 attrs 落到 BaseDialogV2 — 維持既有用法不變
- **[執行中]** 甩動關閉需同時滿足速度 ≥ 0.6px/ms 與距離 ≥ 32px；放開前停頓 > 100ms 視為無速度 — 避免輕點抖動與拖到一半停住再放開被當成甩動
- **[迭代]** Tooltip 改為自行定位（不再包 PopupV2）：偏好上方、不足時翻下方，水平置中並夾進 visualViewport（8px 邊距），開啟期間每幀重算；經 `useCamelotTeleportTarget` teleport 進最近的 `<dialog>` — 使用者指出固定位置在邊緣會顯示不到
- **[執行中]** Marquee 不給容器尺寸 class（原 `h-full` 會壓過使用端的 `h-16`），由使用端決定；垂直方向需自行給高度
- **[迭代]** Marquee 外部 `paused` 原本無效：`animation` 縮寫會重設 play-state 且特異度較高，改以 `.cml-marquee-track.cml-marquee-running.cml-marquee-paused` 壓過
- **[迭代]** Sheet 拖曳只允許向下（夾在 0）— 向上位移會露出面板底下的空白（來源：使用者指正）
- **[迭代]** Tooltip 的 focus 觸發只認 `:focus-visible` — 滑鼠點擊／觸控輕點造成的 focus 不開，否則變成點擊觸發（來源：使用者指正）
- **[迭代]** Date / DateRange / Time picker 點 icon／`~` 不開：觸發器是 `<label>`，點非 input 子元素時 label 啟用行為會對內層 input 補發 click、冒泡回來再 toggle 一次；改 `@click.prevent="togglePopup"` 並移除 icon 上繞過 label 的 `@click.stop`（來源：使用者回報，順手併入本計畫）
- **[Milestone]** 不指定，PR 併回 `main`（來源：對話確認）

## Git Completion Policy
- PR 一律以 `--base main` 顯式指定 base (Rule 23)。
- Issue 綁定時，每個 commit 訊息與 PR body 都必須含 `Closes #${N}`。歸檔完成後於該 issue 張貼結案留言 (Rule 20)。
- Issue 的關閉發生在合併後清理，不在歸檔當下 (Rule 21)。
- After user-approved commits, completion will run `git rebase main` and `git push --force-with-lease --force-if-includes`.
- PR/archive order: Archive automatically triggered on PR request

## References
- `.kn-project/wiki/features/components/PopupV2.md`、`BaseBottomSheetV2.md`、`layering.md`

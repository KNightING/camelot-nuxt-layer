# Plan: 2608121105 - overlay-demos-into-index

- Created: 2026-08-12
- Branch: fix/2608121105-overlay-demos-into-index
- Issue: KNightING/camelot-nuxt-layer#19
- Status: In Progress
- Completed: [Wait for Finish]

## Goals

把 `/dialog` 分頁的 Overlay 範例併入主畫面 `index.vue` 的既有 **Overlays (Dialog & Sheet)** 卡片，聚焦展示三件事：

1. **部分覆蓋色彩方案、其餘繼承 global theme** —— 以 `CamelotCustomColorSchemeProvider` 只覆寫 `primary` 與自訂鍵，其餘色票（surface / on-surface / outline…）仍隨全域主題與深淺色走。
2. **URL 可控的 Dialog / Sheet** —— `:query="{ key, value }"` 與 `tag`，網址可直接開啟、上一頁可關閉。
3. **Dialog / Sheet 共通值** —— 同一組 `v-model` 狀態同時被 Dialog 與 Sheet 內的控制項讀寫。

同時修正 `/dialog` 頁實測確認的三個顯示問題（見下方佐證）。

## Architecture

### 問題佐證（`/dialog`，viewport 1280×800，aqua 主題）

| 回報問題 | 實測 | 真正成因 |
| :--- | :--- | :--- |
| Dialog 缺少關閉按鈕 | 關閉鈕**存在**，但 rect `x: 1442`，viewport 寬 1280 → **超出右緣 162px** | 範例自帶 `w-[90vw]` 內層盒（實測 1060px）塞進 `max-w-[560px]` 的 aqua 外框（實測 515px），溢出後關閉鈕被推出畫面 |
| Dialog 邊框厚重 | 外框 `padding: 24px`、`border: 1px`、`border-radius: 24px` | 範例在「元件已提供的主題化外框」內**再包一層自己的不透明盒**（`bg-surface-container`），24px 毛玻璃 padding 環因此被看成粗邊框 |
| Sheet 邊框厚重 | 容器 `padding: 16px` + 範例自帶 `bg-surface-container` 盒 | 同上，雙層盒 |
| Sheet 內容過寬有 x 軸 | `scrollWidth 1312` vs `clientWidth 1278` → **溢出 34px** | 範例內層盒 `w-screen`(1280) + 容器 `p-4` 左右 padding(32) = 1312，剛好吻合 |

**結論：三個問題全部源自「範例把 Base 元件當成空殼、自己又包一層完整盒子」**，不是元件本身的版面壞掉。`index.vue` 既有的 Overlay 範例（`index.vue:1336-1370`）寫法正確、沒有這些問題，因此併入時直接以正確寫法重寫，不搬運舊寫法。

另有一個**元件層的潛在缺陷**（與上述四項獨立）：`BaseBottomSheetV2` 四種版面的 sheet 容器一律用 `w-screen`（`100vw`）。`100vw` **包含垂直捲軸寬度**，實測 `docClientWidth` 為 1278 而 `100vw` 為 1280，即使範例內容完全正常也會有 2px 溢出。見 Q2。

### 併入方式

不新增卡片，**擴充既有的 Overlays 卡片**（`index.vue:415-435`）與其 overlay 定義區（`index.vue:1336-1370`）：

- 卡片內新增第三顆按鈕「Open Scoped Dialog」，示範 2 + 3；既有兩顆維持不變。
- Scoped 範例外層包 `CamelotCustomColorSchemeProvider`，只給 `primary` 與自訂鍵 `test` 的 light/dark 值。
- Dialog 帶 `:query="{ key: 'dialog', value: 'scoped' }"`，Sheet 帶 `tag="scoped-sheet"`。
- 共通值以 `overlaySharedValue` + `overlaySharedOption` 兩個 ref 貫穿 Dialog 與 Sheet（`CamelotNumberCounter` + `CamelotSelectV2`），兩邊互相反映。
- 內容一律**只放內容**，不自帶盒子、不使用 `w-screen` / `w-[90vw]`；寬度交給元件的 `max-w` 與 `p-*` 決定。

> `index.vue` 目前 2524 行，已遠超 code-style 對 pages 的 300 行上限。本次採「擴充既有卡片」而非新增區塊，淨增預估 60 行以內；整頁拆分屬既有技術債，不在本次範圍（見 Q4）。

## Cross-Repo Scope

- **本計畫所屬 repo**: `camelot-nuxt-layer`
- **共用計畫 ID**: `2608121105-overlay-demos-into-index`　**共用分支名**: `fix/2608121105-overlay-demos-into-index`
- 無（單一 repo）

## Impact Files

- `.playground/app/pages/index.vue:415` (Overlays 卡片) — 新增 Scoped 範例的觸發按鈕。
- `.playground/app/pages/index.vue:1336` (`CamelotBaseDialogV2` / `CamelotBaseBottomSheetV2` overlay 定義) — 新增 scoped dialog / sheet，並接上共通值。
- `.playground/app/pages/index.vue:1506` (`useCamelotTheme()` 解構處附近的 script) — 新增 scoped 色彩方案與共通值的 ref。
- `.playground/app/pages/dialog.vue` — 範例來源；處置依 Q1。
- `app/components/Camelot/BaseBottomSheetV2.vue:14,25,34,43` (`w-screen`) — 依 Q2 改為 `w-full`。
- `.playground/app/components/OverlaySharedFields.vue` (new) — Dialog 與 Sheet 共用的欄位組，避免同一段內容在兩處重複。
- `app/components/Camelot/ConfirmDialog.vue` (new) — 追加範圍；組合 `BaseDialogV2:1` 與 `Button.vue:1`，不新增第五套版面。
- `.playground/app/pages/index.vue` (Overlays 卡片) — 追加 ConfirmDialog 的展示（三顆按鈕 / 僅預設確認鈕兩種）。

## Open Questions / 待確認事項

### Q1. `/dialog` 分頁的處置 — 影響範圍：`.playground/app/pages/dialog.vue`
「移動」通常代表來源要移除，但該頁還有一個與 Overlay 無關的 `open loading` 範例（`dialog.vue:123-129`），而 `index.vue` 的 Feedbacks 卡片（`index.vue:463`）已有 Loading 展示。

- [ ] 選項 A：刪除整個 `/dialog` 分頁，loading 範例不搬（`index.vue` 已有）　(建議，理由：真正的「移動」，不留下重複且已知有顯示問題的頁面)
- [ ] 選項 B：保留 `/dialog` 但修正其顯示問題，兩邊都有
- [x] 選項 C：刪除分頁，但把 loading 範例也搬進 index
- **決議**：選項 C　狀態：✅ 已確認

### Q2. `BaseBottomSheetV2` 的 `w-screen` 是否一併修正 — 影響範圍：`app/components/Camelot/BaseBottomSheetV2.vue`
`100vw` 含捲軸寬，實測即使內容正常仍有 2px 溢出。改為 `w-full` 可根治，但這是 **layer 元件**，會影響所有消費端。

- [x] 選項 A：一併改為 `w-full`（四種版面）　(建議，理由：2px 溢出已由本次量測證實為真實缺陷；`w-full` 在 dialog 全寬容器內等效且不含捲軸寬)
- [ ] 選項 B：本次只修 playground 範例，元件缺陷另開計畫
- [ ] 選項 C：其他，請補充
- **決議**：選項 A　狀態：✅ 已確認

### Q3. Dialog 內容溢出是否由元件層兜底 — 影響範圍：`app/components/Camelot/BaseDialogV2.vue:41,49`
本次的關閉鈕消失，根因是 slot 內容撐破 `max-w-[560px]` 後**沒有被裁切也沒有捲動**，直接溢出到畫面外。範例寫對就不會發生，但下一個使用者仍可能踩到。

- [x] 選項 A：不動元件，只修範例　(建議，理由：溢出到畫面外雖不友善，但加上 `overflow-hidden` 會裁掉內容、加 `overflow-auto` 會產生非預期捲軸，兩者都可能破壞既有消費端版面；此議題應獨立評估)
- [ ] 選項 B：content box 加 `overflow-auto`，讓超寬內容可捲動
- [ ] 選項 C：content box 加 `overflow-hidden`，直接裁切
- **決議**：選項 A　狀態：✅ 已確認

### Q4. `index.vue` 2524 行的拆分 — 影響範圍：`.playground/app/pages/index.vue`
已遠超 code-style 對 pages 的 300 行上限。

- [x] 選項 A：本次不處理，維持擴充既有卡片　(建議，理由：屬既有技術債，與本次需求正交；混入會讓 diff 失焦)
- [ ] 選項 B：本次一併拆分成多個 section 元件
- **決議**：選項 A　狀態：✅ 已確認

### 追加範圍：`ConfirmDialog` 元件（使用者於執行中提出）

新增 `app/components/Camelot/ConfirmDialog.vue`，組合 `BaseDialogV2` + `CamelotButton`。**不自己寫四套版面** —— `CamelotButton` 已依 `themeMode` 分派 scifi / cupertino / aqua / material，`BaseDialogV2` 已提供主題化外框，兩者組合即自動跟著風格走。

擬定 API：

```ts
// props（overlay 相關的 closeByMask / tag / zIndex / query 透傳 BaseDialogV2）
title?: string
message?: string
positiveLabel?: string        // 預設 '確認'
neutralLabel?: string         // 未設定 → 不顯示
negativeLabel?: string        // 未設定 → 不顯示
positiveColor?: CamelotColorRole   // 預設 'primary'
neutralColor?: CamelotColorRole    // 預設 'primary' + isContainer
negativeColor?: CamelotColorRole   // 預設 'error'
autoClose?: boolean           // 預設 true

// v-model
open: boolean

// emits（複寫事件的入口）
positive: []
neutral: []
negative: []

// slots
default   // 取代 message
title     // 取代 title
actions   // 完全接管按鈕列
```

行為：三顆按鈕**依 label 是否設定決定顯不顯示**，預設只有 positive（確認）。任一顆點擊皆 emit 對應事件；`autoClose` 為 true（預設）時同時關閉 dialog，設為 `false` 則由使用端自行控制 `open`（供非同步驗證等情境）。

### Q5. ConfirmDialog 的按鈕排列順序 — 影響範圍：`app/components/Camelot/ConfirmDialog.vue`
Material / Web 慣例是「反向在左、正向在右」，iOS（Cupertino）慣例相反且常為垂直堆疊。

- [ ] 選項 A：固定 `negative → neutral → positive`、靠右對齊，四種風格一致　(建議，理由：行為可預期，使用端不必為了風格切換而重新思考按鈕位置；風格差異已由 `CamelotButton` 的外觀承擔)
- [ ] 選項 B：依 `themeMode` 調整順序與排列（cupertino 垂直堆疊、正向在上）
- [ ] 選項 C：其他，請補充
- **決議**：_(待使用者勾選)_　狀態：⏳ 待確認

### Q6. `autoClose` 的預設與語意 — 影響範圍：`app/components/Camelot/ConfirmDialog.vue`
「預設啟用確認按鈕來關閉 Dialog」已確定；問題是使用端綁了 `@positive` 之後要不要仍自動關閉。

- [ ] 選項 A：`autoClose` 預設 `true`，三顆按鈕皆 emit 事件並關閉；使用端需要非同步流程時設 `:auto-close="false"` 自行控制 `open`　(建議，理由：行為明確不靠「有沒有監聽者」猜測，且退路只需一個 prop)
- [ ] 選項 B：有綁監聽器就不自動關閉，沒綁才關
- [ ] 選項 C：其他，請補充
- **決議**：_(待使用者勾選)_　狀態：⏳ 待確認

### 追加範圍二：Dialog / Sheet 內 Select 浮層的兩個元件缺陷（使用者回報後追查）

`PopupV2` 為繞開 `<dialog>` 的 top layer 限制，會把浮層 **teleport 進最近的 `<dialog>`**（`PopupV2.vue:214-217`）。實測確認由此衍生兩個缺陷，**兩者皆為元件預設行為的問題，不是使用端寫錯**：

| 缺陷 | 實測佐證 | 成因 |
| :--- | :--- | :--- |
| Dialog 內點選項會關閉對話框且未選中 | option `optionInsideDialog: true` 但 `optionInsideContentBox: false` | `BaseDialogV2.vue:89-93` 以「點在 `.dialog-content-box` 之外」判定為點遮罩；teleport 進來的浮層剛好落在其外，於是點選項被誤判成點遮罩 |
| Sheet 疊在選項之上 | popup `z-index: 10`（`PopupV2.vue:15`）vs sheet `.wrapper` `z-index: 60`（`BaseBottomSheetV2.vue:87`） | 兩者同為 `<dialog>` 子節點，層級倒置 |

> 舊 `/dialog` 的 `:close-by-mask="false"` 正是在迴避第一個缺陷。本次範例改用預設值 `closeByMask: true`，才把它翻出來。

**修正原則（使用者裁示）：元件預設就該正確，不得要求使用端傳 prop 迴避。**

- **F1**：`PopupV2` 的 teleport 容器標記 `data-camelot-popup`；`BaseDialogV2.onDialogClick` 在判定遮罩點擊前先排除 `closest('[data-camelot-popup]')`。真正點遮罩的行為不變。
- **F2**：於 `tailwind.css` 建立具名層級刻度 CSS 變數（`--cml-z-drawer` / `--cml-z-sheet` / `--cml-z-popup`），取代目前散落各處硬編碼的 10 / 50 / 60。`PopupV2` 預設層級改為高於 sheet，且 `zIndex` prop **保留覆寫能力**（改用 `??` 以免 `0` 被當成未設定）。
    - 本次僅收斂 `PopupV2` 與 `BaseBottomSheetV2` 兩處；其餘元件（Drawer 50、TimeField 1000、Loading 1100…）的retrofit不在範圍內，但刻度已預留位置。

## Key Decisions

- **[Q1]** 刪除 `/dialog` 分頁，並把 `open loading` 範例一併搬進 `index.vue` — 理由：真正的「移動」，來源不留重複頁面，但 loading 範例本身仍有展示價值。
- **[Q2]** `BaseBottomSheetV2` 四種版面的 `w-screen` 一併改為 `w-full` — 理由：`100vw` 含捲軸寬，實測即使內容正常仍有 2px 溢出；`w-full` 在 dialog 全寬容器內等效且不含捲軸寬。
- **[Q3]** 不對 `BaseDialogV2` 的 content box 加 overflow 兜底 — 理由：`overflow-hidden` 會裁掉內容、`overflow-auto` 會產生非預期捲軸，兩者都可能破壞既有消費端版面，此議題應獨立評估。
- **[Q4]** `index.vue` 的行數拆分本次不處理 — 理由：既有技術債，與本次需求正交，混入會讓 diff 失焦。
- **[執行中／使用者裁示]** `BaseDialogV2` / `BaseBottomSheetV2` **維持沒有內建關閉鈕**，不新增 `closable` prop — 理由：Base 元件的定位就是提供主題化外框與行為，關閉 UI 交由使用端。改以新增 `ConfirmDialog` 元件承載常見的按鈕列需求。
- **[執行中／使用者裁示]** `BaseDialogV2.vue:178-186` 的 Esc 行為**維持現狀不修**（`closeByMask: false` 會連 Esc 一起停用）— 理由：使用者確認此為刻意設計，用於強制決策的 modal。記錄於此以免日後被誤判為 bug 再次「修正」。
- **[執行中／使用者裁示]** Dialog / Sheet 內 Select 浮層的兩個缺陷納入本計畫一併修正（而非另開計畫）— 理由：兩者正是本次把範例改用元件預設值後才暴露的，分開修會讓本次 PR 留著一個明知有問題的範例。
- **[執行中／使用者裁示]** 修正一律做在**元件預設行為**上，不接受「要使用端傳 prop 迴避」的解法；`zIndex` prop 保留覆寫能力 — 理由：使用者明確要求「元件預設就不該有這些問題」。
- **[執行中]** z-index 收斂為 `tailwind.css` 的具名 CSS 變數刻度，而非把 `10` 隨手改大 — 理由：目前 10 / 50 / 60 / 1000 / 1100 散落各元件硬編碼，直接改數字只會製造下一次對撞。
- **[執行中／追加範圍]** 新增 `ConfirmDialog` 元件，組合 `BaseDialogV2` + `CamelotButton`，最多三顆按鈕（positive / neutral / negative），依 label 是否設定決定顯示，預設只有 positive 且點擊即關閉；以 `autoClose` prop 讓使用端可接管關閉時機 — 理由：使用者於執行中提出；組合既有元件即自動具備四風格支援，不需重寫版面。

## Git Completion Policy

- PR body 必須含 `Closes #${N}`（`${N}` 取自上方 `- Issue:`），歸檔後於該 issue 張貼由 archive 蒸餾的結案留言 (Rule 20)。
- 經核准的 Commit 後，完成階段會執行 `git rebase main` 與 `git push --force-with-lease --force-if-includes`（`main` 由 `refs/remotes/origin/HEAD` 判定）。
- PR/archive order: Archive automatically triggered on PR request
- 無（單一 repo），本 repo 自行開 PR。

## References

- `.kn-project/wiki/components/BaseDialogV2.md`、`BaseBottomSheetV2.md`
- `.kn-project/wiki/features/color-scheme.md` — 全域 vs 區域 Provider 的行為差異
- `.kn-project/archive/2608120958-color-mode-switch-jank.md` — 記載 `useCustomColorScheme(undefined, …)` 為無效呼叫（`dialog.vue:136` 即此寫法）

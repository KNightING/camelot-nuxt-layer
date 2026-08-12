# 2608121105 - overlay-demos-into-index

- Created: 2026-08-12 11:05 / Archived: 2026-08-12 14:16
- Issue: KNightING/camelot-nuxt-layer#19

## Summary

把 `/dialog` 分頁的 Overlay 範例併入主畫面並刪除該頁，過程中修掉三個顯示問題與兩個元件層缺陷，另新增 `ConfirmDialog` 元件。

範例改用元件預設值後，暴露出 `PopupV2` 把浮層 teleport 進 `<dialog>` 所衍生的兩個預設行為缺陷：浮層落在 `.dialog-content-box` 之外導致「點選單選項」被誤判為「點遮罩」而關閉對話框（此前只能靠 `:close-by-mask="false"` 迴避），以及浮層 `z-index: 10` 低於 BottomSheet 的 `60` 而被面板蓋住。兩者皆修在元件預設行為上。影響模組為 `app/components/Camelot/` 的 overlay 群、`app/assets/css/tailwind.css` 的疊層刻度，以及 `.playground` 的展示頁。

## Cross-Repo Scope

無（單一 repo）。分支 `fix/2608121105-overlay-demos-into-index`。

## Key Decisions

- **[Q1]** 刪除 `/dialog` 分頁 — 真正的「移動」，來源不留重複頁面。
- **[Q2]** `BaseBottomSheetV2` 四種版面 `w-screen` → `w-full` — `100vw` 含捲軸寬，實測即使內容正常仍有 2px 溢出。
- **[Q3]** 不對 `BaseDialogV2` 的 content box 加 overflow 兜底 — `overflow-hidden` 會裁掉內容、`overflow-auto` 會產生非預期捲軸，兩者都可能破壞既有消費端版面。
- **[Q4]** `index.vue` 的行數拆分（2524 行，遠超 pages 300 行上限）本次不處理 — 既有技術債，與需求正交。**仍待處理。**
- **[Q5]** ConfirmDialog 按鈕順序固定為 反向 → 中立 → 正向 並靠右，四風格一致 — 行為可預期，外觀差異已由 `CamelotButton` 承擔。
- **[Q6]** `autoClose` 預設 `true`，三顆按鈕皆 emit 並關閉；設 `false` 由使用端接管 — 行為明確，不靠「有沒有監聽者」猜測。
- **[使用者裁示]** Base 元件**維持沒有內建關閉鈕**，不新增 `closable` prop — Base 的定位是提供主題化外框與行為，關閉 UI 交由使用端；常見需求改由 `ConfirmDialog` 承載。
- **[使用者裁示]** `BaseDialogV2` 的 `closeByMask: false` 連帶停用 Esc **為刻意設計**，維持不動 — 用於強制決策的 modal。記錄於此以免日後被誤判為 bug 再次「修正」。
- **[使用者裁示]** 元件缺陷納入本計畫一併修，且修正一律做在**預設行為**上，不接受「要使用端傳 prop 迴避」的解法；`zIndex` prop 保留覆寫能力。
- **[執行中]** z-index 收斂為 `tailwind.css` 的具名刻度，而非把 `10` 隨手改大 — 原本 10 / 50 / 60 / 1000 / 1100 散落各元件硬編碼，直接改數字只會製造下一次對撞。
- **[執行中]** 疊層刻度置於一般 `:root` 而非 `@theme` — 實測 Tailwind v4 的 `@theme` 會 **tree-shake 掉未被引用的變數**（`--cml-z-drawer` 直接不存在），放在那裡當「預留刻度」會製造隱性斷點。

## Deviations

- **範圍兩度擴大**：原計畫只含範例搬移與三個顯示問題。執行中使用者追加 `ConfirmDialog` 元件（Phase E），其後回報 Dialog / Sheet 內 Select 不可用，追查出兩個元件層缺陷並經核准納入（Phase F）。
- **回報症狀與實際成因不同**：使用者回報「Dialog 缺少關閉按鈕」，實測關閉鈕**存在**（`x: 1442`，超出右緣 162px）；「厚重邊框」實為雙層盒（元件已提供 `padding: 24px` 的外框，範例又包一層不透明盒）。
- **Q1-C 的 loading 搬移未執行**：`index.vue:2240` 既有的 `triggerLoading` /「Run Loader」與被刪除頁面的 `openLoading` 功能完全相同，未再新增重複按鈕，展示未遺失。已向使用者說明且未收到異議。
- **計畫外的小調整**：共通欄位抽成 `OverlaySharedFields.vue`（同段內容需出現兩次）；`CamelotConfirmAction` / `CamelotDialogQuery` 型別集中至 `shared/types/camelot.ts`，並讓 `BaseDialogV2` 的 `query` 改用具名型別取代就地匿名物件。
- **Sheet 內浮層的視覺疊層未能自動驗證**：結構已驗證（popup `z-index: 70` > sheet `60`，同一 `<dialog>` 堆疊脈絡），但 Browser 面板恆為隱藏、rAF 凍結導致 Vue `<Transition>` 的 `v-enter-from` 永不移除，Sheet 停在進場起點，Y 座標與 hit-test 不可採信。由使用者在正常視窗確認通過。

## Impact Files

- `app/components/Camelot/PopupV2.vue:12-15` — teleport 容器加 `data-camelot-popup` 標記；預設層級改 `var(--cml-z-popup)`，判空由 `||` 改 `??`。
- `app/components/Camelot/BaseDialogV2.vue:81-90` (`onDialogClick`) — 遮罩判定前排除 `closest('[data-camelot-popup]')`；`query` 改用 `CamelotDialogQuery`。
- `app/components/Camelot/BaseBottomSheetV2.vue:14,25,34,43,87` — 四種版面 `w-screen` → `w-full`；`z-index: 60` → `var(--cml-z-sheet)`。
- `app/assets/css/tailwind.css` (`:root` 疊層刻度) — 新增 `--cml-z-drawer: 50` / `--cml-z-sheet: 60` / `--cml-z-popup: 70`。
- `app/components/Camelot/ConfirmDialog.vue` (new) — 組合 `BaseDialogV2` + `CamelotButton`，最多三顆按鈕、`autoClose`、三個 slot。
- `shared/types/camelot.ts` — 新增 `CamelotConfirmAction`、`CamelotDialogQuery`。
- `.playground/app/components/OverlaySharedFields.vue` (new) — Dialog 與 Sheet 共用的欄位組。
- `.playground/app/pages/index.vue` — Overlays 卡片擴充 scoped 範例與 ConfirmDialog 展示；Routing 卡片的「go to /dialog」改為以 query 開啟 scoped dialog。
- `.playground/app/pages/dialog.vue` — 已刪除。

## Details

驗證數據（viewport 1280×800）：

| 項目 | 前 | 後 |
| :--- | :--- | :--- |
| Dialog 關閉鈕 | `x 1442`（超出右緣 162px） | `right 875` ≤ 1280 |
| Sheet x 溢出 | `1312` vs `1278`（34px） | `1278 === 1278` |
| Dialog 內點 Select 選項 | 對話框關閉、未選中 | 不關閉且正確選中 |
| 點遮罩 / 點內容（回歸） | — | 仍分別為關閉 / 不關閉 |
| 部分覆蓋 | — | scoped `primary` `#FFEA00`（全域 `#d0bcff`）、自訂鍵 `test` 僅存 scoped；`surface`/`on-surface`/`outline` 與全域完全相同 |

未竟事項：

- Q4 的 `index.vue` 拆分（2524 行）。
- scifi 主題下 `.dialog-content-box` 有固定 20px x 溢出，來自 `CamelotScifiFrame` 的邊框裝飾結構；**既有 demo dialog 量到相同的 20px**，非本次造成，內容區本身無溢出、無內容被裁切。

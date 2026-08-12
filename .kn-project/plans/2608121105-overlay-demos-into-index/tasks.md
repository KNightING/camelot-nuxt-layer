# Tasks: 2608121105 - overlay-demos-into-index

## Phase A — script 狀態
- [x] A1. 新增 scoped 色彩方案（只覆寫 `primary` + 自訂鍵 `test` 的 light/dark），其餘繼承全域
- [x] A2. 新增 Dialog/Sheet 共通值 ref（`overlaySharedCount` + `overlaySharedOption`）
- [x] A3. 新增 scoped dialog / sheet 的 open state

## Phase B — 範本
- [x] B1. Overlays 卡片新增「Open Scoped Dialog / Sheet」觸發按鈕
- [x] B2. 新增 scoped Dialog：包 `CamelotCustomColorSchemeProvider`、帶 `:query`、內含共通值控制項
- [x] B3. 新增 scoped Sheet：帶 `tag`、內含同一組共通值控制項
- [x] B4. 內容區不自帶盒子、不使用 `w-screen` / `w-[90vw]`
- [x] B5.（計畫外）共通欄位抽成 `.playground/app/components/OverlaySharedFields.vue`，避免同段內容在兩處重複

## Phase C — 缺陷修正
- [x] C1. `BaseBottomSheetV2` 四種版面 `w-screen` → `w-full`
- [x] C2. 刪除 `.playground/app/pages/dialog.vue`；Routing 卡片的「go to /dialog」改為「開啟 scoped dialog（帶 query）」
- [~] C3. loading 範例搬移（Q1-C）：`index.vue:2240` 既有的 `triggerLoading` /「Run Loader」與被刪除頁面的 `openLoading` 功能完全相同，**未再新增重複按鈕**，展示未遺失。待使用者確認是否需要另一種形態

## Phase E — ConfirmDialog
- [x] E1. 新增 `app/components/Camelot/ConfirmDialog.vue`，組合 `BaseDialogV2` + `CamelotButton`
- [x] E2. 三顆按鈕依 label 是否設定決定顯示，預設只有 positive
- [x] E3. `autoClose`（預設 true）與 emits（positive / neutral / negative / cancel）
- [x] E4. `title` / `default` / `actions`（帶 `close` slot prop）三個 slot
- [x] E5. `index.vue` Overlays 卡片加入 ConfirmDialog 展示（三鈕 + 僅確認鈕）
- [x] E6. 四種主題風格下按鈕列外觀正常
- [x] E7.（計畫外）`CamelotConfirmAction` / `CamelotDialogQuery` 型別集中至 `shared/types/camelot.ts`，並讓 `BaseDialogV2` 的 `query` 改用具名型別
- [ ] E8. 新增 `wiki/components/ConfirmDialog.md`（Phase 5 由 wikification 處理）

## Phase F — Popup 在 Dialog / Sheet 內的兩個元件缺陷
- [x] F1. `PopupV2` teleport 容器加 `data-camelot-popup` 標記
- [x] F2. `BaseDialogV2.onDialogClick` 在遮罩判定前排除 `closest('[data-camelot-popup]')`
- [x] F3. `tailwind.css` 建立 `--cml-z-drawer/sheet/popup` 具名刻度（置於一般 `:root`，因 `@theme` 會 tree-shake 未被引用的變數）
- [x] F4. `PopupV2` 預設層級改為 `var(--cml-z-popup)`；`zIndex` prop 保留覆寫（`||` → `??`，避免 `0` 被當成未設定）
- [x] F5. `BaseBottomSheetV2` 的 `z-index: 60` 改引用 `var(--cml-z-sheet)`
- [x] F6. 驗證：Dialog 內點 Select 選項 → 對話框**不關閉**且選項**確實選中**（`Shared: 3 ・ 中式餐廳`）
- [x] F7. 回歸驗證：點遮罩仍會關閉（`maskClickClosesDialog: true`）、點內容不會關閉（`contentClickKeepsOpen: true`）
- [~] F8. Sheet 內浮層疊在 Sheet 之上：**結構已驗證**（popup `z-index: 70` > sheet wrapper `z-index: 60`，同一 `<dialog>` 堆疊脈絡，標記存在）。**視覺確認無法在此環境完成** —— Browser 面板恆為隱藏，rAF 凍結導致 Vue `<Transition>` 的 `v-enter-from` 永不移除，Sheet 停在 `translateY(100vh)` 的進場起點（實測 `transitionSettled: false`、`sheetY: 1287`）。寬度與 z-index 不受此影響故仍有效；Y 座標與 hit-test 在此環境不可採信

## Phase D — 驗證（viewport 1280×800）
- [x] D1. `eslint` 對本次新增/變更檔案零錯誤（index.vue 既存的 10 個錯誤為分支基底既有，位於無關的 demo 資料）
- [x] D2. Scoped Dialog 關閉鈕在 viewport 內：`right 875` ≤ `1280`（修正前為 `x 1442`）
- [x] D3. 無 x 軸溢出：Dialog `558 === 558`；Sheet `1278 === 1278`（修正前 `1312` vs `1278`）
- [x] D4. 部分覆蓋生效：scoped `primary` `#FFEA00`（全域 `#d0bcff`）、自訂鍵 `test` 僅存在 scoped；`surface` / `on-surface` / `outline` 三者與全域**完全相同**（確為繼承）
- [x] D5. 深淺色切換時覆寫值與繼承值皆正確翻轉（dark 下量測如 D4）
- [x] D6. URL 可控：開啟後為 `?overlay=scoped-dialog&isDialog=true` / `?tag=scoped-sheet&isDialog=true`，關閉後 query 被移除
- [x] D7. 共通值：Sheet 內 3 → 5，卡片顯示 5，再開 Dialog 亦為 5
- [x] D8. 四種主題風格下 ConfirmDialog 按鈕順序皆為 取消 → 稍後再說 → 刪除、靠右、皆在 viewport 內
- [x] D9. Console 零錯誤

## 已知既有問題（非本次造成，未處理）
- scifi 主題下 `.dialog-content-box` 有固定 20px 的 x 溢出，來自 `CamelotScifiFrame` 的邊框裝飾結構。**既有的 demo dialog 量到完全相同的 20px**，且內容區本身 `scrollWidth === clientWidth`、`inViewport: true` 無內容被裁切。依 Q3 決議不動 `BaseDialogV2`，記錄備查。

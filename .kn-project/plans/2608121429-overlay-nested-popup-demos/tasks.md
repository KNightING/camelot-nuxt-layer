# Tasks: 2608121429 - overlay-nested-popup-demos

## Phase A — 範例
- [x] A1. `OverlaySharedFields.vue` 新增 `CamelotDateV2`（`show-type="popup"`）
- [x] A2. 新增 `CamelotDateV2`（`show-type="dialog"`，驗證巢狀 dialog 路徑 R1）
- [x] A3. 新增原生 `CamelotPopupV2` 範例
- [x] A4. 新增 `CamelotCascadeMenu` 與 `CamelotTimeV2` 範例（驗證 R2 / R3）
- [x] A5. 內容維持「只放內容」原則，範例全部使用元件預設值、不傳迴避用的 prop

## Phase B — 驗證（Dialog 內實測，viewport 1280×800）
- [x] B1. `SelectV2`：teleport 進 dialog、`z: 70`、選取後不關閉 → **正常**
- [x] B2. `DateV2`(popup)：日曆 `inDialog: true`、`z: 70`、點日期不關閉 → **正常**
- [x] B3. 原生 `PopupV2`：`inDialog: true`、`z: 70` → **正常**
- [x] B4. `TimeV2` 外層 popup：`inDialog: true`、`z: 70` → **正常**
- [x] B5. `TimeV2` 內層時分秒清單：`parentIsBody: true`、`z: 1000`，hit-test 命中對話框內容 → **❌ 不可見/不可點**
- [x] B6. `CascadeMenu`：`parentIsBody: true`、`z: 50`，hit-test 命中對話框內的 `<p>` → **❌ 不可見/不可點**
- [x] B7. `DateV2`(dialog)：巢狀 dialog 本身可見可點，但選取後 `outerStillOpen: false` → **❌ 會關掉外層**
- [x] B8. Console 零執行期錯誤；Sheet 內範例渲染正常且無 x 軸溢出

## Phase C2 — 使用者實測回報的 Sheet 缺陷（追加）
- [x] C2-1. 重現並定位：Sheet 內開啟巢狀 Date Dialog 後，點空白處會連 Sheet 一起關閉
- [x] C2-2. 根因：`onDialogClick` 的 `querySelector('.dialog-content-box')` 會一併撈到**巢狀 dialog** 的內容框。BottomSheet 以自訂 `#wrapper` 渲染、本身沒有內容框，平時 `contentBox` 為 `null` 走 `target === dialog` 判斷；一旦內層對話框開啟，就誤把對方的內容框當成自己的，於是點面板任何非日曆處都被判為「點在內容之外」。Dialog 之所以倖免，只因它自己的內容框在文件順序上排在巢狀之前，`querySelector` 剛好先撈到自己的
- [x] C2-3. 修正一：點在巢狀 `<dialog>` 內時直接 return，由該內層自行處理遮罩
- [x] C2-4. 修正二：內容框改以 `closest('dialog') === dialogRef.value` 篩選，只認屬於本對話框的那一個
- [x] C2-5. 驗證（Sheet）：點空白 → 內層關閉、Sheet 保持開啟；點面板不關；Select 可用（`中式餐廳`）；巢狀選日期後 Sheet 保持開啟；遮罩點擊仍關閉
- [x] C2-6. 驗證（Dialog 回歸）：點內容不關、Select 可用（`港式餐廳`）、巢狀點空白後外層保持開啟、遮罩點擊仍關閉

## Phase C — 處置
- [x] C1. 修正 R1：`BaseDialogV2.onDialogClick` 加上「target 已脫離文件即不視為點遮罩」
- [x] C2. 驗證 R1 修正：開啟巢狀 → 2 個 dialog；選日期後 → 內層關閉、**外層保持開啟**
- [x] C3. 回歸：點內容不關（true）、Select 仍可選（`日式餐廳`）、日期 popup 不關（true）、點遮罩仍關閉（true）
- [x] C4. **不執行** Q2 原訂的 CascadeMenu z-index 改動 —— 驗證推翻其前提（問題是 body teleport 落在 top layer 之下，非層級太低），改動會是假修正
- [x] C5. `eslint` 對變更檔案零錯誤
- [ ] C6. Wiki 記錄浮層檢查點與兩個已知失效元件（Phase 5 由 wikification 處理）

## Phase R2 — CascadeMenu 修復（使用者追加，於本計畫完成）
- [x] R2-1. 判定：真正的缺陷在 **teleport 目標**而非定位。`CascadeMenuPanel` 的 root/submenu 錨定、翻轉與多層遞迴屬專門邏輯，整個換成 `PopupV2` 是大改寫且無對應語意；改為**抽出兩者共用的判定**，落實「popup 概念共用同一基底」的原則
- [x] R2-2. 新增 `app/composables/useCamelotTeleportTarget.ts`：回傳最近的 `<dialog>` 祖先，否則 `body`
- [x] R2-3. `CascadeMenuPanel` 的 `Teleport to="body"` 改為 `:to="teleportTarget"`
- [x] R2-4. `CamelotCascadeMenuContext.baseZIndex` 改為可選；未指定時面板層級回落 `calc(var(--cml-z-popup) + level)`，移除 `CascadeMenu` 的 `zIndex: 50` 硬編預設
- [x] R2-5. 驗證（Dialog）：面板 `inDialog: true`、`z: 70`，hit-test 命中面板內的「外觀」→ **可見且可點**
- [x] R2-6. 驗證（子選單）：`z: 71`（`calc` 生效）、`inDialog: true`，多層層級正確
- [x] R2-7. 驗證（選取）：點葉節點後選單關閉、**對話框保持開啟**
- [x] R2-8. 驗證（Sheet）：面板 `inSheetDialog: true`、`z: 70` > sheet 的 `60`
- [x] R2-9. 回歸（非 overlay 情境）：頁面上的 CascadeMenu 仍 teleport 至 `body`、`z: 70`，運作正常
- [x] R2-10. `eslint` 零新增錯誤（`closeTimer` 的 `no-unassigned-vars` 為分支基底既有）；乾淨重載後 runtime 錯誤為 0

## Phase R3 — TimeField 修復（使用者追加，於本計畫完成）
- [x] R3-1. `Internal/TimeField.vue` 的 `Teleport to="body"` 改為 `:to="teleportTarget"`，共用 `useCamelotTeleportTarget`
- [x] R3-2. 清單層級由硬編的 `z-[1000]` 改為 `calc(var(--cml-z-popup) + 1)`，確定性地疊在其所屬 TimeV2 浮層（70）之上
- [x] R3-3. 驗證：清單 `inDialog: true`、`parentIsBody: false`、`z: 71`
- [x] R3-4. 驗證（行為）：24 個選項、選取 `07` 後輸入值由 `00` → `07`、對話框保持開啟
- [x] R3-5. 更新展示頁標註：兩個「已知失效」皆已修復，改為說明檢查點用途
- [x] R3-6. 全面回歸：點內容不關、Select 可選（`日式餐廳`）、CascadeMenu `z: 70` 在 dialog 內、巢狀 dialog 點空白後外層保持開啟、遮罩點擊仍關閉

## 環境限制（重要）
- **本環境無法驗證任何浮層的「位置」**：Browser 面板恆為隱藏 → rAF 凍結 → PopupV2 的 `updateOnRequestAnimationFrame` 不執行，浮層座標停在過時值（實測 TimeField root 落在 `y: 8977`）。已用 fixed 探針確認 dialog 內的 containing block 仍為視窗（`(0,0)`），故定位機制本身未被改動影響。
- 可驗證且已驗證：teleport 目標、z-index、DOM 從屬關係、點擊與選取行為。
- **位置與視覺疊層需使用者在正常視窗確認。**
- `PopupV2` 的 teleport 目標由 `body` 改為「最近的 scope root」（色彩方案 Provider → `<dialog>` → `body`），以修復 CSS 自訂屬性無法穿透 Teleport 的問題

## 備註
- 環境限制：Browser 面板恆為隱藏，rAF 凍結導致 Vue `<Transition>` 不結算，**Sheet 的 Y 座標與 hit-test 不可採信**；Dialog 不受影響（其 enter 動畫只改 opacity，無 translate），故上述 Dialog 內的量測皆有效。Sheet 的視覺表現需使用者在正常視窗確認。

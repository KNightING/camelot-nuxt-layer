# 2608121429 - overlay-nested-popup-demos

- Created: 2026-08-12 14:29 / Archived: 2026-08-12 15:40
- Issue: KNightING/camelot-nuxt-layer#21

## Summary

在 Dialog / Sheet 共用的範例中加入五種浮層作為常駐檢查點，實測揪出三個缺陷並全數修復。

原始目的是驗證 DatePicker 與 PopupV2 是否有與 SelectV2 相同的浮層問題。走 `PopupV2` 的（SelectV2、DateV2 popup 模式、TimeV2 外層、原生 PopupV2）全部正常；三個不走 PopupV2 的路徑則全部失效：`CascadeMenuPanel` 與 `TimeField` 以 `Teleport to="body"` 自行實作，落在 `<dialog>` top layer 之下而不可見不可點；`DateV2` 的 dialog 模式（巢狀 `<dialog>`）會誤關外層 overlay。影響模組為 `app/components/Camelot/` 的 overlay 群、新增 `app/composables/useCamelotTeleportTarget.ts`，以及 `.playground` 的展示頁。

## Cross-Repo Scope

無（單一 repo）。分支 `fix/2608121429-overlay-nested-popup-demos`。

## Key Decisions

- **[使用者提出／架構原則]** popup 概念的 UI 一律應以 `PopupV2` 為基底。落實方式**不是**把元件硬塞進 `PopupV2`——`CascadeMenuPanel` 的 root/submenu 錨定、翻轉與多層遞迴屬專門邏輯，無對應語意——而是**抽出真正共用的那一塊判定**（teleport 目標）成為 `useCamelotTeleportTarget`，三者共用。
- **[Q1]** DateV2 同時展示 `show-type="popup"` 與 `"dialog"` — `auto` 在桌機等同 popup，不明確指定就測不到巢狀 dialog 路徑。
- **[Q2 及其推翻]** 原核准「把 CascadeMenu 的 `zIndex: 50` 改為引用疊層刻度」**未依原樣執行**：驗證證實問題是 body teleport 落在 top layer 之下，單獨調高 z-index 完全無效，那會是看起來有修、實際沒修的假修正。改為**先修 teleport、再收斂層級**，順序不可顛倒。
- **[Q3]** 授權於本計畫內一併修正測出的問題，修正一律做在元件預設行為上。
- **[Q4 及其變更]** 原訂 `CascadeMenuPanel` / `TimeField` 的重構另開計畫；使用者其後指示於本計畫一併完成。
- **[執行中]** 層級一律回落疊層刻度而非硬編：`CamelotCascadeMenuContext.baseZIndex` 改為可選、面板用 `calc(var(--cml-z-popup) + level)`；TimeField 用 `calc(var(--cml-z-popup) + 1)`，確定性地疊在其所屬 TimeV2 浮層之上而不依賴 DOM 順序。
- **[執行中]** 範例一律使用元件預設值、不傳任何迴避用的 prop — 上一輪的缺陷正是因為範例寫了 `:close-by-mask="false"` 才長期沒被發現。

## Deviations

- **範圍兩度擴大**：原計畫僅「補範例驗證」，明確排除元件修改；使用者其後指示一併修 R2（CascadeMenu），再指示一併修 R3（TimeField）。
- **Q2 未依核准內容執行**（理由見 Key Decisions）。
- **`DateV2` 巢狀 dialog 的缺陷是三個而非一個**：除了「選取後誤關外層」，另發現「點巢狀 dialog 內的空白處會關掉外層」與「`querySelector` 撈到巢狀 dialog 的內容框」。後者只在 BottomSheet 顯現（它以自訂 wrapper 渲染、本身沒有內容框）；Dialog 倖免只因自身內容框在文件順序上排在巢狀之前，屬僥倖而非設計。
- **未處理**：`shared/types/cascadeMenu.ts` 中「因 Teleport 至 body 導致 CSS 變數繼承中斷」的 workaround 仍保留——teleport 進 dialog 後在 overlay 情境已不再中斷，但頁面情境仍會，待「teleport 目標改為最近 scope root」時一併收。

## Impact Files

- `app/composables/useCamelotTeleportTarget.ts` (new) — 共用的 teleport 目標判定：最近的 `<dialog>` 祖先，否則 `body`。
- `app/components/Camelot/BaseDialogV2.vue:81-110` (`onDialogClick`) — 三道防護：target 已脫離文件、點在巢狀 `<dialog>` 內、內容框改以 `closest('dialog')` 篩選只認自己的。
- `app/components/Camelot/Internal/CascadeMenuPanel.vue:2,84,183` — Teleport 目標改共用判定；層級改 `calc(var(--cml-z-popup) + level)`。
- `app/components/Camelot/CascadeMenu.vue:43` — 移除 `zIndex: 50` 硬編預設。
- `app/components/Camelot/Internal/TimeField.vue:19-24,53` — 同上，層級改 `calc(var(--cml-z-popup) + 1)`。
- `shared/types/cascadeMenu.ts:23` — `baseZIndex` 改為可選。
- `.playground/app/components/OverlaySharedFields.vue` — 新增五個浮層檢查點（DateV2 popup / dialog、TimeV2、原生 PopupV2、CascadeMenu）。

## Details

驗證數據（Dialog 內，viewport 1280×800）：

| 浮層 | 修正前 | 修正後 |
| :--- | :--- | :--- |
| CascadeMenu 面板 | `parentIsBody: true`、`z: 50`，hit-test 命中對話框內的 `<p>` | `inDialog: true`、`z: 70`，hit-test 命中面板內「外觀」 |
| CascadeMenu 子選單 | 同上 | `inDialog: true`、`z: 71` |
| TimeField 清單 | `parentIsBody: true`、`z: 1000`，hit-test 命中對話框內容 | `inDialog: true`、`z: 71`；選取 `07` 後輸入值 `00 → 07` |
| 巢狀 dialog 選取／點空白 | `outerStillOpen: false` | `outerStillOpen: true` |

**環境限制**：Browser 面板恆為隱藏 → rAF 凍結 → PopupV2 的 `updateOnRequestAnimationFrame` 不執行，**任何浮層的「位置」在此環境皆不可採信**（實測 TimeField root 落在 `y: 8977`）。已用 fixed 探針確認 dialog 內的 containing block 仍為視窗 `(0,0)`，定位機制未受改動影響。可驗證者為 teleport 目標、z-index、DOM 從屬與點擊行為；位置與視覺疊層由使用者在正常視窗確認。

未竟事項：`PopupV2` 的 teleport 目標由 `body` 改為「最近的 scope root」（色彩方案 Provider → `<dialog>` → `body`），以解決 CSS 自訂屬性無法穿透 Teleport 的問題。

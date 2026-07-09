<!-- REMINDER: Relative Paths Only! No file:///c:/... -->
# Plan: 2606081628 - 進度條 ProgressBar + 進度圓 ProgressCircle（四風格 + 動畫）

- Created: 2026-06-08 16:28
- Branch: feature/2606081628-progress-bar-and-circle（自最新 main 切出；PR #1 已合併）
- Status: Completed
- Completed: 2026-06-08 18:43

## Goals
1. **水平進度條 `CamelotProgressBar`**：linear 進度條。
2. **進度圓 `CamelotProgressCircle`**：circular 進度（SVG）。
3. 兩者皆支援 **四種主題**（material / cupertino / scifi / aqua）、**動畫效果**，以及 determinate / **indeterminate（不確定）** 兩種模式。
4. 文字兩種模式：`percent`（`25%`）或 `fraction`（`value/max`，如 `1/4` 當前/總階段）。

## 交付總結（Delivered）
- ✅ **ProgressBar**：四風格、percent/fraction label、determinate `ease-spring` 過場、indeterminate `progress-sweep` 動畫、`height`/`rounded` props。
- ✅ **ProgressCircle**：SVG track+progress、四風格（aqua linearGradient stroke、scifi drop-shadow glow）、determinate 過場 + indeterminate spin、圓心 label、`overflow-visible` 防裁切。
- ✅ **ProgressStage（追加）**：左上破口階段儀表環，當前階段數字突破破口、總階段斜置右下成一體 `n/total`；數字固定 right:62px/top:4px、字級 51px（千位降 40px）、右對齊、最小 3ch；四風格 + dashoffset 動畫。首頁加目前/最大手動輸入框測試。
- ✅ **tailwind.css**：`progress-sweep` keyframe + `--animate-progress-sweep`。
- ✅ **playground**：Progress 展示卡（slider + 三 Bar + 三 Circle + 兩 Stage）。
- ✅ 預設主題 aqua（`useCamelotTheme` 既有設定）。

### 同分支附帶修正（popup 共通問題，commit `fix(popup)`）
- **浮層落影方形裁切**：`CamelotPopupV2` 面板位於 `CamelotExpanded` 的 `overflow:hidden` 內，面板自身落影被矩形裁切，且外層固定 `rounded-xl` 與面板圓角不符。解法：落影改畫在外層 popup-class wrapper（依主題對齊圓角），面板僅留 inset 高光。套用於 **SelectV2 / DateV2 / DateRangeV2**。
- **Select scrollbar**：Options 一般模式改原生捲動，三模式統一全站共通 scrollbar；aqua 面板 `p-1` 造成的捲動條右側空隙以 `margin-right:-4px + padding-right:4px` 修正為貼齊右緣。
- 詳見 wiki/記憶：`popup-shadow-clip-pattern`。

## 影響檔案
- 新增：`app/components/Camelot/ProgressBar.vue`、`ProgressCircle.vue`、`ProgressStage.vue`
- 修改：`app/assets/css/tailwind.css`、`.playground/app/pages/index.vue`
- 附帶：`app/components/Camelot/SelectV2.vue`、`DateV2.vue`、`DateRangeV2.vue`
- Wiki：`.kn-project/wiki/features/progress-components.md`

## 元件 API（最終）

### CamelotProgressBar
`value(0) / max(100) / color('primary') / indeterminate / showLabel / labelMode('percent'|'fraction') / height('8px') / rounded(true)`

### CamelotProgressCircle
`value / max / color / indeterminate / showLabel / labelMode / size(64) / strokeWidth(6)`

### CamelotProgressStage
`current(1) / total(1) / color('primary') / size(96) / strokeWidth(7)`

---

# Tasks for 2606081628

## Phase 0 — 分支 ✅
- [x] 自最新 main 建立分支；cherry-pick calendar 清理

## Phase 1 — ProgressBar ✅
- [x] percent 計算 + 四風格軌道/填滿、determinate 過場、indeterminate sweep、label 兩模式、lint/build

## Phase 2 — ProgressCircle ✅
- [x] SVG track+progress、四風格、determinate + indeterminate spin、size/strokeWidth/label、lint/build

## 追加（使用者回饋）✅
- [x] ProgressCircle 光暈裁切 → `overflow-visible`
- [x] 新增 ProgressStage（破口儀表環）+ 數字位置/字級多輪微調
- [x] 浮層落影方形裁切修正（Select/Date/DateRange）
- [x] Select scrollbar 統一共通樣式 + 靠右

## Phase 3 — Demo + 驗證 ✅
- [x] 首頁 Progress 展示卡；`pnpm lint` / `build`；dev server 視覺驗證

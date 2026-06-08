# Tasks for 2606081628

## Phase 0 — 分支 ✅
- [x] 自最新 main（PR #1 已合併至 65bf5f2）建立 `feature/2606081628-progress-bar-and-circle`
- [x] cherry-pick 13acf4a（calendar 清理未進 main，於本分支補回）

## Phase 1 — ProgressBar ✅
- [x] `ProgressBar.vue`：percent 計算 + 四風格軌道/填滿（aqua-track/aqua-fill、scifi glow、material/cupertino surface）
- [x] determinate 寬度過場（ease-spring）
- [x] indeterminate sweep 動畫（tailwind.css `progress-sweep` keyframe）
- [x] showLabel + labelMode（percent / fraction）、height / rounded props
- [x] lint / build

## Phase 2 — ProgressCircle ✅
- [x] `ProgressCircle.vue`：SVG track+progress、dasharray/dashoffset、useId 漸層 id
- [x] 四風格（aqua linearGradient stroke、scifi drop-shadow glow、round/butt linecap）
- [x] determinate 過場 + indeterminate 旋轉（animate-spin + 固定弧）
- [x] size / strokeWidth / showLabel（圓心 percent / fraction）
- [x] lint / build

## 設計修正 / 追加（使用者回饋）
- [x] ProgressCircle 光暈被裁切 → svg 加 `overflow-visible`（scifi drop-shadow 不再被切）
- [x] 新增 `ProgressStage.vue`：底部破口圓環，當前階段數字「置中突破」破口、總階段「斜下方」呈現（視為一體 `3/8`）；四風格 + dashoffset 動畫。實測：current cx=50（置中、跨越破口），total cx=70/cy 較低（斜下）。
- [x] 首頁加入 ProgressStage 展示

## Phase 3 — Demo + 驗證 ✅
- [x] 首頁 Progress 展示卡（slider + 3 bar + 3 circle，含 percent/fraction/indeterminate）
- [x] `pnpm lint` / `pnpm build`
- [x] dev server 視覺驗證（aqua：玻璃軌道+漸層、圓心 65% / 1 / 4、indeterminate 動畫）

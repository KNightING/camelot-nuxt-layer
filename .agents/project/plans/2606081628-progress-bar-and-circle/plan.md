<!-- REMINDER: Relative Paths Only! No file:///c:/... -->
# Plan: 2606081628 - 進度條 ProgressBar + 進度圓 ProgressCircle（四風格 + 動畫）

- Created: 2026-06-08
- Branch: feature/2606081628-progress-bar-and-circle（自最新 main 切出；PR #1 已合併）
- Status: Planning
- Completed: [Wait for Finish]

## Goals
1. **水平進度條 `CamelotProgressBar`**：linear 進度條。
2. **進度圓 `CamelotProgressCircle`**：circular 進度（SVG）。
3. 兩者皆支援 **四種主題**（material / cupertino / scifi / aqua）、**動畫效果**，以及 determinate / **indeterminate（不確定）** 兩種模式。

## 設計規範遵循（kn:project:code-style:nuxt）
- `<script setup>` + Composition API；`ref`（不用 reactive）；型別具名收於 `shared/types`（如需）。
- 樣式以 Tailwind v4 為主；主題差異延用既有 `useCamelotTheme().themeMode` 與 aqua utility / `--color-{role}` token；共用 keyframes 集中 `tailwind.css`。
- 採 inline 主題分支（與 Tabs/Steps 一致），不另開 router 子資料夾。

## 元件 API 草案

### CamelotProgressBar（`app/components/Camelot/ProgressBar.vue`）
```ts
props: {
  value?: number            // 預設 0
  max?: number              // 預設 100
  color?: CamelotColorRole  // 預設 'primary'
  indeterminate?: boolean   // 不確定模式（跑馬燈/sweep 動畫）
  showLabel?: boolean       // 顯示文字
  labelMode?: 'percent' | 'fraction'  // 'percent' → 25%；'fraction' → value/max（如 1/4，階段數）。預設 'percent'
  height?: string           // 軌道高度，預設 '8px'
  rounded?: boolean         // 預設 true
}
```
- 文字兩種模式：`percent` 顯示 `{percent}%`；`fraction` 顯示 `{value} / {max}`（如 `1 / 4`，當前階段/總階段）。`ProgressCircle` 同樣支援 `labelMode`（圓心顯示）。
- percent = clamp(value/max×100, 0..100)。
- 風格：
  - **material**：軌道 surface-container-highest、填滿 primary、圓角全；fill 寬度過場。
  - **cupertino**：較細、圓角。
  - **scifi**：軌道含主色細邊、填滿帶 glow + 掃描線、切角 clip-path。
  - **aqua**：`aqua-track` 玻璃軌道 + `aqua-fill` 漸層填滿 + 柔光。
- 動畫：fill `transition-[width] ease-spring`；indeterminate 用 `@keyframes`（移動 sweep），尊重 `prefers-reduced-motion`。

### CamelotProgressCircle（`app/components/Camelot/ProgressCircle.vue`）
```ts
props: {
  value?: number
  max?: number
  color?: CamelotColorRole
  indeterminate?: boolean
  showLabel?: boolean       // 圓心顯示百分比
  size?: number             // 直徑 px，預設 64
  strokeWidth?: number      // 預設 6
}
```
- SVG 雙圈：track + progress；`stroke-dasharray = 周長`、`stroke-dashoffset = 周長×(1-percent)`。
- 風格：material（圓頭 linecap、track outline-variant）、cupertino（較細）、scifi（glow filter + 主色）、aqua（漸層 stroke〔SVG linearGradient〕+ 柔光）。
- 動畫：`stroke-dashoffset` 過場；indeterminate 旋轉（固定弧 + spin keyframe）。
- 圓心 `showLabel` 顯示 `{percent}%`。

## 影響檔案（Impact Files）
- 新增：`app/components/Camelot/ProgressBar.vue`、`app/components/Camelot/ProgressCircle.vue`
- 修改：`app/assets/css/tailwind.css`（progress indeterminate / circle spin 共用 keyframes）
- Demo：`.playground/app/pages/index.vue`（展示卡：四風格 + determinate/indeterminate + 動畫）

## 執行階段（Phased，逐段回報）
- **Phase 1 — ProgressBar**：四風格 + determinate/indeterminate + 動畫 → lint/build → 回報
- **Phase 2 — ProgressCircle**：四風格 + determinate/indeterminate + 動畫 + 圓心 label → lint/build → 回報
- **Phase 3 — Demo + 驗證**：首頁展示卡；`pnpm lint` / `build`；（可選）dev 視覺檢查四風格

## Git Completion Policy
- 自最新 `main` 切出新分支；各 Phase 完成、commit 經核准後推送。
- 收尾後依規範可 `git rebase main` + `git push --force-with-lease`（重寫遠端工作分支歷史，lease 防覆蓋）。
- PR 請求時自動觸發歸檔 + wiki 化。

## References
- 主題系統：`.agents/project/wiki/features/theme-system.md`、`app/composables/useCamelotTheme.ts`、`app/assets/css/tailwind.css`（`aqua-fill`/`aqua-track`/`aqua-glow`、`ease-spring`）
- 既有 inline 主題分支參考：`app/components/Camelot/Steps.vue`、`Tabs.vue`、`Loading.vue`（spinner 動畫）

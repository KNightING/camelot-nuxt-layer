<!-- REMINDER: Relative Paths Only! No file:///c:/... -->
# Plan: 2606081005 - 補完 Aqua 風格 + 全面 Tailwind v4 重構

- Created: 2026-06-08
- Branch: feature/2606081005-aqua-complete-and-tailwind-refactor
- Status: Planning
- Completed: [Wait for Finish]

## Goals
1. **補完 Aqua 風格**：為「所有可主題化元件」補上 aqua 分支，使 aqua 與 material / cupertino / scifi 對等。
2. **全面純 Tailwind v4 重構**：將元件內的 `computed` 動態 style 與 `<style scoped>` 改寫為 Tailwind v4 寫法；共用動畫 / keyframes / 特殊樣式集中到 `app/assets/css/tailwind.css` 的 `@theme` / `@utility`，降低 arbitrary values。

## 範圍界定（依 Phase 0 調查）

### 可主題化元件（含 `themeMode` 分支，共 12 個）
- **Router 模式（有獨立風格子資料夾）**：`Button`、`Input`、`Switch`、`Checkbox`
  - 需新增 `app/components/Camelot/Aqua/{Button,Input,Switch,Checkbox}.vue` 並在 router 元件加入 `v-else-if="themeMode === 'aqua'"` 分支。
- **Inline 分支模式（風格寫在元件內 v-if）**：`Tabs`(aqua 已存在)、`BaseDialogV2`、`BaseBottomSheetV2`、`Steps`、`Skeleton`、`Toast`、`Loading`、`SelectV2`
  - 需在元件內新增 aqua 分支樣式。

### Tailwind 重構（全面純 Tailwind 策略，使用者選定）
- 第一優先：上述 12 個可主題化元件 + 4×N 個風格子元件。
- 第二優先：其餘含 `<style scoped>` 的非主題化工具元件（約 18 個：`PopupV2`、`Scrollbar`、`RippleEffect`、`RippleTabs`、`NumberCounter`、`ImageV2`、`RevealImage`、`RevealText`、`DropImage`、`IdxForm`、`Expanded`、`Gpu`、`Breakpoints`、`SlideTransitionGroup`、`Container`、`Material3Provider`、`ColorSchemeProvider`、`CustomColorSchemeProvider`）。

> ⚠️ **可行性與風險揭露**：keyframes、`::before/::after`、`color-mix()` 漸層、`:deep()` 等無法用單純 utility class 表達。純 Tailwind 策略下會以：①Tailwind v4 `before:`/`after:` variants、②集中於 `tailwind.css` 的 `@keyframes` + `animate-*` utility、③必要處 arbitrary values（`bg-[color-mix(...)]`）達成。`:deep()` 改為直接在子元件套 class。部分高度動畫化元件（如 Scifi `Frame`、`Scrollbar` 的 `::-webkit-scrollbar`）轉換後仍可能保留極少量 `<style>`；若完全不允許殘留，將於該檔以 `@apply` 或 `tailwind.css` utility 收斂。

## Architecture
- **Aqua 視覺語言**：延續既有 `Tabs.vue` 的 aqua pill 風格（pill 滑動指示器、Spring 動畫、`color-mix` 透明層、圓角藥丸、SLD 風）。色彩沿用既有 `--cml-color-current-color` / `--color-{role}` token，不另立色票。
- **Router 對齊**：Aqua 子元件 props/emits 介面與 Material/Cupertino/Scifi 完全一致（純元件，props in / emit out）。
- **共用樣式集中**：aqua 與各風格共用之 keyframes/animation 定義移入 `app/assets/css/tailwind.css`，以 `@utility` / `@theme --animate-*` 形式提供，元件端用 `animate-*` class 取用。

## 程式碼規範遵循（kn:project:code-style:nuxt）
- SFC 區塊順序：`<template>` → `<script setup lang="ts">` →（盡量無）`<style>`。
- 一律 `<script setup>` + Composition API；`ref` 不用 `reactive`；`defineModel` / `useTemplateRef`。
- Class 綁定用物件語法 `:class="{ ... }"`；複雜判斷抽到 `computed`（布林/狀態，不回傳大串 class 字串或 style）。
- 減少 arbitrary values，優先用主題 token utility。

## 影響檔案（Impact Files）
- 新增：`app/components/Camelot/Aqua/Button.vue`、`Input.vue`、`Switch.vue`、`Checkbox.vue`
- 修改（router 加 aqua 分支 + Tailwind 化）：`Button.vue`、`Input.vue`、`Switch.vue`、`Checkbox.vue`
- 修改（inline 加 aqua + Tailwind 化）：`Tabs.vue`、`BaseDialogV2.vue`、`BaseBottomSheetV2.vue`、`Steps.vue`、`Skeleton.vue`、`Toast.vue`、`Loading.vue`、`SelectV2.vue`
- 修改（既有風格 Tailwind 化）：`Material/*`、`Cupertino/*`、`Scifi/*`
- 修改（共用樣式 token / keyframes）：`app/assets/css/tailwind.css`
- 第二優先 Tailwind 化：上列 18 個工具元件

## 執行階段（Phased）
- **Phase A — Tailwind 基礎**：於 `tailwind.css` 補 aqua 所需共用 keyframes / animation / utility。
- **Phase B — 核心四元件**：新增 Aqua 子元件 + router 接線 + 四風格 Tailwind 化（Button → Switch → Checkbox → Input）。
- **Phase C — Inline 主題元件**：Tabs / Dialog / BottomSheet / Steps / Skeleton / Toast / Loading / SelectV2 加 aqua + Tailwind 化。
- **Phase D — 工具元件 Tailwind 化**：其餘 18 個非主題化元件（第二優先）。
- **Phase E — 驗證**：`pnpm typecheck` / `build`，並以 dev server 視覺檢查四風格切換。

> 每個 Phase 完成後回報，逐步推進；不一次做完所有 Phase。

## Git Completion Policy
- 任務完成前、在經核准的 Commit 後，將執行 `git rebase main` 並以 `git push --force-with-lease` 更新遠端工作分支（會重寫遠端分支歷史，lease 防止覆蓋未預期的新遠端提交）。
- PR/archive 順序：PR 請求時自動觸發歸檔 + wiki 化。

## References
- 既有 aqua 參考實作：`app/components/Camelot/Tabs.vue`（aqua-pill-indicator / aqua-tab）
- 主題管理：`app/composables/useCamelotTheme.ts`（`CamelotThemeMode = 'material' | 'cupertino' | 'scifi' | 'aqua'`）
- 色彩 token：`app/assets/css/tailwind.css`、`app/composables/useCustomColorScheme.ts`
- 歸檔參考：`.agents/project/archive/2606051746-implement-cyber-style.md`（被 aqua 取代之風格）

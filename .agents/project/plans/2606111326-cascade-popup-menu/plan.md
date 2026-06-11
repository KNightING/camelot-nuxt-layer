<!-- REMINDER: Relative Paths Only! No file:///c:/... -->
# Plan: 2606111326 - Cascade Popup Menu（多階層彈出選單）

- Created: 2026-06-11
- Branch: feature/2606111326-cascade-popup-menu
- Status: Planning
- Completed: [Wait for Finish]

## Goals

新增一個「點擊觸發 → 彈出選單 → 子選單向側邊持續展開（flyout cascade）」的多階層選單元件，與現有元件區隔如下：

- 現有 `Menu`：行內手風琴式（accordion）導覽樹，子層往下方縮排展開。
- 本計畫 `CascadeMenu`：浮層式（Teleport + fixed），點擊觸發器開啟根面板，含子項的列以 hover/點擊向**右側（空間不足自動翻轉至左側 / 上方）飛出子面板**，可無限階層持續展開。典型情境：按「設定」鈕 → 展開選單 → 子選單再展開。

需求重點：
1. 支援**無限階層**子選單持續展開。
2. 實作目前四種風格（`material` / `cupertino` / `scifi` / `aqua`），外觀隨 `useCamelotTheme().themeMode` 切換。
3. **善用 CurrentColor 系統**：以 `useCamelotRoleColorClass(color)` 在根節點注入 `--cml-color-current-color` / `--cml-color-current-on-color`，葉層以 `var(--cml-color-current-color)` 與 `aqua-*` utility 取用，色彩角色由 `color` prop 控制。

## Architecture

### 新增檔案
| 檔案 | 角色 |
| :--- | :--- |
| `shared/types/cascadeMenu.ts` | 型別：`CamelotCascadeMenuItem`（`label` / `value` / `icon?` / `disabled?` / `divider?` / `children?` / `data?`）、`CamelotCascadeMenuContext`（provide/inject 上下文）、`CAMELOT_CASCADE_MENU_KEY`。 |
| `app/components/Camelot/CascadeMenu.vue` | 根元件（router 級）：trigger slot + 開關狀態 + provide context + 注入 CurrentColor class。 |
| `app/components/Camelot/Internal/CascadeMenuPanel.vue` | 遞迴飛出面板：Teleport 到 body、fixed 定位於 anchor（觸發器或上層列）旁，渲染項目列；含子項的列再遞迴渲染下一層 `CascadeMenuPanel`。四風格外觀於此分支。 |

### 元件 API（`CascadeMenu.vue`）
| Prop / Model / Slot / Emit | 型別 | 預設 | 說明 |
| :--- | :--- | :--- | :--- |
| `items` | `CamelotCascadeMenuItem[]` | — | 巢狀選單資料 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色（注入 CurrentColor） |
| `submenuTrigger` | `'hover' \| 'click'` | `'hover'` | 子選單展開方式（根面板一律由觸發器點擊開啟） |
| `openDelay` / `closeDelay` | `number` | `80` / `160` | hover 模式展開/收合延遲 (ms)，避免滑過誤觸 |
| `zIndex` | `number` | `50` | 浮層層級 |
| `disabled` | `boolean` | `false` | 停用觸發器 |
| `closeOnSelect` | `boolean` | `true` | 點選葉節點後關閉整個選單 |
| `v-model:open` | `boolean` | `false` | 根面板開關（可手動控制） |
| `#default` slot | — | — | 觸發器內容（如「設定」按鈕） |
| `@select` | `[item]` | — | 點選葉節點（無 children）事件 |

### 定位策略（飛出 / flyout）
- 每層面板 `Teleport` 到 `document.body`，`position: fixed`，`z-index = zIndex + level`。
- 根面板：以觸發器 `useElementBounding` 計算，預設貼齊觸發器下緣左對齊；下方空間不足則翻上、右側不足則右對齊。
- 子面板：anchor = 觸發該子層的列 `<li>`，預設出現在該列**右側、頂端對齊**；右側空間不足翻至**左側**，下方不足則向上對齊（`useElementBounding` + `useWindowSize`）。
- 開合動畫：輕量 `<Transition>`（scale 95%→100% + fade，`ease-spring`）。

### Hover / 開合互動
- `submenuTrigger='hover'`：滑入含子項的列 → `openDelay` 後開啟該層；滑出列且未進入子面板 → `closeDelay` 後關閉，子面板與列視為同一 hover 區（沿用 `PopupV2` 既有手法，計時器避免閃爍）。
- `submenuTrigger='click'`：點含子項的列切換展開；點葉節點觸發 `select`。
- 根層：`onClickOutside`（ignore 各層面板）關閉；`Esc` 關閉；捲動時關閉（沿用既有慣例）。

### 四風格外觀（CurrentColor）
| 主題 | 面板 surface | 列 hover / active 高亮 |
| :--- | :--- | :--- |
| `aqua` | `aqua-glass` 玻璃面板（圓角 + blur + 髮絲邊 + 柔影） | `aqua-fill` + `text-[var(--cml-color-current-on-color)]` |
| `scifi` | 深色半透明 + `border-primary/30` + inset 微光、等寬字 | `bg-[color-mix(...current-color 18%)]` + 發光文字 `text-shadow` |
| `cupertino` | `backdrop-blur` 半透明 + 圓角 + 細邊 | `bg-[color-mix(...current-color 10%)]` + 半粗體主色字 |
| `material`（default） | 實色 `bg-surface` + 圓角 + 陰影 | `bg-[color-mix(...current-color 10%)]` + 主色字 |
- 含子項的列右側顯示 `chevron_right`；disabled 列 `opacity-40 pointer-events-none`；`divider` 列渲染分隔線。

## 程式規範遵循（kn:project:code-style:nuxt）
- `<script setup lang="ts">` + Composition API；僅用 `ref`，雙向綁定用 `defineModel`，模板 ref 用 `useTemplateRef`。
- Props 以具名型別定義（`shared/types/cascadeMenu.ts`），Emits 用 tuple 語法。
- 不手動 import 自動注入內容（Vue / VueUse / composables / icons）。
- Tailwind v4 utility 優先；面板 class 因需依 `themeMode` 分支，集中於 `<script setup>` computed 回傳（與既有 `MenuItem.vue` 一致做法）。
- 單一元件 `<template>` 控制在 ~100 行內，遞迴邏輯抽至 Internal 面板。

## Demo / 驗證
- 於 `.playground/app/pages/index.vue` 新增一張 Cascade Menu 展示卡：以「設定」按鈕為觸發器，三層以上選單（重用既有 `menuItems` 結構或新增含 icon/divider 範例），跟隨 `currentColorRole` 與四主題切換。
- 以 `preview_*` 啟動 dev server，切換四主題逐一驗證飛出、翻轉、hover 延遲與 CurrentColor 套色，截圖佐證。

## Impact Files
- 新增：`shared/types/cascadeMenu.ts`
- 新增：`app/components/Camelot/CascadeMenu.vue`
- 新增：`app/components/Camelot/Internal/CascadeMenuPanel.vue`
- 修改：`.playground/app/pages/index.vue`（新增展示卡）
- 文件（Phase 5 歸檔時）：`.agents/project/wiki/index.md`（功能矩陣加列）、`wiki/features/layout-data-components.md`（補一節）。

## Git Completion Policy
- After user-approved commits, completion will run `git rebase main` and update the remote work branch with `git push --force-with-lease`（會重寫遠端工作分支歷史，`--force-with-lease` 防止覆蓋未預期的新遠端提交）。
- PR/archive order: Archive automatically triggered on PR request.

## References
- 主題系統：`.agents/project/wiki/features/theme-system.md`
- 版面/資料元件（Menu 既有設計）：`.agents/project/wiki/features/layout-data-components.md`
- 定位/浮層既有實作：`app/components/Camelot/PopupV2.vue`
- CurrentColor：`app/composables/useCamelotRoleColorClass.ts`、`app/assets/css/tailwind.css`（`aqua-*` utility）
- 既有 Menu：`app/components/Camelot/Menu.vue`、`app/components/Camelot/Internal/MenuItem.vue`、`shared/types/menu.ts`

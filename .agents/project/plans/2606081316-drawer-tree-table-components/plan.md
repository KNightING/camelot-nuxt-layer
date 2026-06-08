<!-- REMINDER: Relative Paths Only! No file:///c:/... -->
# Plan: 2606081316 - 新增 Drawer / Tree / Table 元件（含四風格主題）

- Created: 2026-06-08
- Branch: feature/2606081005-aqua-complete-and-tailwind-refactor（沿用既有分支，使用者指定）
- Status: Planning
- Completed: [Wait for Finish]

## Goals
新增三個元件，皆支援 material / cupertino / scifi / aqua 四種主題：
1. **Drawer**：左/右皆可開；支援「浮動（floating / overlay）」與「固定（fixed / 常駐）」兩種模式。
2. **Tree**：多階層；可勾選（checkbox，含父子連動與半選 indeterminate）。
3. **Table**：fixed header、fixed columns（左/右）、pinned rows（置頂列）、雙色斑馬列、hover；可 slot 自訂 cell / head；data 支援各種 object 型別（泛型）。

## 設計規範遵循（kn:project:code-style:nuxt）
- `<script setup>` + Composition API；`ref`（不用 reactive）；`defineModel` / `useTemplateRef`；型別具名收於 `shared/types`。
- 樣式以 Tailwind v4 為主，主題差異延用既有 `themeMode` 與 `aqua-glass` / token 機制；共用樣式集中 `tailwind.css`。
- 元件 >100 行 template 須拆子元件（Tree 以遞迴子元件、Table 以列/儲存格子元件視情況拆分）。

## 元件 API 草案

### 1. CamelotDrawer（`app/components/Camelot/Drawer.vue`）
```ts
props: {
  open: boolean            // v-model
  position?: 'left' | 'right'         // 預設 'left'
  variant?: 'floating' | 'fixed'      // 預設 'floating'
  width?: string                      // 預設 '320px'
  closeByMask?: boolean               // floating 時點遮罩關閉，預設 true
  zIndex?: number
}
slots: { default, header?, footer? }
emits: { close }
```
- **floating**：Teleport 到 body，半透明遮罩（scrim）+ 從左/右滑入（spring）。aqua 用 `aqua-glass` 面板、scifi 用主色邊+光暈、material/cupertino 用 surface。
- **fixed**：行內常駐，佔據版面寬度；`open` 控制展開/收合（寬度 0 ↔ width，含過場）。不顯示遮罩。
- 動畫：`transform: translateX` 滑入 + `ease-spring`；`prefers-reduced-motion` 停用。

### 2. CamelotTree（`app/components/Camelot/Tree.vue` + `Internal/TreeNode.vue` 遞迴）
```ts
// shared/types/tree.ts
type CamelotTreeNode<T = unknown> = {
  label: string
  value: string | number
  children?: CamelotTreeNode<T>[]
  disabled?: boolean
  data?: T
}
props: {
  nodes: CamelotTreeNode[]
  checkable?: boolean                 // 顯示勾選框
  checked?: (string|number)[]         // v-model:checked
  expanded?: (string|number)[]        // v-model:expanded
  defaultExpandAll?: boolean
}
slots: { node?: (scope: { node, level, isChecked, isExpanded }) }
emits: { 'update:checked', 'update:expanded', nodeClick }
```
- 勾選框沿用 `CamelotCheckbox`（已四風格）；父節點顯示半選（indeterminate）狀態；勾父連動子、子全選回填父。
- 展開/收合用 `CamelotExpanded` 動畫；箭頭旋轉過場。
- 主題：縮排、連接線、hover 隨 themeMode（aqua 玻璃 hover、scifi HUD 等）。

### 3. CamelotTable（`app/components/Camelot/Table.vue`，泛型 `<T>`）
```ts
// shared/types/table.ts
type CamelotTableColumn<T = Record<string, unknown>> = {
  key: string
  title: string
  width?: string
  align?: 'left' | 'center' | 'right'
  fixed?: 'left' | 'right'
}
props: {
  columns: CamelotTableColumn<T>[]
  data: T[]
  rowKey?: string | ((row: T) => string | number)
  stripe?: boolean        // 雙色列
  hover?: boolean         // 預設 true
  maxHeight?: string      // 啟用 fixed header 捲動
  pinnedTopRows?: T[]     // 置頂固定列
}
slots: {
  [`head-${key}`]?: (scope: { column })
  [`cell-${key}`]?: (scope: { row, column, value, rowIndex })
  empty?: void
}
```
- **fixed header**：`thead` 用 `position: sticky; top:0`（搭配 `maxHeight` 容器捲動）。
- **fixed columns**：欄位 `fixed: 'left'|'right'` 用 `position: sticky; left/right`，並計算累積偏移；固定欄加陰影區隔。
- **pinned rows**：`pinnedTopRows` 以 sticky 置頂於 header 下方。
- **雙色 / hover**：斑馬以 `odd/even` token 底色；hover 以 token 高亮。
- **data 泛型**：`columns[].key` 取 `row[key]`；複雜型別用 `#cell-${key}` slot 自訂。
- 主題：表頭底色、分隔線、斑馬/hover 色、固定欄陰影隨 themeMode（aqua 玻璃表頭、scifi HUD 線框等）。

## 影響檔案（Impact Files）
- 新增：`app/components/Camelot/Drawer.vue`、`Tree.vue`、`Internal/TreeNode.vue`、`Table.vue`
- 新增型別：`shared/types/tree.ts`、`shared/types/table.ts`
- 可能新增共用樣式：`app/assets/css/tailwind.css`（drawer/table 共用 utility，如固定欄陰影）
- 視需要：`app/components/Camelot/Container.vue` / `Scrollbar.vue`（Table 捲動容器復用）

## 執行階段（Phased，逐段回報）
- **Phase 1 — Drawer**：floating + fixed，左右，四風格 + 動畫 → build/lint → 回報
- **Phase 2 — Tree**：遞迴 + 勾選連動 + 展開動畫，四風格 → build/lint → 回報
- **Phase 3 — Table**：fixed header/columns/pinned rows + 斑馬/hover + slots + 泛型，四風格 → build/lint → 回報
- **Phase 4 — 驗證**：`pnpm lint` / `pnpm build`；（可選）dev 視覺檢查四風格

## Git Completion Policy
- 各 Phase 完成後，提交前依規範（Rule 22）出示訊息+檔案清單，經核准才 commit。
- 任務收尾、commit 經核准後執行 `git rebase main` + `git push --force-with-lease`（重寫遠端工作分支歷史；lease 防覆蓋未預期之新提交）。
- PR 請求時自動觸發歸檔 + wiki 化。

## References
- 既有四風格機制：`app/composables/useCamelotTheme.ts`、`useCamelotPickerTheme.ts`、`useCamelotRoleColorClass.ts`、`app/assets/css/tailwind.css`（`aqua-glass` 等 utility）
- 可復用元件：`CamelotCheckbox`（Tree 勾選）、`CamelotExpanded`（Tree/Drawer-fixed 動畫）、`CamelotBaseDialogV2`（Drawer floating scrim 參考）、`CamelotScrollbar`/`CamelotContainer`（Table 捲動）

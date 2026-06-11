# Tasks for 2606111326 — Cascade Popup Menu

## Phase A — 型別與資料結構
- [x] 新增 `shared/types/cascadeMenu.ts`：`CamelotCascadeMenuItem`、`CamelotCascadeMenuContext`、`CAMELOT_CASCADE_MENU_KEY`

## Phase B — 元件實作
- [x] `app/components/Camelot/CascadeMenu.vue`：trigger slot、open 狀態、provide context、注入 CurrentColor class、onClickOutside / Esc / 捲動關閉
- [x] `app/components/Camelot/Internal/CascadeMenuPanel.vue`：Teleport + fixed 定位、翻轉邏輯、遞迴子面板、hover 延遲開合、四風格外觀、open 動畫

## Phase C — 四風格外觀（CurrentColor）
- [x] material / cupertino / scifi / aqua 面板 surface + 列 hover/active 套色
- [x] chevron、disabled、divider 樣式

## Phase D — Demo 與驗證
- [x] `.playground/app/pages/index.vue` 新增 Cascade Menu 展示卡（「設定」觸發器、4 層 + click 模式）
- [x] preview dev server 驗證：4 層飛出正確定位（root 在觸發器下、子面板向右 top-align、自動翻轉/夾邊）、z-index 逐層遞增、**每層 Teleport 面板皆正確注入 `--cml-color-current-color`**、四主題 surface/active 各異、disabled(opacity .4 / pointer-events none)、divider(1px)、closeOnSelect 關閉整棵、無 console error
- [x] eslint 通過（無錯誤）

## Phase E — 收尾
- [x] 自檢 code-style 合規（defineModel / useTemplateRef / tuple emits / 具名型別 / 無手動 import）
- [ ] （PR/歸檔時）更新 wiki 功能矩陣與 layout-data-components 節點 — 待 PR 時觸發

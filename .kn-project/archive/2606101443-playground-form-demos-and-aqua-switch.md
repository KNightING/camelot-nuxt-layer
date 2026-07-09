# Plan: 2606101443 - playground-form-demos-and-aqua-switch

- Created: 2026-06-10
- Completed: 2026-06-10 15:26
- Branch: main（使用者指示沿用目前分支，直接提交）
- Status: Archived
- Wiki: [field-label-and-form-controls](../wiki/features/field-label-and-form-controls.md)

## 成果

### 共通 Label 系統
- 新增公開元件 `app/components/Camelot/FieldLabel.vue`（`CamelotFieldLabel`）：props `label` / `required`，依 themeMode 自動樣式（scifi → `text-xs uppercase tracking-[0.1em]`，其餘 `text-sm font-medium text-on-surface`），required 星號 `text-error`。
- Input / Textarea / SelectV2 / Switch / Checkbox 統一模式：`<slot name="label" :label="label"><CamelotFieldLabel ... /></slot>` —— `#label` slot 可自定義且 slot props 帶 `label` 當前文字。
- Checkbox 的 label 從 4 個主題 variant 移除（variant 不再有 label prop），改由 wrapper 統一渲染與點擊切換（Switch 同模式：label 點擊 toggle、disabled 時 opacity-40 + cursor-not-allowed）。
- Input 的 scifi focus 發光樣式透過 class 傳入 FieldLabel 保留。

### Switch 全主題縮小（對齊 Checkbox 高度 20px）
- Aqua：51×31 → 40×22（thumb 18）；Material：52×32 → 40×22（thumb 未選 12 / 選中 16）；Cupertino：51×31 → 40×22（thumb 18）；Scifi：60×24 → 48×22（保留 ON/OFF 文字，checked thumb left 28）。
- Switch wrapper 新增 `label` prop。

### Checkbox 打勾放大
- Aqua / Material：8×4 → 10×6；Cupertino：6×10 → 8×12；Scifi 為方塊指示器不變。

### NumberCounter 四主題擴充
- 原寫死白底 + `--cml-c-m3-primary` → 四主題分支（aqua-track 膠囊 / cupertino 圓角面板 / scifi current-color 髮絲框直角 / 預設圓膠囊），focus 改 `--cml-color-current-color`。
- 新增 `color` / `disabled` / `label` / `required` props；label 走 `#label` slot + FieldLabel。
- 修復既有 bug：step watch 結尾無條件 `absStep.value = 1` 導致 `step` / `minStepByValue` 失效 → 改僅於無設定時 fallback（保留 usedMinStepByValue 的「曾經 step」語意）。

### Bug 修正（Iteration 3）
- **SelectV2 disabled**：`:disabled` 傳入 `CamelotPopupV2`（內部已擋 toggle）→ disabled 不再可展開；樣式移除 `bg-gray-100!`，改根節點 `cursor-not-allowed opacity-50`（與 Input 一致）；同時修正失效 class `text-primary-text` / `text-secondary-text` → `text-on-surface` / `text-on-surface-variant`，清除鈕 hover 改 `text-outline hover:text-[var(--cml-color-current-color)]`。
- **Tree 整行點擊**：`Internal/TreeNode.vue` checkable 時點整行（含空白）切換勾選，展開交由 chevron；非 checkable 維持點行展開。
- **TimeField 下拉裁切**：時/分/秒下拉原為 absolute 在 PopupV2 Expanded（overflow-hidden）內被裁切 → 改 `Teleport to="body"` + fixed 定位（依 trigger 上方空間自動向上/向下），`--cml-color-current-color` 以 inline style 帶入 teleport 內容，`onClickOutside` ignore 清單避免點選項誤關。

### Playground
- 「Form Inputs & Fields」拆為「Input & Textarea」與「Select」兩卡，各補 disabled 展示；Searchable Selection 整併入 Select 卡。
- Switch / NumberCounter 展示加 label 與 disabled；新增自定義 `#label` slot 範例（`★ {{ label }}`）。

## 使用者決策
- FieldLabel 為公開元件（不放 Internal）。
- 沿用 main 分支直接提交（無 feature branch）。
- Commit 拆三筆：feat(ui) 34bc9ef、fix(ui) f513d4a、docs(project) 888dabf。

## 影響檔
- 新增：`app/components/Camelot/FieldLabel.vue`
- 修改：`Switch.vue`、`Checkbox.vue`、`Input.vue`、`Textarea.vue`、`SelectV2.vue`、`NumberCounter.vue`、`Aqua|Material|Cupertino|Scifi/Switch.vue`、`Aqua|Material|Cupertino|Scifi/Checkbox.vue`、`Internal/TreeNode.vue`、`Internal/TimeField.vue`、`.playground/app/pages/index.vue`

## 驗證
- Preview（headless CDP）四主題實測：Switch 40×22 / 40×22 / 40×22 / 47×22、Checkbox 20×20、打勾 class 生效；counter 各主題容器樣式正確；custom `#label` slot 渲染 `★ Custom Label Slot`；label 點擊 toggle 正常無重複觸發。
- disabled select 點擊不展開、root opacity-50；一般 select 開啟正常（無回歸）；tree 葉節點點整行成功切換；time 下拉 teleport 至 body（24 選項、color var `#d0bcff` 正確、不再被裁切）。
- console 無新增錯誤。

## References
- 失效 class 起因：theme 無 `--color-primary-text` / `--color-secondary-text` / `--color-app-*` 定義（Tailwind v4 不產生未知 utility）。
- PopupV2 `disabled` prop 既有但 SelectV2 未傳；Expanded `overflow-hidden` 為展開動畫所需，故 TimeField 採 Teleport 而非移除裁切。

## Tasks
- [x] Aqua / Material / Cupertino / Scifi Switch 縮小
- [x] Switch / Checkbox wrapper label（FieldLabel + #label slot）
- [x] Input / Textarea / SelectV2 label slot 帶參數
- [x] Checkbox 打勾放大
- [x] NumberCounter 四主題 + props + absStep bug
- [x] SelectV2 disabled 修正、Tree 整行點擊、TimeField teleport
- [x] Playground 拆卡 / disabled / label / custom slot 展示
- [x] Preview 四主題驗證

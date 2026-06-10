<!-- REMINDER: Relative Paths Only! No file:///c:/... -->
# Plan: 2606101443 - playground-form-demos-and-aqua-switch
- Created: 2026-06-10
- Branch: main（使用者指示沿用目前分支）
- Status: In Progress
- Completed: [Wait for Finish]

## Goals
1. **Playground 展示重構**：將 `.playground/app/pages/index.vue` 中「Form Inputs & Fields」卡片拆為兩張卡片：
   - **Input / Textarea 卡片**：`CamelotInput`、`CamelotTextarea` 各含一般與 disabled 狀態展示。
   - **Select 卡片**：`CamelotSelectV2`（含現有 Searchable Selection 整併或並列），含一般與 disabled 狀態展示。
2. **Aqua Switch 重新設計**（`app/components/Camelot/Aqua/Switch.vue`）：
   - 縮小尺寸：由 31×51px 改為約 **22×40px**（thumb 18px），與 Aqua Checkbox 的 20px（h-5）高度相近。
   - 維持既有 aqua-fill / aqua-track token 與 spring 動畫。
3. **Switch label 支援**：
   - 在 `app/components/Camelot/Switch.vue`（wrapper）新增 `label?: string` prop，於 variant 旁渲染 `text-sm text-on-surface` 標籤（與 Checkbox 的 label 樣式一致），點擊 label 可切換（disabled 時不可）。
   - 四個主題 variant 不各自實作 label，由 wrapper 統一處理，避免重複。
4. Playground 的 Switch 展示加上 label 範例。

## Architecture / Design
- Aqua Switch 尺寸對照：Checkbox box 為 `h-5 w-5`（20px）；Switch 調整為 `h-[22px] w-10`、thumb `h-[18px] w-[18px]`、位移 `translate-x-[18px]`。
- Wrapper label 實作：外層 `div` 改為 `inline-flex items-center gap-2`，label 為 `<span>`，點擊事件在 wrapper 統一 toggle `modelValue` 並 emit `change`（需避免與 variant 內部 click 重複觸發 → label 的 click 才呼叫 toggle，variant 區塊不掛）。
- 程式碼風格遵循 `kn:project:code-style:nuxt` 技能規範（SFC 結構、withDefaults、defineModel）。

## Impact Files
- `app/components/Camelot/Aqua/Switch.vue`（尺寸）
- `app/components/Camelot/Switch.vue`（label prop）
- `.playground/app/pages/index.vue`（卡片拆分、disabled 展示、switch label）

## Iteration 2（2026-06-10）
1. **全主題 Switch 縮小**（對齊 Aqua 的 40×22）：
   - Material（`app/components/Camelot/Material/Switch.vue`）：52×32 → 40×22（`h-[22px] w-10`、border-2 保留；thumb 未選 `h-3 w-3 left-1`、選中 `h-4 w-4 left-[18px]`）。
   - Cupertino（`app/components/Camelot/Cupertino/Switch.vue`）：51×31 → 40×22（`rounded-[11px]`、thumb 27 → 18、`translate-x-[18px]`）。
   - Scifi（`app/components/Camelot/Scifi/Switch.vue`）：60×24 → 48×22（保留 ON/OFF 文字空間；thumb 14 不變、checked left 40 → 28）。
2. **Checkbox 打勾放大**：
   - Aqua / Material：勾 `h-2 w-1` → `h-2.5 w-1.5`（10×6）。
   - Cupertino：勾 `h-1.5 w-2.5` → `h-2 w-3`（8×12）。
3. **共通 Label 元件**：新增 `app/components/Camelot/FieldLabel.vue`（公開元件 `CamelotFieldLabel`，使用者要求不放 Internal）：
   - Props：`label?: string`、`required?: boolean`；依 themeMode 套用樣式（scifi → `text-xs uppercase tracking`，其餘 `text-sm font-medium text-on-surface`）。
   - 整合進 Input、Textarea、SelectV2、Switch、Checkbox（wrapper 層），統一模式：
     `<slot name="label" :label="label"><CamelotInternalFieldLabel ... /></slot>` → **`#label` slot 可自定義、slot props 帶 `label` 當前文字**。
   - Checkbox 的 label 從 4 個主題 variant 移除，改由 wrapper 統一渲染與點擊切換（與 Switch 同模式）；variant 保留 `label` prop 介面但 wrapper 不再傳入（或直接移除 variant prop——採直接移除，variant 為 internal 性質）。
   - Input 的 scifi focus 發光 label 樣式：Input 透過 `#label` 區域維持其 isFocused 樣式（傳 class 給 FieldLabel）。
4. **NumberCounter 四主題風格擴充**（`app/components/Camelot/NumberCounter.vue`）：
   - 加入 `themeMode` 分支樣式：default（border + rounded-lg）、cupertino（`bg-surface-container-highest` + `border-outline-variant`）、material（`bg-surface-container-highest` + 底線 focus）、aqua（`aqua-track` + `focus:aqua-glow`）、scifi（current-color 5% 底 + 30% 邊框、直角）。
   - 新增 `color`（CamelotColorRole）、`disabled`、`label`、`required` props；focus 邊框由硬編 `--cml-c-m3-primary` 改為 `--cml-color-current-color`；label 走 `#label` slot + CamelotFieldLabel 共通模式。
   - 修復既有 bug：step watch 結尾 `absStep.value = 1` 無條件覆寫，導致 step/minStepByValue 全部失效 → 改為僅在無 step 設定時 fallback。
   - Playground 補 NumberCounter 展示（一般 / disabled / label）。

## Iteration 3（2026-06-10）Bug 修正
1. **SelectV2 disabled**：`:disabled` 傳入 `CamelotPopupV2`（其內部已擋 toggle）；移除 `bg-gray-100!`，改根節點 `cursor-not-allowed opacity-50`（與 Input 一致），文字 `text-on-surface-variant`。
2. **Tree 整行點擊勾選**：`Internal/TreeNode.vue` 的 `onRowClick`——checkable 時點整行空白切換勾選（展開仍由 chevron 負責）；非 checkable 維持點行展開。
3. **TimeField 下拉裁切**：`Internal/TimeField.vue` 下拉改 `Teleport to="body"` + fixed 定位（依 trigger rect 決定向上/向下展開），並將 `--cml-color-current-color` 以 inline style 帶到 teleport 內容；`onClickOutside` 加 `ignore` 清單。

## Git Completion Policy
- After user-approved commits, completion will run `git rebase main` and update the remote work branch with `git push --force-with-lease`.
- PR/archive order: Archive automatically triggered on PR request

## References
- 既有 Aqua token：`app/assets/css/tailwind.css`（aqua-track / aqua-fill / aqua-thumb）
- Checkbox label 樣式參考：`app/components/Camelot/Aqua/Checkbox.vue`

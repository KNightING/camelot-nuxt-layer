<!-- REMINDER: Relative Paths Only! No file:///c:/... -->
# Plan: 2606101633 - radio-groups-and-timeline-fix
- Created: 2026-06-10
- Branch: feature/2606101633-radio-groups-and-timeline-fix
- Status: In Progress
- Completed: [Wait for Finish]

## Goals

### 1. 水平 Timeline 上方內容多餘空白修正
- 現況：水平 alternate 三軌 `1fr auto 1fr`，列高被最高項撐開後，`before`（軸上方）內容在 1fr 軌內**靠上**，與軸線之間留下大片空白；`after`（下方）內容靠上貼軸所以正常。
- 修正：`contentClass` 水平分支——`before` 加 `self-end`（貼軸線）、`after` 加 `self-start`，垂直模式不變。

### 2. Radio + RadioGroup（四主題）
- `app/components/Camelot/Radio.vue` wrapper：比照 Checkbox 模式——themeMode 分派至 4 個 variant、`label` 由 wrapper 統一（FieldLabel + `#label` slot、label 點擊切換、disabled 樣式）、`v-model: boolean`、`change` emit、color role。
- 4 個 variant（`Aqua|Material|Cupertino|Scifi/Radio.vue`）：
  - Material：20px 圓圈 border-2，選中外圈 current-color + 內圓點縮放動畫。
  - Cupertino：22px 圓圈，選中填滿 current-color + 白色內點（iOS 樣式）。
  - Aqua：20px `aqua-track` 圓圈，選中 `aqua-fill` + 白色內點（與 Aqua Checkbox 同語彙）。
  - Scifi：18px 圓框 + current-color 髮絲/glow，選中內部方形指示器縮放（與 Scifi Checkbox 同語彙）。
- `app/components/Camelot/RadioGroup.vue`：
  - Props：`options: CamelotGroupOption[]`、`direction: 'horizontal'|'vertical'`（預設 horizontal）、`color`、`disabled`（整組）、`label`/`required`（FieldLabel + `#label` slot）。
  - `v-model: string | number`；`change` emit；**逐選項 `option.disabled`**（與整組 disabled 取 OR）。

### 3. CheckboxGroup
- `app/components/Camelot/CheckboxGroup.vue`：同 RadioGroup 介面，`v-model: (string|number)[]`（勾選值陣列）、direction 水平/垂直、整組與**逐選項 disabled**、`change` emit。

### 4. 共用型別
- `shared/types/camelot.ts` 新增 `CamelotGroupOption`（`{ label: string, value: string|number, disabled?: boolean }`）。

### 5. Playground
- 新卡片：RadioGroup 水平 + 垂直（含部分選項 disabled）、CheckboxGroup 水平 + 垂直（含部分選項 disabled）、單獨 Radio 展示。

## Impact Files
- 新增：`Radio.vue`、`RadioGroup.vue`、`CheckboxGroup.vue`、`Aqua|Material|Cupertino|Scifi/Radio.vue`
- 修改：`Timeline.vue`、`shared/types/camelot.ts`、`.playground/app/pages/index.vue`

## Iteration 2（2026-06-10）Radio deselectable
- Radio / RadioGroup 新增 `deselectable?: boolean`（預設 false）：點擊已選取的選項可取消選取（非必填情境）；RadioGroup 取消時 `modelValue = undefined`。
- 4 個 variant 增加 `deselectable` prop（控制點擊已選中時是否切換）；wrapper label 點擊同邏輯。
- Playground 補 deselectable RadioGroup 展示。

## Git Completion Policy
- After user-approved commits, completion will run `git rebase main` and update the remote work branch with `git push --force-with-lease`.
- PR/archive order: Archive automatically triggered on PR request

## References
- Radio 視覺語彙比照各主題 Checkbox / Switch（`Aqua|Material|Cupertino|Scifi/Checkbox.vue`）。

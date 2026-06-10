# Plan: 2606101633 - radio-groups-and-timeline-fix

- Created: 2026-06-10
- Completed: 2026-06-10 16:56
- Branch: feature/2606101633-radio-groups-and-timeline-fix
- Status: Archived
- Wiki: [radio-and-groups](../wiki/features/radio-and-groups.md)

## 成果

### 水平 Timeline 內容貼軸（fix）
- 根因：alternate 三軌 `1fr auto 1fr`，高列撐開列高後軸上方內容在 1fr 軌內靠上 → 與軸線間大片空白。
- 修正：水平 `before` 內容 `self-end`、`after` `self-start`；驗證上方文字底部與軸線 gap=0。

### Radio 四主題 + RadioGroup / CheckboxGroup
- `Radio.vue` wrapper（與 Checkbox 同模式：themeMode 分派、FieldLabel + `#label` slot、label 點擊、光學置中 leading-none）+ 4 variant：
  - Material：20px border-2 外圈 + current-color 圓點縮放；Cupertino：22px 選中填滿 + 白點；Aqua：20px aqua-track/fill + 白點（10px）；Scifi：18px 髮絲圓框 + glow 圓點。
  - **圓點皆用「滿版 + transform scale 縮小」**：合成階段以中心對稱取樣，避免固定 px 圓點在非整數 DPR（Windows 125/150%）下半像素偏移；四主題實測 dx/dy=0。
- `RadioGroup.vue`：`v-model: string|number|undefined`、`options: CamelotGroupOption[]`、`direction: horizontal|vertical`、group `label`/`required`、整組 `disabled` OR 逐選項 `option.disabled`、`change` emit。
- `CheckboxGroup.vue`：同介面，`v-model: (string|number)[]`。
- **deselectable**（Radio/RadioGroup/4 variant）：點擊已選取項取消選取（非必填情境）；RadioGroup 取消時 model=undefined、change emit undefined；預設 false 維持標準 radio 行為。
- 共用型別 `CamelotGroupOption`（shared/types/camelot.ts）。

### Group 間距統一
- Scifi Checkbox 移除 label-in-variant 時代殘留的 `padding/min-height/gap/hover 整列底色` → 兩 Group 在四主題間距完全一致（橫 24 / 縱 8；scifi 項高 18==radio）。

## 影響檔
- 新增：`Radio.vue`、`RadioGroup.vue`、`CheckboxGroup.vue`、`Aqua|Material|Cupertino|Scifi/Radio.vue`
- 修改：`Timeline.vue`、`Scifi/Checkbox.vue`、`shared/types/camelot.ts`、`.playground/app/pages/index.vue`

## 驗證
- Preview（CDP）：timeline 貼軸 gap=0；radio 互斥、disabled 選項點擊無效、deselectable 取消/一般組不可取消；四主題 variant 渲染與圓點置中 dx/dy=0；兩 Group 四主題間距相同；eslint 通過。

## 使用者決策
- Scifi Radio 改圓形指示器；Aqua 白點加大至 10px；deselectable 命名與預設 false。
- Commit：a5bfb6a（feat radio/groups）、771be96（fix timeline）、caa03b5（deselectable + 間距）。

## Tasks
- [x] Timeline 水平 self-end/self-start
- [x] 4 主題 Radio variant + wrapper
- [x] RadioGroup / CheckboxGroup（direction、整組/逐選項 disabled）
- [x] deselectable 模式
- [x] Scifi Checkbox 殘留樣式清理（間距統一）
- [x] Playground 展示 + Preview 驗證

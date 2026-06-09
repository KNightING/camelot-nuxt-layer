# Plan: 2606092138 - CamelotTimeV2（純時間選擇器）

- Created: 2026-06-09
- Completed: 2026-06-09 22:49
- Branch: feature/2606092138-time-picker-component
- Status: Archived
- Wiki: [time-picker](../wiki/features/time-picker.md)

## 成果
新增 `app/components/Camelot/TimeV2.vue`（→ `CamelotTimeV2`），操作/外觀比照 DateV2：
- trigger（時鐘 icon + 唯讀 input）→ popup（桌機）/ dialog（手機，showType auto）內含 `CamelotInternalTimeRow` + 確認鈕。
- `v-model` 為 24 制字串 `"HH:mm[:ss]"`；trigger 依 hourFormat/timePrecision 顯示（12 制 hh:mm a）。
- 四主題（useCamelotPickerTheme）、color role；TimeRow @change 即時套用、確認＝關閉。
- Props：color/label/required/disabled/isError/placeholder/showType/selectZIndex/timePrecision(預設 minute)/hourFormat(預設 24)。
- 重用既有元件，無新依賴。Playground 展示卡（24 制 minute、12 制 second）。

## 使用者決策
- v-model 字串 `"HH:mm[:ss]"`；預設精細度 minute；hourFormat 預設 24；元件名 CamelotTimeV2。

## 影響檔
- 新增：`app/components/Camelot/TimeV2.vue`
- 修改：`.playground/app/pages/index.vue`（展示卡）

## 驗證
- `npx eslint` 通過。
- Preview：`"14:30:00"` → trigger 顯示 "02:30:00 PM"（12 制 second）；空值顯示 placeholder；CDP 開啟 popup → 改時分 → v-model 更新為 "09:45"（HH:mm）；aqua 玻璃面板 + aqua-pill 確認（截圖確認）。
- 受限：synthetic 點擊開 popup 不穩定（既有 harness 限制），改用實際 CDP click 驗證互動成功。

## References
- 參考：DateV2.vue / Internal/TimeRow.vue / useCamelotPickerTheme.ts

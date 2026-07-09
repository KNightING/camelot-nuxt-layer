# ⏰ CamelotTimeV2（純時間選擇器）

> 純時間選擇器，操作與外觀比照 DateV2；重用既有 `TimeRow` 內部元件。四主題。對應計畫 `2606092138`。

## 概要
- **觸發/版型**：trigger（時鐘 icon + 唯讀 input）→ `CamelotPopupV2`（桌機 popup）/ `CamelotBaseDialogV2`（手機 dialog，`showType` auto），內含 `CamelotInternalTimeRow`（可輸入欄位 + 12/24 制 + AM/PM + 精細度）+「確認」按鈕。
- **資料**：`v-model` 為**標準 24 制字串** `"HH:mm"` 或 `"HH:mm:ss"`（依精細度）；trigger 顯示依 `hourFormat`/`timePrecision` 格式化（12 制顯示 `hh:mm a`，例 `"14:30:00"` → `"02:30:00 PM"`）。TimeRow 改值即時套用，「確認」＝關閉浮層。
- **主題**：`useCamelotPickerTheme`（triggerClass/panelClass）+ popupShadow/panelShadowFix，四主題；`color` role；open 態 border / aqua-glow。

## Props
| Prop | 預設 | 說明 |
| :--- | :--- | :--- |
| `v-model` | — | 時間字串 `"HH:mm[:ss]"`（24 制） |
| `color` | `primary` | 色彩角色 |
| `label` / `required` | — | 標籤與必填星號 |
| `disabled` / `isError` | `false` | 停用 / 錯誤態 |
| `placeholder` | `HH:mm` | 無值顯示 |
| `showType` | `auto` | `auto`(手機 dialog) / `popup` / `dialog` |
| `selectZIndex` | — | 浮層 z-index |
| `timePrecision` | `minute` | `hour` / `minute` / `second` |
| `hourFormat` | `24` | `12` / `24` |

## 重用
- `CamelotInternalTimeRow` / `TimeField`（與 DateV2 時間區共用）、`CamelotPopupV2`、`CamelotBaseDialogV2`、`CamelotButton`、`useCamelotPickerTheme`、`useDeviceBreakpoints`。無新依賴。

## References
- 參考：`app/components/Camelot/DateV2.vue`、`Internal/TimeRow.vue`
- 計畫歸檔：`.kn-project/archive/2606092138-time-picker-component.md`

---

[🗓️ Calendar](./calendar.md) | [🎨 主題系統](./theme-system.md) | [🏠 Wiki](../index.md)

# Plan: 2606082359 - DatePicker 時間/確認・Aqua 邊框 Token・Toast 動畫

- Created: 2026-06-08 23:59
- Completed: 2026-06-09 11:16
- Branch: feature/2606082359-daterange-time-display-confirm
- Status: Archived
- Wiki: [datepicker-time-aqua-toast](../wiki/features/datepicker-time-aqua-toast.md)

## 背景
PR #3（UI 批次）合併進 `main` 後，另有兩個提交未進 main（picker 跨雙月曆、components.d.ts），與本計畫一併彙整成新 PR。

## 成果（依迭代）
1. **時間完整顯示**：DateRangeV2 trigger 起/迄 input 自適應寬度，修正含時間被裁切。
2. **range 確認按鈕**：時間模式「迄」列旁加「確認」，`open=false` 關閉浮層。
3. **小螢幕關閉 + 垂直 trigger**：DateV2 時間模式加確認鈕（手機 modal 可離開）；DateRangeV2 `isMobile && enableTime` 時 trigger 起/迄 垂直堆疊帶標籤。
4. **DateV2 確認鈕與 range 一致**：Calendar `hide-time`，單一時間列 + 確認鈕同一 border-t 區塊。
5. **Aqua 浮層邊框變輕**：`aqua-glass` 邊框 white 55%→色調髮絲、高光調淡。
6. **邊框走主題 token**：新增 `--color-border`（@theme 預設 outline-variant，aqua per-theme 覆寫 12% 色調）；aqua-glass/track 改吃 token。
7. **Toast 透明 + 滑入玻璃漸入 + center 不跳動**：背景 surface 72%→55%；入場 JS hooks 滑入後 backdrop blur 0→目標漸入（避開 transform 破壞 backdrop-filter 的閃現）；center 頂端錨點不重新置中。
   - 另：`on-*` 前景配對修正（SelectV2 scifi、picker aqua selectedSurface、Steps cupertino、BottomSheet `text-on-surface`）；月/年選擇器橫跨雙月曆置中；Toast 入場先以 opacity-only 修正後再延伸為滑入+漸入。

## 影響檔
- `app/components/Camelot/`：DateRangeV2.vue、DateV2.vue、Internal/Calendar.vue、Toast.vue、SelectV2.vue、Steps.vue、BaseBottomSheetV2.vue
- `app/composables/useCamelotPickerTheme.ts`
- `app/assets/css/tailwind.css`（`--color-border` token、aqua-glass、per-theme 覆寫）
- `.playground/app/components.d.ts`（CloseRounded 型別）

## 驗證
- `npx eslint` 全通過；Preview MCP 數值量測：時間完整顯示未裁切、確認鈕渲染、垂直 trigger（390px）、picker 橫跨雙月曆置中、邊框計算色 12% 色調、`--color-border` per-theme、on-* 解析為 on-error、Toast blur 0→20 漸入、center jump=0、bg alpha 0.55。
- 受限項：playground 多浮層持久渲染導致部分 picker 互動無法腳本化開啟，以程式碼等價性確認（close=`open=false`，同既有路徑）。

## References
- PR #3（已合併）：https://github.com/KNightING/camelot-nuxt-layer/pull/3

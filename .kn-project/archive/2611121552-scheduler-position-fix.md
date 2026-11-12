# 2611121552 - scheduler-position-fix

- Created: 2026-11-12 15:52 / Archived: 2026-11-12
- Issue: KNightING/camelot-nuxt-layer#84
- Milestone: 4.6.4.2 / Base Branch: 4.6.4.2

## Summary
修正 Scheduler 事件色塊位置被前面事件推開的錯誤，並補上「沒有人員」與「自訂編輯面板」的 playground 展示。
原因是 `SchedulerEventChip` 根元素自己帶 `relative`，與視圖傳入的 `absolute` 衝突，色塊回到文件流，同一欄第二筆以後的事件位置累加（貝斯錄音 11:00 畫在 13:00、晚班 17:00 畫在 21:00）；拿掉 `relative` 後週、日、排班日視圖逐筆量測差距皆為 0。

## Cross-Repo Scope
無（單一 repo）

## Key Decisions
- **[Milestone]** 沿用 `4.6.4.2`（使用者選定）— 錯誤在尚未發佈的程式碼裡，與行事曆同一版本線。
- **[做法]** 不加位置的單元測試 — 這是 CSS class 衝突，單元測試環境（happy-dom）不做版面計算；以實際量測色塊位置驗證。
- **[範圍]** 展示只新增，不改既有的排班展示 — 避免動到已驗證的互動。
- **[根因]** 先前的互動測試只比對拖移前後的變化，沒有比對絕對位置，所以沒抓到；這次改為對照時間刻度逐筆量測。

## Deviations
- 展示頁的自訂編輯面板改為「選班別」的按鈕，而不是有標題輸入框的表單，避免展示碼需要自己維護欄位狀態。
- 沒有新增自動化測試：位置錯誤是 CSS class 衝突，單元測試環境不做版面計算；以逐筆量測取代。

## Impact Files
- `app/components/Camelot/Internal/SchedulerEventChip.vue:3` — 根元素 class 的 `relative`
- `.playground/app/pages/index.vue:1967`（Scheduler 展示卡）、`:2995`（`schedulerEvents` 展示資料附近）— 新增沒有人員且自訂編輯面板的行事曆展示
- `.kn-project/wiki/features/components/Scheduler.md:41`（`editor` slot 說明）— 補「沒有 resources 時」與自訂面板的說明

## Wiki Changes

| 頁面 | 日期 | 版本 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| `features/components/Scheduler.md` | 2026-11-12 | 4.6.4.2 | 修正 Scheduler 事件色塊位置，補沒有人員與自訂編輯面板的說明 | [#84](https://github.com/KNightING/camelot-nuxt-layer/issues/84) | [PR #85](https://github.com/KNightING/camelot-nuxt-layer/pull/85) |

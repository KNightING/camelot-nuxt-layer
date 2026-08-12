# Tasks: 2608120958 - color-mode-switch-jank

## Phase A — 基礎建設
- [x] A1. 新增 `app/composables/useColorSchemeCssVars.ts`：模組層 kebab-case 快取 + 直接寫入 CSS 變數
- [x] A2. 確認變數命名對映（`--cml-c-m3-*` / `--cml-c-*` / `--color-*`）與現況逐字一致

## Phase B — 消除重複與洩漏
- [x] B1. `useCustomColorScheme`：全域路徑改為模組層單例 watcher（Q1：`editable` 僅對非全域生效）
- [x] B2. `useCustomColorScheme`：非全域路徑改用 A1 寫入器，移除 `getCssVar` 與 `useChangeCase`
- [x] B3. `useMaterial3ColorScheme`：target-scoped watcher 改用 A1 寫入器，移除 `getCssVar` 與 `useChangeCase`
- [x] B4. `useCamelotTheme`：`themeMode` DOM 屬性 watcher 與 `triggerThemeTransition` watcher 提升為模組層單例
- [x] B4a. （計畫外，必要）`themeMode` 的 `useLocalStorage` 一併單例化 — 否則單例 watcher 與元件持有不同 ref，主題切換失效
- [x] B5. 確認三個 composable 的對外回傳契約未改變

## Phase D — 根因修正（使用者回報後追加）
- [x] D1. 新增 `app/composables/useCamelotColorMode.ts`：模組層單一 `useColorMode` 實例
- [x] D2. `useCamelotTheme` / `useCustomColorScheme` / `useMaterial3ColorScheme` 全數改用 D1
- [x] D3. 量測：light/dark 的 `classListAdd` 由 **255 → 2**（主題風格 1、色系 12，落差已消除）
- [x] D4. 功能回歸：四種主題風格 + light/dark/system 皆正確，`--color-primary` / `--color-surface` 隨模式正確翻轉
- [x] D5. 使用者於正常視窗實測確認卡頓已消除

## Phase C — 驗證
- [x] C1. `eslint` 對本次 4 個檔案零錯誤（其餘 9 個錯誤在無關檔案，main 上既有）
- [x] C2. 主執行緒阻塞：以 DOM 操作量為準（見 D3），並由使用者在正常視窗實測確認。**初版據以立論的 5028ms longtask 為隱藏分頁背景節流造成的假訊號，已作廢**
- [x] C3. 單次切換 `getPropertyValue` 呼叫數：23,520 → **0**
- [x] C4. 四種主題風格（material / cupertino / scifi / aqua）+ light / dark / system 皆正確切換
- [x] C5. 色系切換（emerald / violet / rose）與非全域 Provider（`/dialog`）區域色彩覆蓋、自訂鍵 `test` 對映皆正常
- [x] C6. 連續切換 10 次：每次穩定 94–96 次 `setProperty`、0 次 `getPropertyValue`、零 longtask，無累積性劣化
- [x] C7. Console 零錯誤

## 待使用者確認
- [x] 在正常（非隱藏）視窗中實際點擊 light/dark，確認停頓感已消失

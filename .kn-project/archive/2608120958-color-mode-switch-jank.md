# 2608120958 - color-mode-switch-jank

- Created: 2026-08-12 09:58 / Archived: 2026-08-12 12:40
- Issue: KNightING/camelot-nuxt-layer#17

## Summary

消除 light/dark 切換時的全站卡頓，方法是把散落在每個元件實例上的 `useColorMode` 與色彩方案訂閱收斂為模組層單例。

根因是 `useCamelotTheme()` 被 35 個 Camelot 元件檔呼叫，單頁可達數百個實例，而它對每個實例各建立一個 `useColorMode`——VueUse 每個實例都會註冊一份 watcher 在模式變動時往 `<html>` 寫 class，於是切換一次深淺色產生 255 次重複的 class 寫入。同一批呼叫端也各自註冊一份色彩方案 watcher，且寫入時在 watcher 迴圈內逐鍵新建 `useElCssVar`，造成單次切換 23,520 次冗餘 `getPropertyValue` 與約 47,000 個永不回收的 watcher。影響模組為 `app/composables/` 的主題與色彩方案層，元件端零改動（對外契約未變）。

量測（`.playground` 首頁，3618 個節點）：`classList.add` 255 → 2、`getPropertyValue` 23,520 → 0。

## Cross-Repo Scope

無（單一 repo）。分支 `fix/2608120958-color-mode-switch-jank`。

## Key Decisions

- **[Q1]** 全域路徑一律寫入 CSS 變數，`config.editable` 僅對綁定自身元素的非全域路徑生效 — 理由：與單例化前的實際可觀察行為一致（數百個呼叫端共寫 `<html>`，該旗標本就無法生效），不夾帶行為變更。
- **[Q2]** `.playground` 兩處 `useCustomColorScheme(undefined, …)` 的無效呼叫本次不修 — 理由：屬獨立的行為缺陷（`isGlobal` 為 false 且取不到目標元素，設定的色彩從未寫入），混入效能修正會讓 diff 與驗證失焦。**仍待處理。**
- **[Q3]** `triggerThemeTransition` 的全域 `*` 過場保留不動 — 理由：量測證實非根因（樣式重算 20-55ms，且三種切換成本相當）。
- **[根因修正]** 新增 `useCamelotColorMode` 收斂 `useColorMode` 實例 — 理由：使用者實測回報「僅 light/dark 卡、主題風格與色系切換都快」，推翻初版歸因。量測證實 light/dark 觸發 255 次 `classList.add`（其餘切換 5–12 次），堆疊全數指向 VueUse `useColorMode` 的 per-instance watcher。
- **量測方法教訓**：初版據以立論的「單一 5028ms longtask」是在隱藏分頁（`visibilityState: hidden`，背景節流）中量到的假訊號。**在該環境下 wall-clock 與 longtask 時長皆不可採信**，只有 DOM 操作次數這類與時間無關的計數才有效。
- **[執行中]** S1 拆成 `applyColorSchemeCssVars` 與 `applyMaterial3CssVars` 兩支 — 理由：兩條路徑的值格式本就不同（前者寫原始色值供 `--color-*` 直接取用，後者寫 `r,g,b` 三元組），硬併會改變其中一方的輸出。兩者仍共用 kebab-case 快取。
- **[執行中]** `useColorSchemeCssVars` 的 Material3 鍵集合延遲初始化 — 理由：與 `useMaterial3ColorScheme` 互為循環匯入，模組載入當下建 Set 會撞上 TDZ（實測 Vite 報 `Cannot access before initialization`，全頁元件載入失敗）。
- **[執行中]** `themeMode` 的 `useLocalStorage` 一併單例化 — 理由：只單例化 watcher 會讓它自建獨立的 storage ref，同分頁兩個 `useStorage` 實例不互相同步，實測導致主題風格切換後 `data-camelot-theme-mode` 卡在第一個值。ref 與 watcher 同掛在 `effectScope(true)`，避免生命週期綁到偶然第一個掛載的元件。

## Deviations

- **根因與原計畫不同**：原計畫（S1–S4）針對的是 `useElCssVar` 洩漏與色彩方案 watcher 重複。那是真實且獨立的缺陷（已修正，23,520 → 0），但**不是**使用者感受到卡頓的來源。真正的根因（S5，`useColorMode` per-instance）是在使用者回報「只有 light/dark 慢」之後才追查出來，屬計畫外追加的 Phase D。
- **計畫外追加 `themeMode` storage 單例化**（B4a）：不做會使主題風格切換失效，屬單例化的必要配套。
- **順手修掉既有 lint error**：`useMaterial3ColorScheme` 上 main 即存在的 2 個 `no-useless-assignment`，位置就在改動區塊相鄰處，同時把重複的 isDark 判斷收斂為 `isDarkMode` computed。
- **未取得絕對延遲數字**：Browser 面板無法顯示，分頁恆為 hidden，paint/raster 成本無法量測。最終手感由使用者在正常視窗實測確認。

## Impact Files

- `app/composables/useCamelotColorMode.ts` (new) — 全站共用的 `useColorMode` 單一實例。**根因修正**。
- `app/composables/useColorSchemeCssVars.ts` (new) — CSS 變數單向寫入器（`applyColorSchemeCssVars` / `applyMaterial3CssVars`）+ 模組層 kebab-case 快取；Material3 鍵集合延遲初始化以避開循環匯入 TDZ。
- `app/composables/useCamelotTheme.ts` — `useColorMode`、`themeMode` storage、`themeMode` DOM 屬性 watcher 與 `triggerThemeTransition` watcher 全數收斂為模組層單例，統一掛在 `globalThemeScope`（`effectScope(true)`）。
- `app/composables/useCustomColorScheme.ts` — 全域路徑改為模組層單例 watcher（`ensureGlobalCssVarsWatcher`）；非全域路徑保留 per-instance 但改用新寫入器；移除 `getCssVar` 與 `useChangeCase`；新增 `isDarkMode` computed。
- `app/composables/useMaterial3ColorScheme.ts` — target-scoped watcher 改用 `applyMaterial3CssVars`；移除 `getCssVar` 與 `useChangeCase`；收斂重複的 isDark 判斷。
- **未修改** `app/composables/useElCssVar.ts` — 它本身是正確的雙向 reactive composable，`app/components/Camelot/RippleEffect.vue:21,23` 在 setup 期正常使用。洩漏源自「在 watcher 內建立實例」的呼叫端誤用。

## Details

未竟事項（Q2）：`.playground/app/pages/index.vue` 與 `dialog.vue` 以 `useCustomColorScheme(undefined, …)` 呼叫，`isGlobal` 判定為 false 且 `unrefElement(undefined)` 取不到目標，設定的色彩從未寫入任何元素。屬既有行為缺陷，本次刻意不動。

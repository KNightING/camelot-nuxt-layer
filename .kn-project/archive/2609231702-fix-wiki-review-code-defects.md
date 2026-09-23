# 2609231702 - fix-wiki-review-code-defects

- Created: 2026-09-23 17:02 / Archived: 2026-09-23
- Issue: KNightING/camelot-nuxt-layer#47
- Milestone: N/A / Base Branch: main

## Summary
修正 wiki 整理（2609231616）時發現、逐項對照原始碼確認的 20 項程式碼缺陷，並建立 vitest 單元測試環境（37 個測試）。
缺陷橫跨 13 個 composable 與 7 個元件，包含 email 驗證拒絕連字號、`hexToRgba` alpha 恆為 0、`useAutoLink` 未跳脫 HTML、JSON Lines 丟失最後一行、RippleEffect 自訂漣漪色從未生效等。
每個 composable 缺陷先寫出能重現的失敗測試再修正；型別層缺陷由 `pnpm typecheck` 檢查測試檔抓出；元件在 playground 實測。對應 wiki 頁已改為修正後的行為，並新增 `dev/testing.md`。

## Cross-Repo Scope
無（單一 repo）

## Key Decisions
- **[Q0]** 不指定 milestone，Base Branch = `main`。
- **[Q1]** `useFetchJSONLinesStream` 的 `finishOnParseError` 讓宣告的預設 `true` 生效（行為變更：原本實際不中止）。
- **[Q2]** DateV2 實作 `disableDaysOfWeekList`、`allowedDates`（與使用端 `getDayAttributes` 合成停用日）；Input 移除無作用的 `border`、`size`（破壞性變更）— 使用者選擇。
- **[Q3]** 建立 vitest：以 unimport 重建 Nuxt 自動匯入（vue、@vueuse/core、app/composables），`useState`／`useAsyncData` 由 `tests/nuxt-stubs.ts` 替身提供，環境 happy-dom；新增 devDependencies `happy-dom`、`unimport`（後者原為間接依賴，改為明確宣告）與 `pnpm test`。
- **[Q4]** 不拆，一個 PR。
- **[Phase 0]** `NUXT_PUBLIC_ENV`、`@nuxt/kit`、驗證器接受非空字串不列入 — 非缺陷或已有前例決議（2608190042 Q6）。
- **[Phase 0]** email 頂級網域長度維持 `{2,4}`，只修字元類。
- **[Phase 0]** `useLazyImage` 空 `src` 視為錯誤（ImageV2 顯示 error slot）。
- **[執行中]** RippleEffect 實際傳入值是 `var(--color-on-*-container)` 等 CSS 變數而非 hex，原本的 hex 轉換一律失敗；改由模板 `:style` 直接綁 CSS 變數，接受任何色值，移除 `useElCssVar`（它在掛載前會 fallback 寫到 `<html>`）。
- **[執行中]** `useAutoLink` 改在原始文字上以合併正則一次掃描，非連結片段逐段跳脫；同位置優先序網址 > email > 電話。
- **[執行中]** `useInfinitePage` 不再給 target 預設值，交給 `useScrollOnBottom` 掛載後改用 window。SSR 測試以 `renderToString` 在元件內呼叫（元件外呼叫時 `tryOnMounted` 會立即執行，無法代表 SSR）。
- **[執行中]** DateV2 `allowedDates` 中無法解析的日期略過，避免 `format` 拋錯使日曆無法渲染（子代理審查時發現的新邊界）。
- **[執行中]** playground 補停用週末 DateV2、停用 Slider、ImageV2 `@loaded` 範例，作為實測與示範。

## Deviations
- 原計畫未列 `package.json` 依賴變更與 `tests/`、`vitest.config.ts`，執行中新增（Q3 的直接結果）。
- SlideTransitionGroup、RevealImage 在 playground 沒有範例，僅以程式碼審查與型別檢查驗證，未實機確認。
- JSON Lines 若解析錯誤發生在沒有換行的最後一行，串流已結束，使用端 `onFinish` 仍會被呼叫（中途錯誤則不會）；影響小，未處理。

## Impact Files
- `app/composables/useValueValidation.ts:17`、`useColor.ts:62-73`、`useAutoLink.ts`（重寫）、`useFetchJSONLinesStream.ts:57-82,95-104`
- `app/composables/useInputValidationController.ts`、`useFileToDataURL.ts`、`useBlobDownload.ts`、`useCanvasConvert.ts`、`useIsValidKey.ts`
- `app/composables/useLazyImage.ts:30-40`、`useObject.ts`（diff、deepClone）、`useInfinitePage.ts:15`、`useDrawerCollapsed.ts`
- `app/components/Camelot/RippleEffect.vue`、`RevealImage.vue`、`Slider.vue`（onThumbKey）、`SlideTransitionGroup.vue`（next）
- `app/components/Camelot/ImageV2.vue`（loaded、src 響應）、`DateV2.vue`（resolveDayAttributes）、`Input.vue`（移除 border、size）
- `vitest.config.ts` (new)、`tests/nuxt-stubs.ts` (new)、`tests/composables/*.test.ts` (new, 13 檔)
- `package.json`、`pnpm-lock.yaml` — `test` script、happy-dom、unimport
- `.playground/app/pages/index.vue` — 三個示範
- `.kn-project/wiki/features/composables/*.md`（13 頁）、`.kn-project/wiki/features/components/*.md`（7 頁）、`.kn-project/wiki/dev/testing.md` (new)、`.kn-project/wiki/index.md`

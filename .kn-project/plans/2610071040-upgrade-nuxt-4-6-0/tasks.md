# Tasks for 2610071040

## Phase 1 — 升級依賴
- [x] 確認 `node -v` 為 `^24.15.0` 或 `>=26`
- [x] `package.json`：`nuxt` 4.5.2 → 4.6.0、`version` 4.5.2.0 → 4.6.0.0
- [x] `pnpm up nuxt@4.6.0 --dedupe` 重新鎖定；對齊 `@vue/compiler-sfc`；如有相依衝突再調整 `unimport`／`vue-tsc`

## Phase 1b — 修正 4.6.0 造成的型別錯誤
- [x] `app/composables/useBaseApi.ts`：改為符合 4.6.0 `useFetch` 型別（`Url` 收窄、明列泛型），不使用轉型，`typecheck` 轉綠

## Phase 2 — 驗證
- [x] `pnpm lint`
- [x] `pnpm typecheck`
- [x] `pnpm test`
- [x] `pnpm build`，並 `pnpm generate`；檢查 dev server 啟動無錯誤、首頁可開
- [x] 確認 `securityPlugin`（nonce／CSP）在 SSR 輸出仍正常

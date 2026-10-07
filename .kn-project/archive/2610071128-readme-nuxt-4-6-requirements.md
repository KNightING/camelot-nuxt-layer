# 2610071128 - readme-nuxt-4-6-requirements

- Created: 2026-10-07 11:28 / Archived: 2026-10-07 11:45
- Issue: KNightING/camelot-nuxt-layer#55
- Milestone: N/A / Base Branch: main

## Summary
補上 #54（升級 nuxt 4.6.0）漏改的 README：消費端依賴範例的 `nuxt` 改為 `^4.6.0`，技術棧表格新增 Node.js 版本需求，`package.json` 版本號改為 `4.6.0.1`。
Layer 的 `useApiFetch` 已依賴 4.6.0 的 `useFetch` 型別，消費端須為 4.6.0 以上；Node 需求取自 nuxt 4.6.0 的 `engines`（`^22.22.3 || ^24.15.0 || >=26`）。純文件與版本欄位變更，wiki 無需更新。

## Cross-Repo Scope
無（單一 repo）

## Key Decisions
- **[Q1]** 不掛 milestone，Base Branch = `main` — `4.6.0.1` 為 4 段式，不符 milestone 格式（`X.Y.Z[+N]`）；核准計畫時未要求覆寫。
- **[版本]** `package.json` version 改為 `4.6.0.1` — 使用者指定，第四碼為本專案自有。
- **[範圍]** README 的 `@nuxt/kit` 範例（`^4.0.0`）不動 — 無證據需要同步升級。
- **[核准閘]** Phase 收尾自動 commit；完成後 commit + 開 PR。

## Deviations
None

## Impact Files
- `README.md:50` — `"nuxt": "^4.5.0"` → `^4.6.0`
- `README.md:11` — 技術棧表格新增「執行環境」列（Node.js 版本需求）
- `package.json:4` — `version` 4.6.0.0 → 4.6.0.1

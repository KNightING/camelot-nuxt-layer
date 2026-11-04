# Plan: 2611041536 - upgrade-nuxt-4-6-4
- Created: 2026-11-04
- Branch: feature/2611041536-upgrade-nuxt-4-6-4
- Issue: KNightING/camelot-nuxt-layer#71
- Milestone: 4.6.4.0
- Base Branch: 4.6.4.0
- Status: In Progress
- Completed: [Wait for Finish]

## Goals
將 `nuxt` 由 4.6.3 升級至 4.6.4(安全性釋出:修正 8 項 Nuxt advisory,並帶入 nitropack 2.13.6 修正 3 項 Nitro advisory)。僅動依賴版本、README 範例範圍與 lockfile,不改程式邏輯。
來源:https://github.com/nuxt/nuxt/releases/tag/v4.6.4

## Architecture
無架構變更。`package.json` 釘選精確版本 `4.6.3` 改為 `4.6.4`,`README.md` 範例範圍 `^4.6.3` 同步為 `^4.6.4`,`pnpm install` 更新 `pnpm-lock.yaml`。完成後跑 lint、typecheck、vitest、build,並以 playground 實際啟動確認無 console 警告。程式碼遵循 `kn-project-code-style`(本計畫無程式碼撰寫)。

行為變更盤點(release notes 列出 5 項)對本 layer 的影響:
- 正式環境錯誤細節只保留 `createError` 建立的訊息 — `app/` 內無 `createError`/`showError`/`useError` 用法(Grep 無命中),無影響;下游應用自行評估。
- webpack/rspack dev server 的 Host 檢查、`devServer.allowedHosts` — 本專案用 Vite,無影響。
- `workspaceDir` 偵測、nitropack 快取路由規則、編碼斜線的 route rules — `nuxt.config.ts` 無 `routeRules`/`workspaceDir` 設定(Grep 無命中),無影響。

## Cross-Repo Scope
無（單一 repo）

## Contract / 介面契約
無（單一 repo）

## Impact Files
- `package.json:52` (`dependencies.nuxt`) — `4.6.3` → `4.6.4`
- `README.md:51` (`nuxt` 範例範圍) — `^4.6.3` → `^4.6.4`
- `pnpm-lock.yaml` — nuxt、`@nuxt/*`、nitropack 2.13.6、unrouting 0.3.2 等連動更新(由 pnpm 重新產生)

## App-Flow Screens
（`project.md` 已記錄 `appFlow: false`,不適用）

## Open Questions / 待確認事項
無

## Manual Follow-ups / 人工收尾事項
- **[合併後]** 使用此 layer 的下游應用更新 layer 依賴並重建部署 — 各應用 `pnpm update camelot-nuxt3-layer` 後重建映像;下游若用 `routeRules` 的 `cache`/`swr`/`isr`、自訂 dev hostname 或依賴正式環境的錯誤細節,需對照 release notes 的行為變更自行檢查 — 下游 repo 不在本流程範圍

## Key Decisions
- **[Milestone]** 使用者選定 `4.6.4.0`(Patch+1,自 4.6.3.1 起算,與 nuxt 版本對齊);版本分支 `4.6.4.0` 自 `main` 切出;非標準四段格式,Rule 24 跳過版本檔同步,`package.json` 的 `version` 不動。
- **[整合主幹]** 遠端僅有 `main`。
- **[README]** 沿用先前使用者要求,README 範例範圍隨 nuxt 版本同步。
- **[完成後]** 預設:commit + 開 PR(base 4.6.4.0)。

## Git Completion Policy
- PR 一律以 `--base 4.6.4.0` 顯式指定。
- 每個 commit 與 PR body 含 `Closes #${N}`。
- 完成時 `git fetch` 後 `git rebase origin/4.6.4.0` 並 `git push --force-with-lease --force-if-includes`。
- Archive automatically triggered on PR request。

## References
- https://github.com/nuxt/nuxt/releases/tag/v4.6.4
- 前次升級:`.kn-project/archive/2610301635-upgrade-nuxt-4-6-3.md`

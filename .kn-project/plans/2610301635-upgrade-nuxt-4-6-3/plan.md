# Plan: 2610301635 - upgrade-nuxt-4-6-3
- Created: 2026-10-30
- Branch: feature/2610301635-upgrade-nuxt-4-6-3
- Issue: KNightING/camelot-nuxt-layer#63
- Milestone: 4.6.3.0
- Base Branch: 4.6.3.0
- Status: In Progress
- Completed: [Wait for Finish]

## Goals
將 `nuxt` 由 4.6.2 升級至 4.6.3（patch，含 5 項 GHSA 安全性修正：vite dev server 檔案讀取／nitro dev 輸出／app secret、dot segments 路徑、page islands redirect route rules；另含效能與多項 bug fix）。僅動依賴版本與 lockfile，不改程式邏輯。
來源：https://github.com/nuxt/nuxt/releases/tag/v4.6.3

## Architecture
無架構變更。`package.json` 釘選精確版本 `4.6.2`，改為 `4.6.3`，以 `pnpm install` 更新 `pnpm-lock.yaml`（nuxt、`@nuxt/*`、nitropack 2.13.5、unrouting 0.3.1 等連動升級）。完成後跑 lint／typecheck／build 驗證。程式碼遵循 `kn-project-code-style`（本計畫無程式碼撰寫）。

## Cross-Repo Scope
無（單一 repo）

## Contract / 介面契約
無（單一 repo）

## Impact Files
- `package.json:52` (`dependencies.nuxt`) — `4.6.2` → `4.6.3`
- `pnpm-lock.yaml` — nuxt 及 `@nuxt/*` 相依 4.6.2 → 4.6.3（`pnpm-lock.yaml:54-55` 起共 59 處 4.6.2 參照，由 pnpm 重新產生）

## App-Flow Screens
（`project.md:79` 已記錄 `appFlow: false`，不適用）

## Open Questions / 待確認事項
無

## Manual Follow-ups / 人工收尾事項
- **[合併後]** 使用此 layer 的下游應用程式更新 layer 依賴並重新建置部署 — 各應用 `pnpm update camelot-nuxt3-layer`（或對應版本）後重建映像 — 下游 repo 不在本流程範圍

## Key Decisions
- **[Milestone]** 使用者選定 `4.6.3.0`（Patch+1，自 tag/milestone 4.6.2.0 起算）；版本分支 `4.6.3.0` 自 `main` 切出（尚不存在，需建立）。
- **[Rule 24]** milestone 為非標準四段格式，跳過版本檔同步與 Version Gate；`package.json:4` `version` 維持 `4.6.1.0` 不動（沿用 4.6.2.0 做法）。
- **[整合主幹]** 遠端僅有 `main`，`${DEFAULT_BRANCH}` = `main`，不詢問。
- **[完成後]** 預設：commit + 開 PR（核准時未更動即採用）。

## Git Completion Policy
- PR 一律以 `--base 4.6.3.0` 顯式指定 base。
- 每個 commit 訊息與 PR body 含 `Closes #${N}`（N 取自 `- Issue:`）。
- commit 自動；完成時 `git fetch` 後 `git rebase origin/4.6.3.0` 並 `git push --force-with-lease --force-if-includes`。
- Archive automatically triggered on PR request。

## References
- https://github.com/nuxt/nuxt/releases/tag/v4.6.3
- 前次升級：`.kn-project/archive/2610221128-upgrade-nuxt-4-6-2-pin-node-26-12-1.md`

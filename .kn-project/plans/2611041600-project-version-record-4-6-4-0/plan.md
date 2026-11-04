# Plan: 2611041600 - project-version-record-4-6-4-0
- Created: 2026-11-04
- Branch: docs/2611041600-project-version-record-4-6-4-0
- Issue: KNightING/camelot-nuxt-layer#74
- Milestone: N/A（未指定）
- Base Branch: main
- Status: In Progress
- Completed: [Wait for Finish]

## Goals
補上 `.kn-project/project.md` 版本紀錄缺的 4.6.4.0 一行。4.6.4.0 已透過 PR #73 直接併回 `main`,未經版本紀錄步驟,屬補救性的純文件變更。

## Architecture
無。在 `## 版本紀錄` 最上方加一行,版本字串取 milestone 標題 `4.6.4.0`。語意只有「這個版本的工作已併回主幹」,不寫「當前版本」。

## Cross-Repo Scope
無（單一 repo）

## Contract / 介面契約
無（單一 repo）

## Impact Files
- `.kn-project/project.md:84` (`## 版本紀錄`) — 最上方新增 `4.6.4.0 — 併回主幹 2026-11-04(nuxt 4.6.3 升級到 4.6.4,安全性釋出;@nuxt/cli 升至 4.0.3)`

## App-Flow Screens
（`appFlow: false`,不適用）

## Open Questions / 待確認事項
無

## Manual Follow-ups / 人工收尾事項
無

## Key Decisions
- **[Milestone]** 使用者選「不指定」(4.6.4.0 已關閉);base 為 `main`,不建 milestone 與版本分支。
- **[性質]** 補救性純文件 PR:4.6.4.0 以 PR #73 直接併回主幹,版本紀錄未隨 Merge PR 寫入。
- **[完成後]** commit + 開 PR(base main)。

## Git Completion Policy
- PR 一律以 `--base main` 顯式指定。
- 每個 commit 與 PR body 含 `Closes #${N}`。
- 完成時 `git fetch` 後 `git rebase origin/main` 並 `git push --force-with-lease --force-if-includes`。

## References
- 版本紀錄規則:併回主幹的版本才記一行,不寫「當前版本」

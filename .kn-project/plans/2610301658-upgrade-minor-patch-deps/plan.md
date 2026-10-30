# Plan: 2610301658 - upgrade-minor-patch-deps
- Created: 2026-10-30
- Branch: feature/2610301658-upgrade-minor-patch-deps
- Issue: KNightING/camelot-nuxt-layer#66
- Milestone: 4.6.3.1
- Base Branch: 4.6.3.1
- Status: In Progress
- Completed: [Wait for Finish]

## Goals
升級 `pnpm outdated` 列出的 Patch/Minor 套件(不含 major),維持 lint、typecheck、build 通過。Major 套件(@vueuse/* 15、happy-dom 21、unimport 7、unplugin-icons 24、vitest 5、typescript 7)不在本計畫。

## Architecture
無架構變更。修改 `package.json` 版本字串後 `pnpm install` 更新 lockfile。目標版本:
- `@iconify-json/material-symbols` 1.2.90 → 1.2.97
- `@pinia/nuxt` 1.0.2 → 1.0.3(釘選)
- `@vue/compiler-sfc` 3.5.43 → 3.5.44(釘選)
- `vue-tsc` 3.3.11 → 3.3.13
- `@types/node` 26.4.0 → 26.6.6
- `eslint` 10.8.1 → 10.13.0(釘選)
- `pinia` 4.0.3 → 4.1.0
- `@tiptap/*`(7 個)3.31.0 → 3.32.1
注意 `pnpm-workspace.yaml` 有 `minimumReleaseAge` 例外清單(tiptap 3.31.0 逐包列出);若 3.32.1 因發佈時間過新被擋,需同步更新該清單。程式碼遵循 `kn-project-code-style`(本計畫無程式碼撰寫)。

## Cross-Repo Scope
無（單一 repo）

## Contract / 介面契約
無（單一 repo）

## Impact Files
- `package.json:23-25,28,35,39,41-47,53` — 上列套件版本字串
- `pnpm-lock.yaml` — 重新產生
- `pnpm-workspace.yaml` (`minimumReleaseAgeExclude`) — 僅在 tiptap 3.32.1 被 minimumReleaseAge 擋下時,把例外清單 3.31.0 同步為 3.32.1
- 若 eslint 10.13 新規則造成 lint 失敗,需修正的檔案於執行時補列並重新核准

## App-Flow Screens
（`project.md` 已記錄 `appFlow: false`,不適用）

## Open Questions / 待確認事項
無

## Manual Follow-ups / 人工收尾事項
- **[合併後]** 下游應用更新 layer 依賴並重建部署 — 各應用 `pnpm update camelot-nuxt3-layer` 後重建映像 — 下游 repo 不在本流程範圍

## Key Decisions
- **[Milestone]** 使用者手動輸入 `4.6.3.1`(非標準格式,一律接受);版本分支 `4.6.3.1` 自 `main` 切出;Rule 24 跳過版本檔同步,`package.json` 的 `version` 不動。
- **[範圍]** 只升 Patch/Minor;Major 套件另案。
- **[整合主幹]** 遠端僅有 `main`。
- **[完成後]** 預設:commit + 開 PR。

## Git Completion Policy
- PR 一律以 `--base 4.6.3.1` 顯式指定。
- 每個 commit 與 PR body 含 `Closes #${N}`。
- 完成時 `git fetch` 後 `git rebase origin/4.6.3.1` 並 `git push --force-with-lease --force-if-includes`。
- Archive automatically triggered on PR request。

## References
- `pnpm outdated` 結果(2026-10-30)

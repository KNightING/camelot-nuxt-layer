<!-- REMINDER: Relative Paths Only! No file:///c:/... -->
# Plan: 2610071040 - upgrade-nuxt-4-6-0
- Created: 2026-10-07
- Branch: feature/2610071040-upgrade-nuxt-4-6-0
- Issue: KNightING/camelot-nuxt-layer#53
- Milestone: N/A（未指定）
- Base Branch: main
- Status: In Progress
- Completed: [Wait for Finish]

## Goals
將 `nuxt` 由 `4.5.2` 升級到 `4.6.0`（https://nuxt.com/blog/v4-6），**不啟用任何新功能**（不開 `future.compatibilityVersion: 5`、不採用 `nuxt/server`、不開 Vapor／experimental 旗標），並確認 lint、typecheck、test、build 全數通過。同步把 layer 版本由 `4.5.2.0` 改為 `4.6.0.0`（前三碼跟隨 nuxt，第四碼為本專案自有）。

## Architecture
- 升級研究結論（Phase 0）：4.6.0 預設仍是 Nitro v2（現為 `nitropack 2.13.4`），`nuxt/server` 為可選的新匯入介面，本 repo 不採用即不受影響。
- Node 需求：`engines` 為 `^22.22.3 || ^24.15.0 || >=26.0.0`；`Dockerfile*` 已用 `node:26-alpine`，本機已改用 nvm 的 v26.10.0。
- Vue：4.6.0 依賴 `vue ^3.5.43`，本 repo 的 `@vue/compiler-sfc` 釘在 3.5.40，需與升級後解析出的 `vue` 版本對齊。
- 不採用 Nuxt 5 預設值：本專案是 layer，`nuxt.config.ts` 會被下游專案繼承，旗標會替所有下游一併切換行為；列為日後獨立計畫（只在 `.playground` 試跑）。
- 程式碼風格：本計畫只改依賴與版本號，若需微調設定檔，依 `kn:project:code-style` 規範。

## Cross-Repo Scope
無（單一 repo）

## Impact Files
- `package.json:52` (`"nuxt": "4.5.2"`) — 升級到 `4.6.0`
- `package.json:4` (`"version": "4.5.2.0"`) — 改為 `4.6.0.0`（Q2 已確認）
- `package.json:25` (`"@vue/compiler-sfc": "3.5.40"`) — 對齊升級後 `vue` 解析版本（nuxt 4.6.0 要求 `vue ^3.5.43`）
- `package.json:31`、`package.json:35` (`unimport` 6.4.0、`vue-tsc`) — 若與 nuxt 4.6.0 的相依範圍衝突才調整，否則不動
- `pnpm-lock.yaml` — 重新鎖定（`nuxt@4.5.2` 見第 61、8280 行等多處）
- `.kn-project/project.md:6` — 僅是「撰寫時為 `4.5.2.0`」的歷史註記，語意為版本以 package.json 為準，**預設不動**（Q2 決議）

## App-Flow Screens
- （無 app-flow.json，刪除本節）

## Open Questions / 待確認事項
### Q1. Milestone — 影響範圍：Base Branch
- [x] 不指定，以 `main` 為 base
- **決議**：使用者說明版本前三碼跟隨 nuxt、第四碼自有，故版本應為 `4.6.0.0`，但 4 段式不符 Rule 24 milestone 格式（`X.Y.Z[+N]`），也未選任何 milestone 選項，依「未表態視為不指定」處理；版本號本身仍於 `package.json` 改為 `4.6.0.0`。　狀態：✅ 已確認（核准閘仍可糾正）

### Q2. package.json 版本號 — 影響範圍：`package.json:4`
- [x] 改為 `4.6.0.0`
- **決議**：改為 `4.6.0.0`　狀態：✅ 已確認

### Q3. `@vue/compiler-sfc` 釘版 — 影響範圍：`package.json:25`
- [x] 對齊升級後 `vue` 實際解析版本（只有一種合理作法，執行時直接做並記 Key Decisions）
- **決議**：執行時依 lock 實際值對齊　狀態：✅ 已確認

## Manual Follow-ups / 人工收尾事項
- **[合併後]** 重建並部署 Docker 映像 — 依既有發佈流程重新建置 `Dockerfile*`（Node 26、pnpm 11.25.0），並確認新 tag 出版（目前最新 tag 為 4.5.2.13）— 需要部署環境與發佈權限，agent 不代做
- **[合併後]** 下游專案的 CI／本機 Node 需 `^22.22.3 || ^24.15.0 || >=26` — 逐一確認使用本 layer 的專案其 Node 版本 — agent 無從得知下游專案環境

## Key Decisions
- **[核准閘]** Phase 收尾 commit：自動 commit，事後回報；完成後：commit + 開 PR（Rule 12 非互動鏈，自動歸檔＋wiki）。
- **[Q1]** 不指定 milestone，Base Branch = `main` — 理由：版本為 4 段式，不符 milestone 格式；歷史計畫亦不指定。
- **[Q2]** `package.json` version 改為 `4.6.0.0` — 理由：前三碼跟隨 nuxt（使用者說明）。
- **[範圍]** 方案 1：只升 4.6.0，不啟用 Nuxt 5 預設值與任何新功能 — 理由：本專案是 layer，旗標會被下游繼承；Nuxt 5 預覽行為仍可能調整。
- **[執行中]** `@vue/compiler-sfc` 3.5.40 → 3.5.43 — 理由：升級後 vue 解析為 3.5.43（nuxt 4.6.0 要求 `^3.5.43`），釘版對齊；`unimport` 6.4.0、`vue-tsc` 3.3.11 無相依衝突，未動；`pnpm dedupe` 已套用。
- **[環境]** 本機 Node 已改用 nvm v26.10.0（4.6.0 要求 `^24.15.0 || >=26`）；本 session 需重啟後才生效。

## Git Completion Policy
- PR 一律以 `--base main` 顯式指定 base，不依賴 `gh` 的預設值 (Rule 23)。
- Issue 綁定時，**每個 commit 訊息**與 PR body 都必須含 `Closes #${N}`（`${N}` 取自上方 `- Issue:`，**不是** `${ID}`）。歸檔完成後於該 issue 張貼由 archive 蒸餾的結案留言 (Rule 20)。
- Issue 的關閉發生在**合併後清理**（使用者回報已合併、內容驗證通過），不在歸檔當下 (Rule 21 步驟 6)；commit 關鍵字為保險絲。
- After user-approved commits, completion will run `git rebase main` and update the remote work branch with `git push --force-with-lease --force-if-includes`.
- PR/archive order: Archive automatically triggered on PR request

## References
- https://nuxt.com/blog/v4-6
- `npm view nuxt@4.6.0 engines`：`^22.22.3 || ^24.15.0 || >=26.0.0`；依賴 `vue ^3.5.43`、`@nuxt/cli ^4.0.0`

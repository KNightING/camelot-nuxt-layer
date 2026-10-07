<!-- REMINDER: Relative Paths Only! No file:///c:/... -->
# Plan: 2610071128 - readme-nuxt-4-6-requirements
- Created: 2026-10-07
- Branch: fix/2610071128-readme-nuxt-4-6-requirements
- Issue: KNightING/camelot-nuxt-layer#55
- Milestone: N/A（未指定） <!-- 見 Q1 -->
- Base Branch: main
- Status: In Progress
- Completed: [Wait for Finish]

## Goals
補上 #54（升級 nuxt 4.6.0）漏改的 README：消費端依賴範例的 `nuxt` 版本改為 `^4.6.0`，並在技術棧表格新增 Node.js 版本需求；`package.json` 版本號改為 `4.6.0.1`。

## Architecture
- 純文件變更（加一行版本號）。nuxt 4.6.0 的 `engines` 為 `^22.22.3 || ^24.15.0 || >=26.0.0`（取自 `npm view nuxt@4.6.0 engines`）；layer 的 `useApiFetch` 依賴 4.6.0 的 `useFetch` 型別，消費端必須是 4.6.0 以上。
- `@nuxt/kit` 範例（`^4.0.0`）無證據需要跟著升，不動。
- 程式碼風格：不涉及程式碼，僅 JSON 版本欄位。

## Cross-Repo Scope
無（單一 repo）

## Impact Files
- `README.md:50` (`"nuxt": "^4.5.0"`) — 改為 `^4.6.0`
- `README.md:11` (技術棧表格「框架」列之後) — 新增 Node.js 版本需求一列（`^22.22.3 || ^24.15.0 || >=26`）
- `package.json:4` (`"version": "4.6.0.0"`) — 改為 `4.6.0.1`

## App-Flow Screens
- （無 app-flow.json，刪除本節）

## Open Questions / 待確認事項
### Q1. Milestone — 影響範圍：Base Branch
- [x] 不掛 milestone，以 `main` 為 base　(建議，理由：你選了「4.6.0.1」，但 4 段式不符 milestone 標題格式 `X.Y.Z[+N]`，格式規範禁止建立；版本號本身仍會寫入 `package.json`)
- [ ] 仍建立名為 `4.6.0.1` 的 milestone 與同名版本分支（需你明確授權覆寫格式規範）
- **決議**：預設為第一項；如要改請於核准時說明　狀態：✅ 已確認

## Manual Follow-ups / 人工收尾事項
- **[合併後]** 新 tag 出版（版本 4.6.0.1）— 依既有發佈流程建立 tag／release — 需要發佈權限，agent 不代做

## Key Decisions
- **[核准閘]** Phase 收尾自動 commit；完成後 commit + 開 PR（Rule 12 非互動鏈）。
- **[版本]** `package.json` version 改為 `4.6.0.1` — 理由：使用者指定（第四碼為本專案自有，遞增）。
- **[Q1]** 不掛 milestone，Base Branch = `main` — 理由：`4.6.0.1` 為 4 段式，不符 milestone 格式；使用者核准計畫時未要求覆寫。
- **[範圍]** `@nuxt/kit` 範例不動 — 理由：無證據需要同步升級。

## Git Completion Policy
- PR 一律以 `--base main` 顯式指定 base，不依賴 `gh` 的預設值 (Rule 23)。
- Issue 綁定時，**每個 commit 訊息**與 PR body 都必須含 `Closes #${N}`（`${N}` 取自上方 `- Issue:`，**不是** `${ID}`）。歸檔完成後於該 issue 張貼由 archive 蒸餾的結案留言 (Rule 20)。
- Issue 的關閉發生在**合併後清理**，不在歸檔當下 (Rule 21 步驟 6)；commit 關鍵字為保險絲。
- After commits, completion will run `git rebase main` and update the remote work branch with `git push --force-with-lease --force-if-includes`.
- PR/archive order: Archive automatically triggered on PR request

## References
- [#54](https://github.com/KNightING/camelot-nuxt-layer/pull/54)：升級 nuxt 4.6.0（本計畫補漏的 README）
- `npm view nuxt@4.6.0 engines`：`^22.22.3 || ^24.15.0 || >=26.0.0`

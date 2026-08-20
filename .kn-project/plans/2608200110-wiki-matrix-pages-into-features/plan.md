<!-- REMINDER: Relative Paths Only! No file:///c:/... -->
# Plan: 2608200110 - Wiki Matrix Pages Into Features
- Created: 2026-08-20
- Branch: docs/2608200110-wiki-matrix-pages-into-features
- Issue: KNightING/camelot-nuxt-layer#31
- Status: In Progress
- Completed: [Wait for Finish]

## Goals
執行 wikification 規範的 Structure Normalization：把位於 Wiki 根目錄的兩個清單矩陣頁移入 `features/`，並修正所有指向舊路徑的相對連結。

wikification 技能的「Directory Layout (MANDATORY)」規定 Wiki 根目錄只保留 `index.md`、`environment.md`、`database.md` 三個入口頁，其餘一律放在 `features/`。目前 `components.md` 與 `composables.md` 違反此規範。

## Architecture

### 搬移
| 舊路徑 | 新路徑 |
| :--- | :--- |
| `.kn-project/wiki/components.md` | `.kn-project/wiki/features/components.md` |
| `.kn-project/wiki/composables.md` | `.kn-project/wiki/features/composables.md` |

搬移後 Wiki 根目錄僅剩 `index.md` 與 `environment.md`（本專案無 `database.md`），符合規範。

### 連結改寫規則
| 引用者位置 | 舊寫法 | 新寫法 |
| :--- | :--- | :--- |
| `wiki/index.md`（根） | `./components.md` | `./features/components.md` |
| `wiki/features/*.md`（同層） | `../components.md` | `./components.md` |
| `wiki/components/*.md`、`wiki/composables/*.md` | `../components.md` | `../features/components.md` |
| 兩個矩陣頁自身 | `./index.md`、`./composables.md` | `../index.md`、`./composables.md`（同層互引不變） |
| `README.md`（repo 根） | `./.kn-project/wiki/components.md` | `./.kn-project/wiki/features/components.md` |

### 實際影響範圍遠小於預估
任務描述預估「約 137 頁的導覽列」需要改，實際掃描後**只有 13 個檔案**引用這兩頁——絕大多數 per-API 頁的導覽列只寫 `[🏠 Wiki](../index.md)`，並未連到清單矩陣（佐證：`.kn-project/wiki/components/Button.md` 尾行、`.kn-project/wiki/composables/useColor.md` 尾行）。

## Cross-Repo Scope
無（單一 repo）。

## Impact Files
搬移的檔案：
- `.kn-project/wiki/components.md:136`（尾行導覽列）— 移至 `features/`，並修正自身指向 `./index.md` 的連結。
- `.kn-project/wiki/composables.md:106`（尾行導覽列）— 同上。

引用需改寫（由 Grep 全庫掃描確認，共 11 處檔案）：
- `.kn-project/wiki/index.md:33,34,117` — API 清單矩陣區塊兩列 + 底部導覽列。
- `.kn-project/wiki/features/error-handling.md:128` — 導覽列同時引用兩頁。
- `.kn-project/wiki/features/layering.md:48` — 導覽列引用 `../components.md`。
- `.kn-project/wiki/components/ConfirmDialog.md:84` — 導覽列引用 `../components.md`。
- `.kn-project/wiki/components/ErrorDialog.md:58` — 同上。
- `.kn-project/wiki/composables/useCamelotColorMode.md:42` — 導覽列引用 `../composables.md`。
- `.kn-project/wiki/composables/useColorSchemeCssVars.md:40` — 同上。
- `.kn-project/wiki/composables/useCamelotError.md:95` — 同上。
- `.kn-project/wiki/composables/useCamelotTeleportTarget.md:66` — 同上。
- `README.md:195,196` — repo 根的文件索引表，指向兩頁的完整相對路徑。

未受影響（佐證）：
- `.kn-project/project.md` — 全檔無任何指向這兩頁的連結（僅連到 `wiki/features/*` 與 `wiki/index.md`），不需異動。

## Open Questions / 待確認事項

### Q1. `README.md` 是否一併修正？ — 影響範圍：`README.md:195,196`
- [x] A：一併修正　(建議，理由：README 是 repo 對外的第一入口，兩條連結搬移後即失效；不改就是留兩條死連結)
- [ ] B：不動 README，只處理 `.kn-project/` 內部
- **決議**：A　狀態：✅ 已確認

## Key Decisions
- **[執行中]** 兩個矩陣頁補上 `## Summary` 區塊 — 理由：搬進 `features/` 後即落入 wikification 的 Summary 契約範圍（Phase 0 以 `^## Summary` grep `features/` 建索引），原本的無標題引言段落不會被撈到。計畫階段未預見此連帶要求。
- **[執行中]** `archive/2607091530-wiki-rebuild-per-component.md` 內提及的舊路徑不修改 — 理由：歸檔是當時的歷史紀錄，描述的是該計畫執行當下的狀態，改寫歷史會讓歸檔失去可信度。
- **[Q1]** `README.md` 的兩條連結一併修正 — 理由：README 是 repo 對外第一入口，不改即留下死連結。
- **[規劃]** 兩頁移入 `features/` 而非留在根目錄或併入 `index.md` — 理由：wikification 的 Directory Layout 明確列舉根目錄的三個保留檔名，矩陣頁不在其中；併入 `index.md` 則會讓入口頁膨脹到 ~140 列，違反其「純連結索引」定位。

## Git Completion Policy
- Issue 綁定時，PR body 必須含 `Closes #${N}`，歸檔完成後於該 issue 張貼由 archive 蒸餾的結案留言 (Rule 20)。
- After user-approved commits, completion will run `git rebase main` and update the remote work branch with `git push --force-with-lease --force-if-includes`（`main` 由本 repo 的 `refs/remotes/origin/HEAD` 解析而得）。
- PR/archive order: Archive automatically triggered on PR request。

## References
- wikification 技能的「Global Constraints → Directory Layout (MANDATORY)」與「Structure Normalization」
- 前一計畫的歸檔：`.kn-project/archive/2608192332-camelot-error-queue-and-resolvers.md`（本次待辦即由該次 wikification 的 Pruning Report 提出）

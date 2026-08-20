# 2608200110 - wiki-matrix-pages-into-features

- Created: 2026-08-20 01:10 / Archived: 2026-08-20 01:35
- Issue: KNightING/camelot-nuxt-layer#31

## Summary
把 Wiki 根目錄的 `components.md` 與 `composables.md` 兩個清單矩陣頁移入 `features/`，使 Wiki 目錄結構符合 wikification 的 Directory Layout 規範。

該規範規定 Wiki 根目錄只保留 `index.md`、`environment.md`、`database.md` 三個入口頁；搬移後根目錄僅剩 `index.md` 與 `environment.md`（本專案無 `database.md`）。本次為純文件搬移與連結修正，不涉及任何原始碼。待辦來源是前一計畫 2608192332 的 wikification Pruning Report。

## Cross-Repo Scope
無（單一 repo）。

## Key Decisions
- 兩頁移入 `features/` 而非留在根目錄或併入 `index.md` — Directory Layout 明確列舉根目錄的三個保留檔名，矩陣頁不在其中；併入 `index.md` 會讓入口頁膨脹到約 140 列，違反其「純連結索引」定位。
- `README.md` 的兩條連結一併修正 — README 是 repo 對外第一入口，不改即留下死連結。
- 兩個矩陣頁補上 `## Summary` — 搬進 `features/` 後即落入 Summary 契約範圍（Phase 0 以 `^## Summary` grep `features/` 建索引），原本的無標題引言段落不會被撈到。
- `archive/2607091530-wiki-rebuild-per-component.md` 內提及的舊路徑不修改 — 歸檔是當時的歷史紀錄，改寫會讓歸檔失去可信度。

## Deviations
- **實際影響範圍遠小於計畫來源的預估**：待辦單估「約 137 頁的導覽列」需要改，Grep 後只有 13 個檔案引用這兩頁（多數 per-API 頁的導覽列只寫 `[🏠 Wiki](../index.md)`）。
- **但漏估了另一個方向**：真正的大宗是兩個矩陣頁**自身的對外連結**（`./components/*.md` → `../components/*.md`，共 143 條），計畫的 `## Impact Files` 只列了「尾行導覽列」，未涵蓋頁內連結。第一次連結掃描因此驗出 145 條破損，補修後才通過。
- 計畫未預見搬入 `features/` 會連帶要求 `## Summary`，執行中補上。

## Impact Files
- `.kn-project/wiki/features/components.md`（由 `.kn-project/wiki/components.md` 移入）— 補 `## Summary`，91 條對外連結退一層，尾行導覽列 `./index.md` → `../index.md`。
- `.kn-project/wiki/features/composables.md`（由 `.kn-project/wiki/composables.md` 移入）— 同上，52 條對外連結。
- `.kn-project/wiki/index.md:33,34,117` — 清單矩陣區塊兩列與底部導覽列改指 `./features/`。
- `.kn-project/wiki/features/error-handling.md:128`、`layering.md:48` — 同層引用由 `../` 改為 `./`。
- `.kn-project/wiki/components/ConfirmDialog.md:84`、`ErrorDialog.md:58` — 改指 `../features/components.md`。
- `.kn-project/wiki/composables/useCamelotColorMode.md:42`、`useColorSchemeCssVars.md:40`、`useCamelotError.md:95`、`useCamelotTeleportTarget.md:66` — 改指 `../features/composables.md`。
- `README.md:195,196` — 文件索引表兩條路徑。
- `.kn-project/project.md` — 未異動（全檔無指向這兩頁的連結）。

## Details
驗證方式：以腳本掃描 `.kn-project/` 全庫與 `README.md` 的所有相對 `.md` 連結（204 檔、497 條），確認僅剩 `wiki/index.md` 既有的 `./lang/en-US/index.md` 未解析——該連結刻意標註「尚未建立」，屬預留而非破損。

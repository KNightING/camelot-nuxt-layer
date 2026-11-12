# 2611121436 - fix-vitest-windows-stub-import-path

- Created: 2026-11-12 14:36 / Archived: 2026-11-12
- Issue: KNightING/camelot-nuxt-layer#78
- Milestone: 4.6.4.2 / Base Branch: 4.6.4.2

## Summary
修正 Windows 上 `pnpm test` 有兩個測試檔載入失敗的問題，現在 14 個測試檔（43 個測試）全部通過，`pnpm lint` 通過。
根因是 `vitest.config.ts` 把 `fileURLToPath(...)` 產生的 Windows 反斜線路徑交給 unimport，unimport 原樣寫進注入的 import 字串，`\t`、`\n` 被當成跳脫字元，vite 解析失敗；只有用到 `useState`／`useAsyncData` 替身的 `useDrawerCollapsed`、`useFileToDataURL` 受影響。
修法是在 `vitest.config.ts` 模組層把替身路徑算一次並轉成 POSIX 斜線，兩處共用；POSIX 系統行為不變。

## Cross-Repo Scope
無（單一 repo）

## Key Decisions
- **[Milestone]** 掛 `4.6.4.2`（使用者選定，沿用 open milestone #6）；版本分支已存在，工作分支自 `origin/4.6.4.2` 切出。啟動任務時原指示為「從 main 另開分支」，當下 `main` 與 `4.6.4.2` 同為 `a4a7a86`。
- **[版本]** milestone 標題為四段非標準格式，未做版本檔檢查與同步。
- **[整合主幹]** 遠端無 dev 類候選，採 `origin/HEAD` = `main`，不記錄。
- **[分類]** New Plan — 與已歸檔的 `2611121356-tactile-theme-and-new-components` 無關，該計畫未動 `tests/` 與 `vitest.config.ts`。
- **[作法]** 以 `replaceAll('\', '/')` 正規化，不引入 `pathe`、不改用 file URL — 單行、無新相依；vite 在 Windows 接受 `C:/...` 絕對路徑（unimport `dirs` 掃到的 composable 已是此形式）。
- **[工作區]** 以獨立 git worktree 進行，不切換主 checkout — 主 checkout 正由 tactile 分支的另一個工作階段使用。
- **[完成後]** commit + 開 PR（使用者選定）。

## Deviations
- 歸檔時 `wiki-lint` 對整個 wiki 回報既有的舊格式違規（168 頁含手寫 Changelog、References 與舊來源格式；`wiki-data/` 未納入版控）。這與本計畫無關，故未遷移整份 wiki、未執行 `wiki-build.py`；`dev/testing.md` 只做一句內容修正。建議另開計畫以 `wiki-changelog-migrate.py`／`wiki-refs-migrate.py` 遷移並重建。

## Impact Files
- `vitest.config.ts:19`、`vitest.config.ts:23`（`Unimport.vite` 的 `imports[].from`）— 改為引用模組層的 POSIX 路徑常數 `nuxtStubsPath`。
- `.kn-project/wiki/dev/testing.md` — 「自動匯入」補一句替身路徑須轉 POSIX 斜線的原因。

## Wiki Changes

| 頁面 | 日期 | 版本 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| `dev/testing.md` | 2026-11-12 | 4.6.4.2 | Windows 上替身匯入路徑的反斜線被跳脫，改為 POSIX 斜線 | [#78](https://github.com/KNightING/camelot-nuxt-layer/issues/78) | — |

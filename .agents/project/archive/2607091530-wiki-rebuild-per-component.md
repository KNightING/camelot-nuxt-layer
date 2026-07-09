<!-- REMINDER: Relative Paths Only! -->
# Plan: 2607091530 - Wiki 重建：每個 component/composable 獨立 API 頁 + 矩陣索引

- Created: 2026-07-09 15:30
- Branch: main
- Status: Done
- Completed: 2026-07-09 16:10

## Goals

重建 wiki：為**全部** ~89 component + ~48 composable **各寫一頁**詳細 API（props / emits / v-model / slots / exposed / 回傳），並以**矩陣清單**索引。

## Architecture

- `wiki/components/<Name>.md`（子資料夾以 `<Sub>-<Name>.md` 命名）：每個元件一頁。
- `wiki/composables/<name>.md`：每個 composable 一頁。
- `wiki/components.md` / `wiki/composables.md`：矩陣索引（連結到各頁）。
- `wiki/index.md`：hub，連到兩個矩陣 + 既有 topic 頁（保留 theme-system 等）。
- 以多 subagent 並行產生各頁（讀原始碼萃取 API），主控組矩陣索引。

## Verification

- 抽查數頁 props/emits/v-model 與原始碼一致；矩陣連結不斷。

## Outcome

- 產生 89 元件頁 + 48 composable 頁，共 137 個獨立 API 頁。
- 新增 `wiki/components.md`、`wiki/composables.md` 分類矩陣索引。
- `wiki/index.md` 改為 hub（內嵌大矩陣改指向兩矩陣頁，保留模組/server/架構/主題頁）。
- 抽查 `Table.md`、`useCamelotToast.md` props/回傳/型別與原始碼一致。
- Commit `7ea118b`，已推送 main（142 files changed）。

## References

- 元件：`app/components/Camelot/**`；composable：`app/composables/**`

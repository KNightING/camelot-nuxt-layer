<!-- REMINDER: Relative Paths Only! -->
# Plan: 2607091530 - Wiki 重建：每個 component/composable 獨立 API 頁 + 矩陣索引

- Created: 2026-07-09
- Branch: main
- Status: In Progress
- Completed: [Wait for Finish]

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

## References

- 元件：`app/components/Camelot/**`；composable：`app/composables/**`

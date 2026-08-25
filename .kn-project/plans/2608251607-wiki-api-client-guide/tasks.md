# Tasks for 2608251607

## Phase 0 — 調查
- [x] 盤點既有 wiki 對 API 的描述（`composables/useBaseApi.md` 為 API 參考，無情境指南）
- [x] 自原始碼取得佐證（`useBaseApi.ts` 的選項、四種取用方式、refresh 鎖、cache/date/abort 機制）
- [x] 確認本 repo 既有的 `BaseApi` 子類範例（`.playground/app/composables/useTestApi.ts`）

## Phase 3 — 執行
- [x] 撰寫 `wiki/features/api-client.md`（交由 kn:project:wikification）
- [x] 更新 `index.md` 功能清單
- [x] `features/composables.md` 與 `composables/useBaseApi.md` 補交叉連結

## Phase 4 — 驗證
- [x] 相對連結皆可解析（8/8）、Quick Navigation bar 以 `[🏠 Wiki]` 結尾、`## Summary` 置於 H1 之後
- [x] 全頁不含外部參考專案的任何可辨識資訊（關鍵字掃描為空）

## Phase 3b — 迭代：目錄結構與索引正規化
- [x] `wiki/components/` → `wiki/features/components/`（91 頁）、`wiki/composables/` → `wiki/features/composables/`（52 頁），以 `git mv` 保留歷史
- [x] 重寫受影響的相對連結：被搬移頁 143 頁、`features/` 頂層頁 6 頁、`index.md`
- [x] `index.md` 主題頁清單改為純連結、依路徑 ASCII 排序（並補回先前漏列的 `pagination-virtualscroll-carousel`、`progress-components`）
- [x] 為 `features/` 下全部 165 頁補齊 `## Summary`（143 頁由既有引言機械轉換、13 頁自撰、既有 9 頁已有）
- [x] 修正 `features/i18n-locales.md:92` 的巢狀連結語法錯誤（既有缺陷）

## Phase 4b — 驗證
- [x] 全 wiki 167 頁連結掃描：唯一未解析者為 `index.md` 的語言切換佔位連結（`lang/en-US/`，標註尚未建立）
- [x] `features/` 下無任何頁面缺少 `## Summary`
- [x] `.kn-project/project.md` 的 wiki 連結全部指向 `features/` 頂層或 `index.md` / `environment.md`，不受搬移影響

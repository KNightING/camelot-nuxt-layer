# 2608251607 - wiki-api-client-guide

- Created: 2026-08-25 16:07 / Archived: 2026-08-25 17:20
- Issue: KNightING/camelot-nuxt-layer#33

## Summary

新增 `wiki/features/api-client.md`（API 用戶端情境導向指南），並在同一輪迭代中完成 Wiki 目錄結構正規化與檢索契約補齊。指南以「應用層 API 類別」為建議做法，補上原本只有 API 參考、沒有組建方式的缺口。結構面則把根層的 `components/`（91 頁）與 `composables/`（52 頁）移入 `features/`，重寫全部受影響的相對連結，並為 `features/` 下 165 頁補齊 `## Summary`——此前僅 9 頁具備，Phase 0 賴以檢索的 `grep ^## Summary` 形同失效。不含任何原始碼變更。

## Cross-Repo Scope

無（單一 repo）。

## Key Decisions

- 指南與參考分兩頁：`features/api-client.md` 放情境導向組建方式，`composables/useBaseApi.md` 維持 API 參考，兩頁互連 — 沿用既有分工（如 `error-handling.md` 與 `useCamelotError.md`）。
- 以使用者偏好的寫法作為建議做法：`class XxxApi extends BaseApi` + 建構子集中設定 + 每端點具名方法回傳請求物件（不直接 `.fetch()`）+ URL 與參數用 getter — 該寫法本 repo 原生支援，`.playground/app/composables/useTestApi.ts` 已是同型範例。
- 使用者提供的外部參考專案僅用於理解偏好方向，其內容一概不寫入本 repo — 依使用者明確指示；範例一律改用本 repo 既有檔案與泛用端點。
- 目錄搬移以 `git mv` 執行，`archive/` 內提及舊路徑之處不予修改 — 歸檔是當時的事實紀錄，追溯改寫會讓歷史與當下混淆。
- `index.md` 不逐頁列出 143 個元件／composable 連結 — `features/components.md` 與 `features/composables.md` 兩張清單矩陣本身即模組索引，重複列舉會製造兩份必然漂移的清單。此為對「模組子資料夾應有 `### ${module}` 子區塊」的刻意偏離。

## Deviations

- 原計畫僅含新增指南頁一項；執行中使用者要求「一併處理」先前提出的目錄結構與索引格式問題，故以迭代方式擴充範圍（搬移 143 頁 + 連結重寫 + Summary 補齊）。
- 順帶修正 `features/i18n-locales.md` 既有的巢狀連結語法錯誤（`[[locale]]([useLocale](./locale.md))`）——屬 wikification 強制的斷鏈檢查所發現。
- `index.md` 保留專案概覽表格與架構圖，僅將「主題頁」清單正規化為純連結。全面改寫 `index.md` 為純索引會損失既有內容，且不在本次範圍。

## Impact Files

- `.kn-project/wiki/features/api-client.md` (new) — API 用戶端使用指南。
- `.kn-project/wiki/features/components/`（91 頁）、`.kn-project/wiki/features/composables/`（52 頁）— 自 wiki 根層搬入，並重寫 `../index.md` → `../../index.md`、`../features/X.md` → `../X.md`、原始碼引用多一層等相對路徑。
- `.kn-project/wiki/index.md` — 主題頁清單改為純連結、依路徑排序；補回漏列的兩頁；元件／composable 連結改指 `features/` 下新位置。
- `.kn-project/wiki/features/*.md`（頂層 6 頁）— `../components|composables/` 改為 `./components|composables/`。
- `.kn-project/wiki/features/**/*.md`（165 頁）— 補齊 `## Summary`（143 頁機械轉換、13 頁自撰）。
- `.kn-project/wiki/features/composables.md`、`.kn-project/wiki/features/composables/useBaseApi.md` — 與新指南頁互相連結。

## Details

驗證：全 wiki 167 頁連結掃描，唯一未解析者為 `index.md` 的語言切換佔位連結（`lang/en-US/`，本就標註尚未建立）；`features/` 下無任何頁面缺少 `## Summary`；`.kn-project/project.md` 的 wiki 連結全部指向 `features/` 頂層或 `index.md` / `environment.md`，不受搬移影響。新頁另以關鍵字掃描確認不含任何外部參考專案的可辨識資訊。

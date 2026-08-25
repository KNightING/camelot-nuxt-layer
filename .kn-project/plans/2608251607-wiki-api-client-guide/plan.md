<!-- REMINDER: Relative Paths Only! No file:///c:/... -->
# Plan: 2608251607 - wiki-api-client-guide

- Created: 2026-08-25
- Branch: docs/2608251607-wiki-api-client-guide
- Issue: KNightING/camelot-nuxt-layer#33
- Status: In Progress
- Completed: [Wait for Finish]

## Goals

補一頁 `wiki/features/api-client.md`，作為 API 用戶端的**情境導向使用指南**。現況 `wiki/composables/useBaseApi.md` 是 API 參考（有哪些選項、回傳什麼），缺的是「該怎麼組出一支專案的 API 層」：如何以 `BaseApi` 建立應用層 API 類別、四種取用方式（`useFetch` / `useBFetch` / `useLFetch` / `fetch`）各自的適用時機、refresh token 怎麼接、與串流與錯誤處理的分工。

**迭代追加（使用者於執行中指定「一併處理」）**：

2. **Wiki 目錄結構正規化**：`wiki/` 根層目前除 `index.md` / `environment.md` 外還有 `components/`（91 頁）與 `composables/`（52 頁），違反 wikification 規範「根層僅保留入口頁，其餘一律置於 `features/`」。改為 `features/components/` 與 `features/composables/`，並重寫所有受影響的相對連結。
3. **`index.md` 功能索引格式正規化**：規範要求純連結、依路徑 ASCII 排序，現況為主題分群 + 帶說明文字。

**非目標**：不改任何原始碼；不重寫 `useBaseApi.md` 的 API 參考表（兩頁分工：參考在 composable 頁，指南在 feature 頁）；不改寫 `archive/` 內的歷史敘述（那是當時的事實紀錄，不應追溯修改）。

## Architecture

新頁 `wiki/features/api-client.md` 結構（內容一律以本 repo 原始碼為依據）：

1. `## Summary`（wikification 規範必填，1–4 行）
2. **組成與分工**：`useBaseApi`（工廠）／`BaseApi`（類別）／`useApiFetch`（單次請求）三者關係，以 Mermaid 呈現一次請求的流轉。
3. **建立應用層 API 類別**：以 `class XxxApi extends BaseApi` 為主要建議寫法——建構子集中 `baseURL`、`headers`、攔截器與 refresh token 設定；每支端點一個具名 public 方法，回傳 `this.api.get<Resp>(...)` 的物件而**不直接 `.fetch()`**，讓呼叫端自行選擇取用方式。範例骨架取自本 repo 既有的 `.playground/app/composables/useTestApi.ts`。
4. **URL 與參數的響應式寫法**：`Url` 型別支援 getter（`() => \`/users/${id}\``），`query` / `body` 可傳 ref 或 getter，配合 `useFetch` 系列才會隨依賴自動重取。
5. **四種取用方式的選擇**：`useFetch`（原生包裝）／`useBFetch`（多 `idle`/`pending`/`success`）／`useLFetch`（懶載入，`immediate:false`）／`fetch`（命令式、可傳 `AbortSignal`），並列出各自適用情境。
6. **Base 設定與單次覆寫**：`baseOptions` 與各次 `options` 為淺層合併（`options` 覆寫），攔截器陣列亦然——需注意是整個陣列被取代而非合併。
7. **認證與 refresh token**：`autoRefreshToken` + `refreshTokenHandler` + `shouldRefreshToken` + `maxRefreshRetry`；模組層 `Map` 對同一 handler 共用一把鎖；`useBasicTokenRequest` / `useBearerTokenRequest` 兩個現成攔截器。
8. **`ignoreResponseError` 的影響**：開啟後 4xx/5xx 會走 `onResponses` 而非 `onResponseErrors`，攔截器要據此擺放。
9. **其他機制**：`contentType`（`Json` / `MultiPartFormData`）、`cachePolicy: 'cache'` 需自行設 key（走 `useNuxtData`）、`transDateKeys` 日期還原、`addSecureHeaderRequest` 安全標頭。
10. **與其他系統的分工**：串流走 `useFetchStream` / `useFetchJSONLinesStream`；可自動回復的 401 在 API 層就地處理，其餘錯誤交給 `useCamelotError`（連結既有的 `features/error-handling.md`）。
11. `## References` 與 Quick Navigation bar（依 wikification 規範）。

Wiki 的結構、導覽列、索引更新一律交由 `kn:project:wikification` 執行。

### 4. 目錄搬移與連結重寫規則

搬移：`wiki/components/` → `wiki/features/components/`、`wiki/composables/` → `wiki/features/composables/`（以 `git mv` 保留歷史）。

連結重寫（樣式已逐一盤點，數量為實際命中數）：

| 位置 | 原樣式 | 新樣式 | 數量 |
| :--- | :--- | :--- | :--- |
| 被搬移頁 | `](../index.md)` | `](../../index.md)` | 143 |
| 被搬移頁 | `](../features/X.md)` | `](../X.md)` | 18 |
| 被搬移頁 | `](../../../app/...)` | `](../../../../app/...)` | 3 |
| 被搬移頁 | `](./X.md)`（同層兄弟） | 不變 | 22 |
| 被搬移頁 | `](../composables/X.md)`、`](../components/X.md)` | 不變（相對關係未變） | 6 |
| `features/*.md` | `](../components/X.md)`、`](../composables/X.md)` | `](./components/X.md)`、`](./composables/X.md)` | 167 |
| `index.md` | `](./components/X.md)`、`](./composables/X.md)` | `](./features/components/X.md)` 等 | 依實際命中 |

`archive/` 內提及舊路徑之處**不修改**——那是歷史紀錄。

## Cross-Repo Scope

- **本計畫所屬 repo**: `camelot-nuxt-layer`
- **參與 repo 與職責**: 無（單一 repo）
- **執行順序相依**: 無（單一 repo）
- **跨 repo 檔案指涉**: 無

## Impact Files

- `.kn-project/wiki/features/api-client.md` (new) — 本次要補的指南頁。
- `.kn-project/wiki/index.md:96`-`:112`（功能連結清單）、`:117`（導覽列）— 新頁需納入索引。
- `.kn-project/wiki/features/composables.md:42`（`useBaseApi` 該列）— 補上指南頁的連結。
- `.kn-project/wiki/composables/useBaseApi.md`（`## 備註`）— 自參考頁指向指南頁。
- 佐證來源（唯讀，不修改）：`app/composables/useBaseApi.ts:98`（`ApiFetchOptions`）、`:468`（`useBaseApi`）、`:508`（`BaseApi`）、`:143`／`:185`（`cachePolicy` 與 `useNuxtData`）、`:147`（`transDateKeys`）、`:210`／`:382`（`ignoreResponseError` 下的 refresh 判斷）、`:427`（`fetch` 與 `AbortSignal`）、`:29`（refresh 鎖的模組層 `Map`）、`.playground/app/composables/useTestApi.ts`（既有的 `BaseApi` 子類範例）。

### 5. index.md 功能索引

主題頁清單改為純連結、依路徑 ASCII 排序、不帶說明文字（說明一律留在各頁的 `## Summary`）。`components/` 與 `composables/` 兩個模組維持以既有的清單矩陣頁（`features/components.md`、`features/composables.md`）作為模組索引，不在 `index.md` 逐頁列出 143 個連結——那會與矩陣頁完全重複。此為對規範「模組子資料夾應有 `### ${module}` 子區塊」的刻意偏離，理由記於 Key Decisions。

## Open Questions / 待確認事項

### Q1. 外部參考專案的處理 — 影響範圍：新頁內容

使用者提供了另一個專案的 `useAppPosApi.ts` 作為偏好用法的參考，並明確要求**不得在本專案描述該範例的任何資訊**。

- [x] 選項 A：僅以該參考理解偏好的寫法方向（應用層 API 類別 + 每端點具名方法 + 集中設定），新頁內容與範例**一律改用本 repo 既有的 `useTestApi.ts` 與泛用示意**（如 `/users`、`/orders`），不出現該專案的名稱、路徑、端點、型別或任何可辨識資訊　(依使用者指示，唯一可行做法)
- **決議**：選項 A　狀態：✅ 已確認

### Q2. 頁面歸屬 — 影響範圍：wiki 結構

- [x] 選項 A：新增 `features/api-client.md`，`composables/useBaseApi.md` 維持 API 參考不動，兩頁互相連結　(建議，理由：符合現有分工——`features/` 放情境指南、`composables/` 放 API 參考，如 `error-handling.md` 與 `useCamelotError.md` 的關係)
- [ ] 選項 B：不新增頁面，直接把指南內容併進 `composables/useBaseApi.md`
- **決議**：選項 A　狀態：✅ 已確認

## Key Decisions

- **[使用者指定・迭代]** 一併處理 Wiki 目錄結構正規化與 `index.md` 索引格式 — 理由：使用者於執行中明確要求「一併處理」，且已知悉搬移規模（約 143 頁 + 連結重寫）。
- **[執行中]** `archive/` 內提及舊 wiki 路徑之處不予修改 — 理由：歸檔是當時的事實紀錄，追溯改寫會讓歷史與當下混淆；未來檢索若循舊路徑找不到檔案，`index.md` 與矩陣頁足以導向新位置。
- **[執行中]** `index.md` 不逐頁列出 143 個元件／composable 連結 — 理由：`features/components.md` 與 `features/composables.md` 兩張清單矩陣本身就是模組索引，於 `index.md` 重複列舉只會製造兩份必然漂移的清單。此為對「模組子資料夾應有 `### ${module}` 子區塊」的刻意偏離。
- **[Q2]** 新增 `features/api-client.md`，`composables/useBaseApi.md` 維持 API 參考 — 理由：沿用既有分工（features 放情境指南、composables 放 API 參考）。
- **[使用者指定]** 以使用者偏好的寫法作為 wiki 的**建議做法**：應用層 API 類別（`class XxxApi extends BaseApi`）+ 建構子集中設定 + 每端點具名方法回傳 ApiFetch 物件（不直接 `.fetch()`）+ URL/參數用 getter — 理由：使用者明確要求把其偏好納入 wiki；該寫法本 repo 的 `useBaseApi` 原生支援，且既有的 `.playground/app/composables/useTestApi.ts` 已是同型範例。
- **[Q1]** 外部參考專案僅用於理解偏好方向，其內容一概不寫入本 repo — 理由：使用者明確指示不得在本專案描述該範例的任何資訊。

## Git Completion Policy

- Issue 綁定時，PR body 必須含 `Closes #${N}`，歸檔完成後於該 issue 張貼由 archive 蒸餾的結案留言 (Rule 20)。
- 經核准的 Commit 後，完成階段會執行 `git rebase main` 與 `git push --force-with-lease --force-if-includes`。
- PR/archive order: Archive automatically triggered on PR request。

## References

- `.kn-project/wiki/composables/useBaseApi.md` — 既有的 API 參考頁
- `.kn-project/wiki/features/error-handling.md` — 錯誤處理分工，新頁需連結

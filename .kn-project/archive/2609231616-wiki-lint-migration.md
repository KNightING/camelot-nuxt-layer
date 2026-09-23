# 2609231616 - wiki-lint-migration

- Created: 2026-09-23 16:16 / Archived: 2026-09-23
- Issue: KNightING/camelot-nuxt-layer#45
- Milestone: N/A / Base Branch: main

## Summary
整個 `.kn-project/wiki/` 遷移至新版 wikification 規範，`wiki-lint.py` 硬閘由 1030 項歸零，並產出可雙擊開啟的 `.kn-project/wiki.html`。
起因是 wiki 從未依新版規範整理：169 頁未列入索引、幾乎全部缺 Changelog 與 References 表格、Summary 多段、正文夾帶路徑，且有 4 頁是「批次改動紀錄」而非現況。
作法：機制頁搬到 `platform/`、Layer 整合搬到 `dev/`；批次頁拆進對應頁後刪除；約 170 頁由 8 個子代理平行依 writing-style 改寫並逐頁對照原始碼校正事實；index 改為純連結分段索引；mermaid 轉 json diagram 並產生 svg。
過程中依原始碼修正大量過時描述，並發現十餘項疑似程式碼缺陷（見 Details），wiki 只記錄現行行為、程式碼未改。

## Cross-Repo Scope
無（單一 repo）

## Key Decisions
- **[Q0]** 不指定 milestone，Base Branch = `main`。
- **[Q1]** 機制頁搬到 `platform/`（theme-system、color-scheme、api-client、error-handling、i18n-locales、locale、layering、overlay-scrollbar），`layer-integration` 搬到 `dev/`；元件與 composable API 頁留在 `features/`（元件庫的元件即功能）。
- **[Q2]** 批次紀錄型頁（datepicker-time-aqua-toast、pagination-virtualscroll-carousel、field-label-and-form-controls、layout-data-components）拆進對應元件／主題頁後刪除；index 的概覽、模組、伺服器、架構圖移到新頁 `platform/architecture.md`（21 節點的圖拆成三張以符合 ≤ 12 節點）。
- **[Q3]** 逐頁改寫以子代理平行處理：階段一單一代理拆批次頁（避免與階段二搶同一檔），階段二 8 個代理負責互不重疊的頁集，共用一份改寫規範。
- **[Q4]** 完成條件為硬閘歸零；警告順手修，剩餘列入報告。
- **[Phase 0]** archive 內的舊 wiki 連結不改 — 歸檔是歷史紀錄。
- **[執行中]** 搬頁以自寫腳本重算全 wiki 與 README／AGENTS／project.md 的相對連結，讀寫保留原本換行字元（project.md 為 CRLF／LF 混用；第一次以 Python 文字模式讀寫把 CRLF 改成 LF，已還原重做）。
- **[執行中]** API 參考頁沿用 `## Props`、`## Emits` 等表格段作為 Summary 後第一段（lint 只給警告）；composable 頁以「運作方式」開頭。
- **[執行中]** 名稱過寬的 H1 改為中文名詞片語（如 `useCamelotMenuItemTheme` →「選單項主題」、`CustomColorSchemeProvider` →「區域配色提供者」），完整名稱寫在 Summary。
- **[執行中]** `wiki-changelog.py` 以 git 推導頁集時漏掉 rename 的頁（platform／dev 9 頁），改以 `--pages` 明列補上。

## Deviations
- `wiki-refs-migrate.py` 轉換 0 頁：舊頁根本沒有 References 定義（路徑直接寫在正文），References 表格全部在改寫時從頭建立。
- 原計畫以腳本補導覽列；實際由子代理在改寫時一併處理。
- Changelog 的 PR 欄留「—」：Changelog 在 PR 建立前寫入。

## Impact Files
- `.kn-project/wiki/index.md` — 純連結分段索引（功能／平台／開發）
- `.kn-project/wiki/environment.md` — env 頁型改寫；修正變數名 `NUXT_PUBLIC_REPLACE_END_SPLASH`、建置期設定說明、CSP 基底
- `.kn-project/wiki/platform/*.md`（9 頁，含新頁 `architecture.md`）、`.kn-project/wiki/dev/layer-integration.md`
- `.kn-project/wiki/features/*.md`（9 頁主題頁；刪除 4 頁批次頁）
- `.kn-project/wiki/features/components/*.md`（96 頁，含新頁 `Internal-FieldFrame.md`）
- `.kn-project/wiki/features/composables/*.md`（52 頁）
- `.kn-project/wiki/**/*.svg`（17 張圖）、`.kn-project/wiki.html`（`wiki-build.py` 產物）
- `README.md`、`AGENTS.md`、`.kn-project/project.md` — wiki 連結隨搬移更新；project.md 新增架構頁入口

## Details
子代理對照原始碼時發現的疑似程式碼缺陷（wiki 已如實記錄現行行為，程式碼未改，供日後另開計畫）：

| 位置 | 現象 |
|---|---|
| useValueValidation | email 正規表示式字元類寫成雙反斜線：允許反斜線、拒絕連字號（`a-b@x.com` 失敗） |
| useFetchJSONLinesStream | 結尾沒有換行的最後一行不會被解析；`finishOnParseError` 讀原始值，只有明確 `true` 才中止 |
| useInputValidationController | 移除從未加入的 validator 會誤刪最後一個；介面沒有 `hasInvalid` |
| useFileToDataURL | 讀檔失敗時 Promise 永不結束，`pending` 停在 `true` |
| useIsValidKey | 參數型別宣告為 `object`，型別守衛把 key 收窄成 `never` |
| useLazyImage | `src` 為空時狀態卡在 loading |
| useObject | `diff` 在舊值 `null`、新值為物件時拋 TypeError；`deepClone` 把 Map／Set 變成空物件 |
| useColor | `hexToRgba` 未帶 alpha 時除以 255 兩次，alpha 恆為 0 |
| useAutoLink | 未做 HTML 跳脫，搭配 `v-html` 有 XSS 風險 |
| useBlobDownload | object URL 從未釋放 |
| useCanvasConvert | `toBlob` 不接受格式參數，永遠輸出 PNG |
| useInfinitePage | 預設 `target = window` 在伺服器端失敗 |
| useDrawerCollapsed | 模組層 ref 在 SSR 時被所有請求共用 |
| RevealImage | `prefers-reduced-motion` 規則選到不存在的元素，動畫照播；平滑揭示依賴 RevealText 的 `@property` 註冊 |
| RippleEffect | `rippleColor` 只在更新時寫入，掛載時沒有，初次漣漪可能看不見 |
| Slider | `disabled` 時方向鍵仍可改值 |
| SlideTransitionGroup | `next` 可移到最後一項之後、沒有內容的索引 |
| DateV2 | `disableDaysOfWeekList`、`allowedDates` 宣告但未使用 |
| Input | `border`、`size` 宣告但無作用 |
| ImageV2 | `loaded` 事件宣告但從未發出；`src` 只在建立時讀一次 |
| 環境變數 | `NUXT_PUBLIC_ENV` Layer 內無人讀取；`@nuxt/kit` 未在 package.json 直接宣告 |

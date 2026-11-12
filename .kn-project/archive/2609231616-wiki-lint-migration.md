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

## Wiki Changes

| 頁面 | 日期 | 版本 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| `environment.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `dev/layer-integration.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/calendar.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/file-drop.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/progress-components.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/radio-and-groups.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/richtext-editor-image-dropzone.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/time-picker.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/timeline.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Aqua-Button.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Aqua-Checkbox.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Aqua-Input.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Aqua-Radio.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Aqua-Switch.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/BaseBottomSheetV2.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/BaseDialogV2.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Breadcrumb.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Breakpoints.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Button.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Carousel.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/CarouselIndicator.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/CascadeMenu.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Checkbox.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/CheckboxGroup.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/ColorSchemeProvider.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/ConfirmDialog.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Container.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Cupertino-Button.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Cupertino-Checkbox.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Cupertino-Input.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Cupertino-Radio.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Cupertino-Switch.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/CustomColorSchemeProvider.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/DateRangeV2.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/DateV2.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Drawer.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/DropImage.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/ErrorDialog.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Expanded.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/FieldLabel.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/FileChip.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/FileDropzone.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Gpu.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/IdxForm.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/ImageDropzone.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/ImageV2.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Input.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Internal-Calendar.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Internal-CascadeMenuPanel.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Internal-FieldFrame.md` | 2026-09-23 | — | 建立 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Internal-MenuItem.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Internal-PasswordToggle.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Internal-SheetHandle.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Internal-TimeField.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Internal-TimeRow.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Internal-TreeNode.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Internal-editor-ResizableImageView.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Loading.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Marquee.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Material-Button.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Material-Checkbox.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Material-Input.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Material-Radio.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Material-Switch.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Material3Provider.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Menu.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/NumberCounter.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/OverlayScrollbar.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Pagination.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/PopupV2.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/ProgressBar.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/ProgressCircle.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/ProgressStage.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Radio.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/RadioGroup.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/RevealImage.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/RevealText.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/RichTextEditor.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/RippleEffect.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/RippleTabs.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Scifi-Button.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Scifi-Checkbox.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Scifi-Frame.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Scifi-Input.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Scifi-Radio.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Scifi-Reticle.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Scifi-Switch.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Scrollbar.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/SelectV2.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Skeleton.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Slider.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Steps.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Switch.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Table.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Tabs.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Tag.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/TagGroup.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Textarea.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/TimeV2.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Timeline.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Toast.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Tooltip.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/Tree.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/components/VirtualScroll.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useAnchorLink.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useAutoLink.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useBaseApi.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useBaseUrl.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useBlobDownload.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useCamelotColorMode.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useCamelotError.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useCamelotFileDrop.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useCamelotMenuItemTheme.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useCamelotOverlayScrollbar.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useCamelotPickerTheme.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useCamelotRoleColorClass.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useCamelotRouter.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useCamelotTeleportTarget.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useCamelotTheme.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useCamelotToast.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useCamelotVirtual.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useCanvasConvert.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useColor.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useColorSchemeCssVars.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useCookieProxy.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useCurrentRoute.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useCustomColorScheme.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useDelay.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useDeviceBreakpoints.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useDrawerCollapsed.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useElCssVar.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useErrorRef.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useFetchJSONLinesStream.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useFetchStream.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useFileKey.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useFileToDataURL.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useFloat.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useInfinitePage.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useInputValidationController.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useIsValidKey.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useLazyImage.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useLoading.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useLocalStorageProxy.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useLocale.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useMaterial3ColorScheme.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useNumberThousandsSeparators.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useObject.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/usePiniaClear.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useRandom.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useRandomCatImg.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useRouteWrapper.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useScrollOnBottom.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useScrollParent.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useSessionStorageProxy.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useStorageProxy.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `features/composables/useValueValidation.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `platform/api-client.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `platform/architecture.md` | 2026-09-23 | — | 建立 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `platform/color-scheme.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `platform/error-handling.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `platform/i18n-locales.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `platform/layering.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `platform/locale.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `platform/overlay-scrollbar.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |
| `platform/theme-system.md` | 2026-09-23 | — | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

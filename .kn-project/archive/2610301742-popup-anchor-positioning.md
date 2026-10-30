# 2610301742 - popup-anchor-positioning

- Created: 2026-10-30 17:42 / Archived: 2026-10-30 18:40
- Issue: KNightING/camelot-nuxt-layer#68
- Milestone: 4.6.3.1 / Base Branch: 4.6.3.1

## Summary
浮層(PopupV2 → Select/Date/Time/DateRange、Tooltip、CascadeMenu)在瀏覽器支援時改用 CSS Anchor Positioning 由瀏覽器原生同步定位,消除「會跟隨但有延遲」;不支援時退回 JS 量測。
新增共用 composable `useCamelotAnchor`(支援偵測、唯一名稱、style)與單元測試;target 捲出捲動容器可視範圍時浮層一併隱藏;CascadeMenu 退回路徑補上內層捲動時重算。對外 props 與 slots 不變。

## Cross-Repo Scope
無（單一 repo）

## Key Decisions
- **[範圍]** 使用者選「兩個都做」:CSS Anchor Positioning + 降低 JS 退回路徑延遲;並納入 Tooltip 與 CascadeMenu。
- **[Q1]** CascadeMenu 維持視窗捲動即關閉 — 行為不變、風險低;跟隨只用於內層容器捲動與位移。
- **[Milestone]** 使用者手動輸入 `4.6.3.1`,沿用尚未併回主幹的版本分支(已含 #67);非標準格式,跳過版本檔同步。
- **[完成後]** commit + 開 PR(base 4.6.3.1)。
- **[架構]** PopupV2 外層容器以 anchor-size/anchor() 覆蓋 target,內層既有 top-full/bottom-full/left-0/right-0 與翻轉 class 不動;翻轉判斷(isBottom/isRight)改由 scroll/resize/尺寸變動更新,支援時不再跑 rAF。

## Deviations
- **JS 退回路徑(PopupV2、Tooltip)未改動**:合成器捲動造成的落後是 JS 量測的先天限制,無法在 JS 內消除,故只在 anchor 路徑根除;退回路徑維持原行為。CascadeMenu 退回路徑有補強(內層捲動重算)。
- **Tooltip anchor 路徑以 layout viewport 為準**,不修正行動裝置鍵盤造成的 visual viewport 位移;退回路徑仍保留。
- **CascadeMenu anchor 路徑不保留貼視窗邊緣 8px 留白**,改由 flip 處理翻轉。
- **vitest 有 2 個既有失敗檔**(`useDrawerCollapsed`、`useFileToDataURL`):`vitest.config.ts` 的 unimport 匯入路徑在 Windows 反斜線被吃掉,於未變動的 `main` 上同樣失敗,與本計畫無關,未處理。
- **wiki 未執行 wiki-build 與完整 lint**:既有 wiki 為舊格式(`## Changelog`、`## References`),全域硬閘違規 918 項為既有狀態;本計畫只就地修訂相關頁面並新增 `useCamelotAnchor` 頁(僅警告,無硬閘)。
- **實測限制**:headless Chromium 的程式捲動、位移、寬度變動兩路徑皆一幀內跟上;觸控/滾輪的合成器捲動無法程式量測,需真機確認(列於人工收尾事項)。

## Impact Files
- `app/composables/useCamelotAnchor.ts` (new) — 支援偵測、唯一名稱與 style
- `tests/composables/useCamelotAnchor.test.ts` (new) — 偵測與命名的單元測試
- `app/components/Camelot/PopupV2.vue` — anchor 定位(外層 style、寬度 style、停用輪詢)
- `app/components/Camelot/Tooltip.vue` — anchor 定位 + flip-block + 夾進視窗
- `app/components/Camelot/Internal/CascadeMenuPanel.vue` — anchor 定位與命令式 anchor 名稱;退回路徑補內層捲動重算
- `.kn-project/wiki/features/components/PopupV2.md`、`Tooltip.md`、`CascadeMenu.md`、`Internal-CascadeMenuPanel.md`、`features/composables/useCamelotAnchor.md` (new)、`features/composables.md`、`index.md` — 定位機制描述同步

## Wiki Changes

| 頁面 | 日期 | 版本 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| `features/components/CascadeMenu.md` | 2026-10-30 | 4.6.3.1 | 浮層改用 CSS Anchor Positioning,支援時由瀏覽器原生同步定位 | [#68](https://github.com/KNightING/camelot-nuxt-layer/issues/68) | [PR #0](https://github.com/KNightING/camelot-nuxt-layer/pull/0) |
| `features/components/Internal-CascadeMenuPanel.md` | 2026-10-30 | 4.6.3.1 | 浮層改用 CSS Anchor Positioning,支援時由瀏覽器原生同步定位 | [#68](https://github.com/KNightING/camelot-nuxt-layer/issues/68) | [PR #0](https://github.com/KNightING/camelot-nuxt-layer/pull/0) |
| `features/components/PopupV2.md` | 2026-10-30 | 4.6.3.1 | 浮層改用 CSS Anchor Positioning,支援時由瀏覽器原生同步定位 | [#68](https://github.com/KNightING/camelot-nuxt-layer/issues/68) | [PR #0](https://github.com/KNightING/camelot-nuxt-layer/pull/0) |
| `features/components/Tooltip.md` | 2026-10-30 | 4.6.3.1 | 浮層改用 CSS Anchor Positioning,支援時由瀏覽器原生同步定位 | [#68](https://github.com/KNightING/camelot-nuxt-layer/issues/68) | [PR #0](https://github.com/KNightING/camelot-nuxt-layer/pull/0) |
| `features/composables.md` | 2026-10-30 | 4.6.3.1 | 浮層改用 CSS Anchor Positioning,支援時由瀏覽器原生同步定位 | [#68](https://github.com/KNightING/camelot-nuxt-layer/issues/68) | [PR #0](https://github.com/KNightING/camelot-nuxt-layer/pull/0) |
| `features/composables/useCamelotAnchor.md` | 2026-10-30 | 4.6.3.1 | 建立 | [#68](https://github.com/KNightING/camelot-nuxt-layer/issues/68) | [PR #0](https://github.com/KNightING/camelot-nuxt-layer/pull/0) |

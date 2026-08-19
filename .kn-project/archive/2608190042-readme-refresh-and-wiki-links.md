# 2608190042 - readme-refresh-and-wiki-links

- Created: 2026-08-19 00:42 / Archived: 2026-08-19 01:20
- Issue: KNightING/camelot-nuxt-layer#27

## Summary

依原始碼重寫 `README.md`（149 → 261 行），修正全部過期敘述，並將深度內容導流至 `.kn-project/wiki/`。

原 README 尾註 `Last Updated: 2026-03-12`，依賴版本、i18n 範例、Drop Code 機制均已與程式碼脫節，且完全沒有 Wiki 連結。本次改以「入口導覽」定位重寫，同時納入使用者實際將本 Layer 接入新專案時回報的三項整合障礙。最關鍵的認知修正是：`extends: ['github:...']` 由 c12/giget 抓進消費端 `.c12/`，**該目錄不安裝 Layer 依賴**，Layer 的 import 沿 `node_modules` 上溯到消費端解析——故 README 的依賴清單是**必裝**而非建議，且原清單漏了 `@nuxt/kit`、`@tailwindcss/vite`、`@tiptap/*`、`date-fns`、`@iconify-json/*` 等實際被直接 import 的套件。

## Cross-Repo Scope

無（單一 repo）。

## Key Decisions

- **[Q1]** README 不硬編版本號，改指向 `package.json` — 理由：硬編數字是文件過期的主因。
- **[Q2]** 維持全繁體中文 — 理由：與既有 README / Wiki / `project.md` 一致。
- **[Q3]** 依賴清單**保留並改寫為「必裝 peer 依賴」**（推翻原本「刪除清單改指向 package.json」的建議）— 理由：c12/giget 不安裝 Layer 依賴，該清單是消費端跑得起來的前提，刪除會直接造成整合失敗。
- **[Q4]** README 只連 Wiki 四個入口（index / components / composables / environment）— 理由：主題頁清單已由 `wiki/index.md` 維護，重列會再次過期。
- **[Q5]** i18n 基底字典失效（見下方 F3）**不在本計畫修**，僅於 README 記為已知限制 — 理由：修好後 `zh`/`en` 會開始註冊並改變消費端 fallback 鏈，屬公開契約的行為變更，docs-only 的 PR 不應夾帶。
- **[Q6]** 不將 `@nuxt/kit` 加入本 repo 的 `package.json` — 理由：同 Q5 保持本 PR 純文件；Layer 自身 `pnpm dev` 目前可跑，非阻塞。
- **[執行中]** 必裝清單以「源碼直接 import 全域掃描」重建，不沿用舊 README 清單 — 理由：Rule 18，佐證優先於既有文件。
- **[執行中]** 移除「`SelectV2` iOS 17 Grid 動畫致虛擬列表不顯示之修正」條目 — 理由：Phase 4 驗證時於 `app/components/Camelot/SelectV2.vue` 找不到任何對應機制，虛擬捲動已改用 `@vueuse/core` 的 `useVirtualList`（`SelectV2.vue:323,394`）。無佐證即不得聲稱。
- **[執行中]** 改寫 UUID 條目 — 理由：`app/composables/useCamelotToast.ts:31` 已無條件使用 `Math.random()`，全專案無 `crypto.randomUUID()`，原本「回退機制」的描述不成立。

## 已知缺陷（未修，留待後續）

**F3 — Layer 基底字典 `i18n/locales/{en,zh}.json` 目前是死檔。**
`@nuxtjs/i18n` 的跨 layer 合併以 locale code 為鍵（`node_modules/@nuxtjs/i18n/dist/module.mjs:232` `mergeConfigLocales`），且各 layer 的 `file`/`files` 只在自己的 `langDir` 解析（同檔 `:226` `resolveRelativeLocales`）。本 Layer 於 `nuxt.config.ts:186-189` 宣告 `locales: []`，不貢獻任何 code，故兩份基底字典永不進入合併結果；消費端寫 `files: ['zh.json']` 疊加會用**消費端的** langDir 解析而 ENOENT。修法為在 Layer 的 `nuxt.config.ts` 補回 `{ code: 'zh', file: 'zh.json' }` / `{ code: 'en', file: 'en.json' }`。**使用者明確指示不開修復計畫**，現況因應方式為消費端自帶完整詞條。

**F2 附帶項** — 本 repo 的 `package.json` 亦未宣告 `@nuxt/kit`（僅由 `nuxt` 傳遞取得），修復時可一併處理。

## Deviations

- 原計畫僅涵蓋「README 過期內容」，執行中由使用者補入三項消費端整合實測（F1/F2/F3），使「建議依賴」章節的處置從「刪除」翻轉為「保留並升格為必裝清單」，並新增「常見整合失敗與排查」小節。
- Phase 4 驗證額外發現兩處**舊 README 既有的**不實敘述（SelectV2 iOS 17 修正、Toast UUID 回退），非計畫預期範圍，已一併修正並記錄於 Key Decisions。
- Q5/Q6 決議的後續修復計畫，經使用者於 Phase 5 明確指示**不建立**。

## Impact Files

- `README.md` — 全篇重寫為入口導覽結構（技術棧 / 安裝 / 必裝 peer 依賴 / 整合排查 / i18n / 主題 / 模組·Server·Middleware / 文件導覽 / 開發與 Drop Code / iOS / Tailwind Reset）。
- `package.json:4,16-45` — 未修改；作為必裝清單與版本敘述的唯一佐證來源。
- `nuxt.config.ts:8,130-171,186-189` — 未修改；分別佐證 `@tailwindcss/vite` 硬依賴、Drop Code 已移轉至 Oxc/Rolldown、i18n `locales: []` 缺陷。
- `modules/{buildHook,echartModule,tappay}.ts:1` — 未修改；佐證 `@nuxt/kit` 為必裝。
- `.kn-project/project.md`、`.kn-project/wiki/index.md` — 版本號 `4.3.1.12` 落後於 `package.json` 的 `4.5.2.0`，於 Phase 5 交 wikification 同步。

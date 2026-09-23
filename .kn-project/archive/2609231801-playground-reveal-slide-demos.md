# 2609231801 - playground-reveal-slide-demos

- Created: 2026-09-23 18:01 / Archived: 2026-09-23
- Issue: KNightING/camelot-nuxt-layer#49
- Milestone: N/A / Base Branch: main

## Summary
playground 新增「Transitions」卡片，示範 SlideTransitionGroup、RevealImage 與 RevealText，並藉此實機確認 #48 對前兩者的修正。
SlideTransitionGroup 提供上一張／下一張與索引，到頭尾按鈕停用；RevealImage、RevealText 各示範 auto、hover、manual 三種觸發。
實測確認 `next` 停在最後一項、RevealImage 自行註冊的 `@property --p` 生效且動畫平滑插值、減少動畫規則作用在 `::after`；四主題版面正常。

## Cross-Repo Scope
無（單一 repo）

## Key Decisions
- **[Q0]** 不指定 milestone，Base Branch = `main`。
- **[Q1]** 一併加入 RevealText 範例（同系列、同一張卡片）。
- **[執行中]** RevealText 的文字底色在元件內固定為深色，範例放在淺色底上、填色用主題主色，並以行內樣式調成 24px、不換行（Sci-Fi 等寬字體下 28px 會換行）。
- **[執行中]** 減少動畫無法以瀏覽器工具模擬，改以檢查 RevealImage 樣式表的媒體查詢規則確實作用在 `::after` 並能命中頁面元素。

## Deviations
- 無 wiki 變更：已檢查 SlideTransitionGroup、RevealImage、RevealText 三頁，沒有與 playground 範例相關的過時描述。

## Impact Files
- `.playground/app/pages/index.vue` — Transitions 卡片（Carousel 卡片之後）與 `slideGroup`、`slideIndex`、`slideItems`、`revealTriggers`、`revealPlay` 狀態

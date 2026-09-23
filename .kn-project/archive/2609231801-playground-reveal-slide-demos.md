# 2609231801 - playground-reveal-slide-demos

- Created: 2026-09-23 18:01 / Archived: 2026-09-23
- Issue: KNightING/camelot-nuxt-layer#49
- Milestone: N/A / Base Branch: main

## Summary
playground 新增「Transitions」卡片示範 RevealImage 與 RevealText，並移除功能與 Carousel 重疊的 SlideTransitionGroup 元件（破壞性變更）。
RevealImage、RevealText 各示範 auto、hover、manual 三種觸發；實測確認 #48 的修正：RevealImage 自行註冊的 `@property --p` 生效且動畫平滑插值、減少動畫規則作用在 `::after`，四主題版面正常。
原計畫也為 SlideTransitionGroup 加範例（並實測 `next` 停在最後一項），使用者看過後判斷已有 Carousel、此元件沒有必要，改為直接刪除元件、wiki 頁與範例。

## Cross-Repo Scope
無（單一 repo）

## Key Decisions
- **[Q0]** 不指定 milestone，Base Branch = `main`。
- **[Q1]** 一併加入 RevealText 範例（同系列、同一張卡片）。
- **[迭代 1]** 刪除 SlideTransitionGroup 元件（Layer 內部無任何使用，功能由 Carousel 涵蓋）— 使用者選擇「直接刪除」而非標記棄用；併進同一個 PR #50。
- **[迭代 1]** 保留 `shared/types/items.ts` 的 `Items`／`Item` 型別 — 雖然只有被刪除的元件使用，但它是自動匯入的公開型別，消費端可能在用，刪除超出本次範圍。
- **[執行中]** RevealText 的文字底色在元件內固定為深色，範例放在淺色底上、填色用主題主色，並以行內樣式調成 24px、不換行（Sci-Fi 等寬字體下 28px 會換行）。
- **[執行中]** 減少動畫無法以瀏覽器工具模擬，改以檢查 RevealImage 樣式表的媒體查詢規則確實作用在 `::after` 並能命中頁面元素。

## Deviations
- 範圍由「兩元件加範例」變為「RevealImage／RevealText 加範例＋刪除 SlideTransitionGroup」，經使用者指示。
- archive 內提及 SlideTransitionGroup 的舊紀錄不改（歷史紀錄）。

## Impact Files
- `.playground/app/pages/index.vue` — Transitions 卡片（Carousel 卡片之後，兩欄）與 `revealTriggers`、`revealPlay` 狀態
- `app/components/Camelot/SlideTransitionGroup.vue` — 刪除
- `.kn-project/wiki/features/components/SlideTransitionGroup.md` — 刪除
- `.kn-project/wiki/features/components.md`、`.kn-project/wiki/index.md` — 移除對應列
- `.kn-project/wiki.html` — 重新建置

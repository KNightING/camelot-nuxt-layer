# 2609231922 - remove-items-type

- Created: 2026-09-23 19:22 / Archived: 2026-09-23
- Issue: KNightING/camelot-nuxt-layer#51
- Milestone: N/A / Base Branch: main

## Summary
刪除 `shared/types/items.ts` 的 `Items`、`Item` 型別（破壞性變更）。
它們原本只供 #50 移除的 SlideTransitionGroup 使用；上一計畫因其為自動匯入的公開型別而保留，使用者隨後指示一併刪除。刪除前確認全 repo 無引用，刪除後 typecheck、lint、test 皆通過。

## Cross-Repo Scope
無（單一 repo）

## Key Decisions
- **[核准閘]** 不指定 milestone，Base Branch = `main`；完成後 commit + 開 PR。
- **[Phase 0]** 使用者指示刪除，推翻 2609231801 保留公開型別的決策。

## Deviations
None

## Impact Files
- `shared/types/items.ts` — 刪除（無 wiki 描述需更新）

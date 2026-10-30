# 2610301658 - upgrade-minor-patch-deps

- Created: 2026-10-30 16:58 / Archived: 2026-10-30 17:30
- Issue: KNightING/camelot-nuxt-layer#66
- Milestone: 4.6.3.1 / Base Branch: 4.6.3.1

## Summary
升級 Patch/Minor 套件:pinia 4.1.0、eslint 10.13.0、@tiptap/* 3.32.1(7 個)、@types/node 26.6.6、vue-tsc 3.3.13、@pinia/nuxt 1.0.3、@vue/compiler-sfc 3.5.44、@iconify-json/material-symbols 1.2.97。
僅動依賴版本與 lockfile,無程式邏輯變更;lint、typecheck、build 皆通過。Major 套件(@vueuse/* 15、happy-dom 21、unimport 7、unplugin-icons 24、vitest 5、typescript 7)另案。

## Cross-Repo Scope
無（單一 repo）

## Key Decisions
- **[Milestone]** 使用者手動輸入 `4.6.3.1`(非標準格式,一律接受);版本分支 `4.6.3.1` 自 `main` 切出;Rule 24 跳過版本檔同步。
- **[範圍]** 只升 Patch/Minor;Major 另案。
- **[完成後]** commit + 開 PR(預設)。

## Deviations
Iteration:升級 tiptap 3.32.1 後 lockfile 出現兩份 `prosemirror-model`(1.25.11/1.25.12),dev 執行時 tiptap 警告「loaded more than once」;以 `pnpm dedupe` 合併為 1.25.12(lockfile 另有其他套件重複項一併合併),重驗 lint、typecheck、build 與 playground 皆通過。`pnpm-workspace.yaml` 的 `minimumReleaseAgeExclude` 未被擋,無需更動;build 產生的 `.playground/app/components.d.ts` 雜訊已還原未提交。

## Impact Files
- `package.json:23-25,28,35,39,41-47,53` — 上列套件版本字串
- `pnpm-lock.yaml` — 重新產生

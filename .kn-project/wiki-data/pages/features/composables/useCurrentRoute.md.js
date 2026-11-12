WIKI_PAGE("features/composables/useCurrentRoute.md",{
"title":"useCurrentRoute",
"summary":"`useCurrentRoute()` 回傳 router 目前路由的當下值，用來避開 Nuxt 的 `useRoute()` 在部分情境沒有即時更新的問題。回傳的是一次性的路由物件，不是 ref，之後的導覽不會反映到已取得的值。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# useCurrentRoute\n\n## Summary\n\n`useCurrentRoute()` 回傳 router 目前路由的當下值，用來避開 Nuxt 的 `useRoute()` 在部分情境沒有即時更新的問題。回傳的是一次性的路由物件，不是 ref，之後的導覽不會反映到已取得的值。\n\n## 運作方式\n\n1. 呼叫 useRouter 取得 router。\n2. 讀取 currentRoute 的值並直接回傳。\n3. 需要最新路由時要重新呼叫；要在模板或 computed 中追蹤變化，請在 computed 內呼叫。\n\n來源：1. [useCurrentRoute.ts](../../../../app/composables/useCurrentRoute.ts)\n\n## 用法\n\n```ts\nconst path = computed(() => useCurrentRoute().path)\n```\n\n## 簽章\n\n```ts\nuseCurrentRoute(): RouteLocationNormalizedLoaded\n```\n\n## 回傳\n\n| 名稱 | 型別 | 說明 |\n| --- | --- | --- |\n| （回傳值） | `RouteLocationNormalizedLoaded` | 呼叫當下的路由資訊 |\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

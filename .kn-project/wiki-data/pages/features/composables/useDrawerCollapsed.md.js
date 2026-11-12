WIKI_PAGE("features/composables/useDrawerCollapsed.md",{
"title":"useDrawerCollapsed",
"summary":"`useDrawerCollapsed()` 回傳一個跨元件共享的抽屜收合狀態 ref，預設為收合。狀態以 Nuxt 的 useState 保存：瀏覽器端所有呼叫端讀寫同一份，伺服器端每個請求各自一份。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md", "archive/2609231702-fix-wiki-review-code-defects.md"],
"changelog":[{"plan": "2609231702-fix-wiki-review-code-defects", "date": "2026-09-23", "version": "—", "note": "修正程式碼缺陷後更新為修正後的行為", "issue": "[#47](https://github.com/KNightING/camelot-nuxt-layer/issues/47)", "pr": "—"}, {"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# useDrawerCollapsed\n\n## Summary\n\n`useDrawerCollapsed()` 回傳一個跨元件共享的抽屜收合狀態 ref，預設為收合。狀態以 Nuxt 的 useState 保存：瀏覽器端所有呼叫端讀寫同一份，伺服器端每個請求各自一份。\n\n## 運作方式\n\n1. 以固定的 key 呼叫 Nuxt 的 useState，初始值為 `true`。\n2. 瀏覽器端每次呼叫都取得同一份狀態，任一處改值，其他使用處同步更新。\n3. 伺服器端渲染時，每個請求各自一份狀態，請求之間互不影響。\n4. 狀態不持久化，重新整理後回到收合。\n\n來源：1. [useDrawerCollapsed.ts](../../../../app/composables/useDrawerCollapsed.ts)\n\n## 用法\n\n```ts\nconst collapsed = useDrawerCollapsed()\ncollapsed.value = false\n```\n\n## 簽章\n\n```ts\nuseDrawerCollapsed(): Ref<boolean>\n```\n\n## 回傳\n\n| 名稱 | 型別 | 說明 |\n| --- | --- | --- |\n| （回傳值） | `Ref<boolean>` | 共享的收合狀態，`true` 為收合 |\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

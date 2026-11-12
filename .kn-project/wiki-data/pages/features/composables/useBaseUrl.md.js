WIKI_PAGE("features/composables/useBaseUrl.md",{
"title":"useBaseUrl",
"summary":"`useBaseUrl()` 在瀏覽器端回傳目前網站的 origin 加上 Nuxt runtime config 的 `app.baseURL`，組成應用程式的基底網址；在伺服器端回傳空字串。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# useBaseUrl\n\n## Summary\n\n`useBaseUrl()` 在瀏覽器端回傳目前網站的 origin 加上 Nuxt runtime config 的 `app.baseURL`，組成應用程式的基底網址；在伺服器端回傳空字串。\n\n## 運作方式\n\n1. 以 VueUse 的 `isClient` 判斷執行環境。\n2. 瀏覽器端：讀取 runtime config，回傳 origin 與 `app.baseURL` 直接相接的字串。\n3. 伺服器端：回傳空字串，不讀取 runtime config。\n\n來源：1. [useBaseUrl.ts](../../../../app/composables/useBaseUrl.ts)\n\n## 用法\n\n```ts\nconst baseUrl = useBaseUrl()\nconst shareLink = `${baseUrl}orders/${id}`\n```\n\n## 簽章\n\n```ts\nuseBaseUrl(): string\n```\n\n## 回傳\n\n| 名稱 | 型別 | 說明 |\n| --- | --- | --- |\n| （回傳值） | `string` | 瀏覽器端為 origin 加上 `app.baseURL`；伺服器端為 `''` |\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

WIKI_PAGE("features/composables/useRandom.md",{
"title":"useRandom",
"summary":"useRandom 回傳介於 min 與 max 之間、兩端都包含的隨機整數，以 Math.random 計算，不適合用在需要密碼學安全的場合。它是純函式，每次呼叫產生一個新值。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# useRandom\n\n## Summary\n\nuseRandom 回傳介於 min 與 max 之間、兩端都包含的隨機整數，以 Math.random 計算，不適合用在需要密碼學安全的場合。它是純函式，每次呼叫產生一個新值。\n\n## 介面\n\n### 簽章\n\n```ts\nconst useRandom: (min?: number, max?: number) => number\n```\n\n### 參數\n\n| 參數 | 型別 | 預設 | 說明 |\n| --- | --- | --- | --- |\n| `min` | `number` | `0` | 最小值，包含 |\n| `max` | `number` | `Number.MAX_VALUE` | 最大值，包含 |\n\n### 回傳\n\n| 名稱 | 型別 | 說明 |\n| --- | --- | --- |\n| 回傳值 | `number` | `Math.floor(Math.random() * (max - min + 1)) + min` |\n\n來源：1. [useRandom.ts](../../../../app/composables/useRandom.ts)\n\n## 用法\n\n```ts\nuseRandom(1, 6) // 1 到 6 之間的隨機整數\n```\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

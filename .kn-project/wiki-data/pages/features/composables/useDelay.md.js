WIKI_PAGE("features/composables/useDelay.md",{
"title":"useDelay",
"summary":"`useDelay(ms)` 回傳一個在指定毫秒後 resolve 的 Promise，用於非同步流程中的等待。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# useDelay\n\n## Summary\n\n`useDelay(ms)` 回傳一個在指定毫秒後 resolve 的 Promise，用於非同步流程中的等待。\n\n## 運作方式\n\n1. 呼叫當下以 toValue 讀取毫秒數，之後 ref 再變動不影響這次等待。\n2. 以 setTimeout 計時，到期後 resolve。\n3. 沒有取消機制。\n\n來源：1. [useDelay.ts](../../../../app/composables/useDelay.ts)\n\n## 用法\n\n```ts\nawait useDelay(1000)\n```\n\n## 簽章\n\n```ts\nuseDelay(milliseconds: MaybeRef<number>): Promise<void>\n```\n\n## 參數\n\n| 參數 | 型別 | 預設 | 說明 |\n| --- | --- | --- | --- |\n| `milliseconds` | `MaybeRef<number>` | — | 等待的毫秒數 |\n\n## 回傳\n\n| 名稱 | 型別 | 說明 |\n| --- | --- | --- |\n| （回傳值） | `Promise<void>` | 計時到期後 resolve |\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

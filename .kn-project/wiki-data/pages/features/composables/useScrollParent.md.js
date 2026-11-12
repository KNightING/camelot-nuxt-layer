WIKI_PAGE("features/composables/useScrollParent.md",{
"title":"useScrollParent",
"summary":"useScrollParent 從指定元素本身開始往上找，回傳第一個內容高度超過可視高度的元素，也就是最近的捲動容器；找不到時為 null。結果是 computed，只在目標元素改變時重算，不會因為內容高度變化而更新。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# useScrollParent\n\n## Summary\n\nuseScrollParent 從指定元素本身開始往上找，回傳第一個內容高度超過可視高度的元素，也就是最近的捲動容器；找不到時為 null。結果是 computed，只在目標元素改變時重算，不會因為內容高度變化而更新。\n\n## 介面\n\n### 簽章\n\n```ts\nfunction useScrollParent(target?: MaybeElementRef): ComputedRef<HTMLElement | null>\n```\n\n### 參數\n\n| 參數 | 型別 | 預設 | 說明 |\n| --- | --- | --- | --- |\n| `target` | `MaybeElementRef` | — | 起始元素，以 `unrefElement` 取值 |\n\n### 回傳\n\n| 名稱 | 型別 | 說明 |\n| --- | --- | --- |\n| 回傳值 | `ComputedRef<HTMLElement \\| null>` | 找到的捲動容器；找不到或目標為空時為 `null` |\n\n來源：1. [useScrollParent.ts](../../../../app/composables/useScrollParent.ts)\n\n## 用法\n\n```ts\nconst el = ref<HTMLElement>()\nconst scrollParent = useScrollParent(el)\n```\n\n## 規則\n\n| 規則 | 說明 |\n| --- | --- |\n| 判定條件 | 只比較 `scrollHeight` 與 `clientHeight`，不看 CSS overflow 設定 |\n| 起點 | 包含目標元素自己；目標本身可捲動時直接回傳它 |\n| 方向 | 只判斷垂直方向 |\n| 重算時機 | 目標元素改變時；內容高度變化不會觸發 |\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

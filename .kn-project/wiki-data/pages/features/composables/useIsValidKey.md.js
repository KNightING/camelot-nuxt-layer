WIKI_PAGE("features/composables/useIsValidKey.md",{
"title":"useIsValidKey",
"summary":"useIsValidKey 以 in 運算子判斷一個 key 是否存在於物件中，宣告為泛型的 TypeScript 型別守衛。守衛成立後 key 會被收窄成該物件的鍵型別，之後可以直接用它安全地取值。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md", "archive/2609231702-fix-wiki-review-code-defects.md"],
"changelog":[{"plan": "2609231702-fix-wiki-review-code-defects", "date": "2026-09-23", "version": "—", "note": "修正程式碼缺陷後更新為修正後的行為", "issue": "[#47](https://github.com/KNightING/camelot-nuxt-layer/issues/47)", "pr": "—"}, {"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# useIsValidKey\n\n## Summary\n\nuseIsValidKey 以 in 運算子判斷一個 key 是否存在於物件中，宣告為泛型的 TypeScript 型別守衛。守衛成立後 key 會被收窄成該物件的鍵型別，之後可以直接用它安全地取值。\n\n## 介面\n\n### 簽章\n\n```ts\nconst useIsValidKey: <T extends object>(\n  key: PropertyKey,\n  object: T,\n) => key is keyof T\n```\n\n### 參數\n\n| 參數 | 型別 | 預設 | 說明 |\n| --- | --- | --- | --- |\n| `key` | `PropertyKey` | 必填 | 要檢查的鍵 |\n| `object` | `T` | 必填 | 要檢查的物件 |\n\n### 回傳\n\n| 名稱 | 型別 | 說明 |\n| --- | --- | --- |\n| 回傳值 | `key is keyof T` | `key in object` 的結果 |\n\n來源：1. [useIsValidKey.ts](../../../../app/composables/useIsValidKey.ts)\n\n## 用法\n\n```ts\nconst letterMap = { A: 10, B: 11 }\nconst char = input.charAt(0)\nif (!useIsValidKey(char, letterMap)) {\n  return false\n}\nconst num = letterMap[char]\n```\n\n## 規則\n\n| 規則 | 說明 |\n| --- | --- |\n| 原型鏈 | `in` 會找原型鏈，`'toString'` 對一般物件也會回傳 `true` |\n| 型別收窄 | 收窄成物件的鍵型別，取得的值是該物件的屬性型別 |\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

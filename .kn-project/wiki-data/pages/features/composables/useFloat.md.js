WIKI_PAGE("features/composables/useFloat.md",{
"title":"useFloat",
"summary":"useFloat 提供避免 JavaScript 浮點誤差的數值運算，目前只有加法 plus：把兩個數放大成整數後相加再縮回，回傳 computed，讓 0.1 + 0.2 得到 0.3。兩個參數都可以是 ref，值變動時結果自動重算。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# useFloat\n\n## Summary\n\nuseFloat 提供避免 JavaScript 浮點誤差的數值運算，目前只有加法 plus：把兩個數放大成整數後相加再縮回，回傳 computed，讓 0.1 + 0.2 得到 0.3。兩個參數都可以是 ref，值變動時結果自動重算。\n\n## 介面\n\n### 簽章\n\n```ts\nconst useFloat: () => {\n  plus: (\n    value1Ref: MaybeRef<number>,\n    value2Ref: MaybeRef<number>,\n  ) => ComputedRef<number>\n}\n```\n\n### 回傳\n\n| 名稱 | 型別 | 說明 |\n| --- | --- | --- |\n| `plus` | `(value1Ref, value2Ref) => ComputedRef<number>` | 兩數相加，回傳避免浮點誤差的 computed |\n\n來源：1. [useFloat.ts](../../../../app/composables/useFloat.ts)\n\n## 用法\n\n```ts\nconst { plus } = useFloat()\nconst sum = plus(0.1, 0.2) // sum.value === 0.3\n```\n\n## 規則\n\n計算步驟：\n\n1. 以字串形式找出兩數小數點後的長度，取較大者。\n2. 縮放倍數為 10 的「小數位數加一」次方。\n3. 兩數各乘上倍數後相加，四捨五入成整數。\n4. 除以倍數得到結果。\n\n| 規則 | 說明 |\n| --- | --- |\n| 整數相加 | 倍數為 1，直接相加 |\n| 科學記號 | 以字串找小數點，極小或極大的數轉成科學記號時不保證精度 |\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

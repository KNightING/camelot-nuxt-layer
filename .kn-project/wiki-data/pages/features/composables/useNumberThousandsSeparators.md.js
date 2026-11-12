WIKI_PAGE("features/composables/useNumberThousandsSeparators.md",{
"title":"千分位格式化",
"summary":"useNumberThousandsSeparator（檔名為複數 useNumberThousandsSeparators）提供 format 方法，把數字轉成帶千分位分隔符號的字串。實作直接呼叫 toLocaleString，分隔符號與小數處理跟著執行環境的預設語系，因此只適合在瀏覽器端使用。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# 千分位格式化\n\n## Summary\n\nuseNumberThousandsSeparator（檔名為複數 useNumberThousandsSeparators）提供 format 方法，把數字轉成帶千分位分隔符號的字串。實作直接呼叫 toLocaleString，分隔符號與小數處理跟著執行環境的預設語系，因此只適合在瀏覽器端使用。\n\n## 介面\n\n### 簽章\n\n```ts\nconst useNumberThousandsSeparator: () => {\n  format: (value: number | bigint) => string\n}\n```\n\n### 回傳\n\n| 名稱 | 型別 | 說明 |\n| --- | --- | --- |\n| `format` | `(value: number \\| bigint) => string` | 回傳 `value.toLocaleString()` 的結果 |\n\n來源：1. [useNumberThousandsSeparators.ts](../../../../app/composables/useNumberThousandsSeparators.ts)\n\n## 用法\n\n```ts\nconst { format } = useNumberThousandsSeparator()\nformat(1234567) // '1,234,567'（預設語系為 en、zh-TW 時）\n```\n\n## 規則\n\n| 規則 | 說明 |\n| --- | --- |\n| 語系 | 不指定語系，跟著執行環境；伺服端與瀏覽器語系不同時輸出會不一致 |\n| 小數 | 依 `toLocaleString` 預設，最多保留 3 位小數 |\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

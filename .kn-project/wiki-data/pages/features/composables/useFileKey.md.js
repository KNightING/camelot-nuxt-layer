WIKI_PAGE("features/composables/useFileKey.md",{
"title":"useFileKey",
"summary":"useFileKey 依檔案的 MIME 型別、名稱、大小與最後修改時間組出一個識別字串，用來判斷兩個 File 是否為同一個檔案，或當作快取、useAsyncData 的 key。它是純函式，不建立任何響應式狀態。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# useFileKey\n\n## Summary\n\nuseFileKey 依檔案的 MIME 型別、名稱、大小與最後修改時間組出一個識別字串，用來判斷兩個 File 是否為同一個檔案，或當作快取、useAsyncData 的 key。它是純函式，不建立任何響應式狀態。\n\n## 介面\n\n### 簽章\n\n```ts\nconst useFileKey: (file: File) => string\n```\n\n### 參數\n\n| 參數 | 型別 | 預設 | 說明 |\n| --- | --- | --- | --- |\n| `file` | `File` | 必填 | 來源檔案 |\n\n### 回傳\n\n| 名稱 | 型別 | 說明 |\n| --- | --- | --- |\n| 回傳值 | `string` | 以底線串接 `type`、`name`、`size`、`lastModified` |\n\n來源：1. [useFileKey.ts](../../../../app/composables/useFileKey.ts)\n\n## 用法\n\n```ts\nconst key = useFileKey(file)\n// 'image/png_photo.png_20480_1700000000000'\n```\n\n## 規則\n\n| 規則 | 說明 |\n| --- | --- |\n| 相同判定 | 四個欄位都相同就得到相同字串，內容不同但欄位相同也會撞 key |\n| 使用者 | useFileToDataURL 以它作為 useAsyncData 的 key |\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

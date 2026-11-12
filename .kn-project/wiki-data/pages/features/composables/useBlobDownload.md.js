WIKI_PAGE("features/composables/useBlobDownload.md",{
"title":"useBlobDownload",
"summary":"`useBlobDownload(obj, fileName)` 把一個 Blob 或 MediaSource 以指定檔名立即下載：為它建立物件網址，指給一個暫時的 `<a>` 元素後點擊。呼叫即觸發下載，只能在瀏覽器端使用。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md", "archive/2609231702-fix-wiki-review-code-defects.md"],
"changelog":[{"plan": "2609231702-fix-wiki-review-code-defects", "date": "2026-09-23", "version": "—", "note": "修正程式碼缺陷後更新為修正後的行為", "issue": "[#47](https://github.com/KNightING/camelot-nuxt-layer/issues/47)", "pr": "—"}, {"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# useBlobDownload\n\n## Summary\n\n`useBlobDownload(obj, fileName)` 把一個 Blob 或 MediaSource 以指定檔名立即下載：為它建立物件網址，指給一個暫時的 `<a>` 元素後點擊。呼叫即觸發下載，只能在瀏覽器端使用。\n\n## 運作方式\n\n1. 以 createObjectURL 為物件建立網址。\n2. 建立 `<a>` 元素，設定下載檔名與網址，不掛進 DOM。\n3. 呼叫 click 觸發下載，回傳值為 `undefined`。\n4. 下一輪事件循環釋放物件網址。\n\n| 規則 | 說明 |\n| --- | --- |\n| 物件網址 | 觸發下載後自動釋放，不會常駐記憶體 |\n| 執行環境 | 需要 document 與 URL，伺服器端呼叫會出錯 |\n\n來源：1. [useBlobDownload.ts](../../../../app/composables/useBlobDownload.ts)\n\n## 用法\n\n```ts\nconst blob = new Blob([csvText], { type: 'text/csv' })\nuseBlobDownload(blob, 'report.csv')\n```\n\n## 簽章\n\n```ts\nuseBlobDownload(obj: Blob | MediaSource, fileName: string): void\n```\n\n## 參數\n\n| 參數 | 型別 | 預設 | 說明 |\n| --- | --- | --- | --- |\n| `obj` | `Blob \\| MediaSource` | — | 要下載的物件 |\n| `fileName` | `string` | — | 下載時使用的檔名 |\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

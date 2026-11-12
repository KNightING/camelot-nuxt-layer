WIKI_PAGE("features/composables/usePiniaClear.md",{
"title":"Pinia 重置與釋放",
"summary":"usePiniaClear 檔案匯出 usePiniaReset 與 usePiniaDispose：讀取目前 active Pinia 已建立的所有 store，產生以 store id 為鍵的方法表，逐一或以 all 一次呼叫 $reset 或 $dispose。常用於登出時清空全站狀態。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# Pinia 重置與釋放\n\n## Summary\n\nusePiniaClear 檔案匯出 usePiniaReset 與 usePiniaDispose：讀取目前 active Pinia 已建立的所有 store，產生以 store id 為鍵的方法表，逐一或以 all 一次呼叫 $reset 或 $dispose。常用於登出時清空全站狀態。\n\n## 介面\n\n### 簽章\n\n```ts\nconst usePiniaReset: () => Record<string | 'all', () => void>\nconst usePiniaDispose: () => Record<string | 'all', () => void>\n```\n\n### 回傳\n\n| 名稱 | 型別 | 說明 |\n| --- | --- | --- |\n| `usePiniaReset()` | `Record<string \\| 'all', () => void>` | 每個 store id 對應一個呼叫 `$reset` 的函式；`all` 重置全部 |\n| `usePiniaDispose()` | `Record<string \\| 'all', () => void>` | 每個 store id 對應一個呼叫 `$dispose` 的函式；`all` 釋放全部 |\n\n來源：1. [usePiniaClear.ts](../../../../app/composables/usePiniaClear.ts)\n\n## 用法\n\n```ts\nconst reset = usePiniaReset()\nreset.all() // 重置所有 store\nreset.user() // 重置 id 為 user 的 store\n\nconst dispose = usePiniaDispose()\ndispose.all()\n```\n\n## 規則\n\n| 規則 | 說明 |\n| --- | --- |\n| store 來源 | 以 `getActivePinia` 取得實例，讀取內部的 `_s` 表 |\n| 沒有 Pinia | 拋出 `There is no stores` |\n| 具名方法的範圍 | 只含呼叫當下已建立的 store；`all` 執行時才遍歷，會涵蓋之後建立的 store |\n| `all` 的錯誤 | 每個 store 以 try／catch 包住，錯誤靜默忽略 |\n| 具名方法的錯誤 | 不捕捉；setup store 未實作 `$reset`，開發模式下直接呼叫會拋錯 |\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

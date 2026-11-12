WIKI_PAGE("features/composables/useRandomCatImg.md",{
"title":"useRandomCatImg",
"summary":"useRandomCatImg 產生 cataas.com 的隨機貓咪圖片網址，回傳響應式網址與換一張的方法，常用於範例頁與佔位圖。它只組網址，不發送任何請求；網址帶隨機查詢字串，讓瀏覽器每次都重新取圖。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# useRandomCatImg\n\n## Summary\n\nuseRandomCatImg 產生 cataas.com 的隨機貓咪圖片網址，回傳響應式網址與換一張的方法，常用於範例頁與佔位圖。它只組網址，不發送任何請求；網址帶隨機查詢字串，讓瀏覽器每次都重新取圖。\n\n## 介面\n\n### 簽章\n\n```ts\nconst useRandomCatImg: () => {\n  url: Ref<string>\n  newCat: () => void\n}\n```\n\n### 回傳\n\n| 名稱 | 型別 | 說明 |\n| --- | --- | --- |\n| `url` | `Ref<string>` | 目前的貓咪圖片網址，格式見下方 |\n| `newCat` | `() => void` | 產生新的隨機碼並更新 `url` |\n\n```text\nhttps://cataas.com/cat?<隨機碼>\n```\n\n來源：1. [useRandomCatImg.ts](../../../../app/composables/useRandomCatImg.ts)\n\n## 用法\n\n```vue\n<script setup lang=\"ts\">\nconst { url, newCat } = useRandomCatImg()\n</script>\n\n<template>\n  <img :src=\"url\">\n  <button @click=\"newCat\">換一隻</button>\n</template>\n```\n\n## 規則\n\n| 規則 | 說明 |\n| --- | --- |\n| 初始值 | 建立時自動呼叫一次 `newCat` |\n| 隨機碼 | `Math.random` 轉 36 進位後取第 2 到 14 位 |\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

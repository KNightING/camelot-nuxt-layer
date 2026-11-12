WIKI_PAGE("features/components/Skeleton.md",{
"title":"Skeleton",
"summary":"載入中的骨架佔位元件：載入時依目前主題顯示不同的載入動畫，載入完成後改顯示預設插槽的實際內容。匯入名稱為 `CamelotSkeleton`（Nuxt 自動匯入）。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# Skeleton\n\n## Summary\n\n載入中的骨架佔位元件：載入時依目前主題顯示不同的載入動畫，載入完成後改顯示預設插槽的實際內容。匯入名稱為 `CamelotSkeleton`（Nuxt 自動匯入）。\n\n## 運作方式\n\n| 主題 | 載入動畫 |\n|---|---|\n| Aqua | 毛玻璃底加 shimmer 光帶 |\n| Sci-Fi | HUD 外框，無邊界、不切角，開啟格線、掃描線與脈衝，最低 24px |\n| Cupertino、Material | 閃光掃過的預設骨架 |\n\n元件不自動繼承屬性，傳入的 class 等屬性會轉交給實際的骨架容器。\n\n來源：1. [Skeleton.vue](../../../../app/components/Camelot/Skeleton.vue)\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :---: | :--- |\n| `isLoading` | `boolean` | `true` | 是否顯示骨架；`false` 時改為渲染預設插槽。 |\n\n## Slots\n| Slot | 作用域參數 | 說明 |\n| :--- | :--- | :--- |\n| `default` | — | 載入完成後顯示的實際內容。 |\n\n## 相關頁面\n\n- [Scifi Frame](./Scifi-Frame.md)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

WIKI_PAGE("features/components/Breakpoints.md",{
"title":"Breakpoints",
"summary":"Breakpoints 是依裝置斷點選擇插槽渲染的響應式容器，匯入名稱 `CamelotBreakpoints`（Nuxt 自動匯入）。斷點分為 mobile、tablet、laptop、desktop；目前斷點沒有提供插槽時，預設會回退到較小斷點的插槽，都沒有才渲染預設插槽。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# Breakpoints\n\n## Summary\n\nBreakpoints 是依裝置斷點選擇插槽渲染的響應式容器，匯入名稱 `CamelotBreakpoints`（Nuxt 自動匯入）。斷點分為 mobile、tablet、laptop、desktop；目前斷點沒有提供插槽時，預設會回退到較小斷點的插槽，都沒有才渲染預設插槽。\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :---: | :--- |\n| `disabledDownward` | `boolean` | — | 關閉向下相容；停用後大斷點不再回退使用較小斷點的插槽 |\n\n## Slots\n| Slot | 作用域參數 | 說明 |\n| :--- | :--- | :--- |\n| `mobile` | — | 行動裝置版面 |\n| `tablet` | — | 平板版面 |\n| `laptop` | — | 筆電版面 |\n| `desktop` | — | 桌機版面 |\n| `default` | `{ isMobile, isTablet, isLaptop, isDesktop }` | 無對應具名插槽時的後備內容，並提供各斷點布林值 |\n\n## 運作方式\n\n1. 從 [useDeviceBreakpoints](../composables/useDeviceBreakpoints.md) 取得目前斷點。\n2. 有目前斷點的插槽就渲染它。\n3. 沒有時依序往較小斷點找，例如 desktop 依序找 laptop、tablet、mobile。\n4. 開啟 `disabledDownward` 時跳過第 3 步。\n5. 都找不到就渲染預設插槽。\n\n來源：1. [Breakpoints.vue](../../../../app/components/Camelot/Breakpoints.vue)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

WIKI_PAGE("features/components/Expanded.md",{
"title":"Expanded",
"summary":"Expanded（匯入名稱 `CamelotExpanded`）是可展開、收合的容器：點 header 區切換展開狀態，內容以高度過場平滑展開，底部另有常駐的 footer 區。展開狀態由 v-model:expanded 控制，並對外公開內容區的寬高。Menu 與 Tree 的子層展開都用它做動畫。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# Expanded\n\n## Summary\n\nExpanded（匯入名稱 `CamelotExpanded`）是可展開、收合的容器：點 header 區切換展開狀態，內容以高度過場平滑展開，底部另有常駐的 footer 區。展開狀態由 v-model:expanded 控制，並對外公開內容區的寬高。Menu 與 Tree 的子層展開都用它做動畫。\n\n## v-model\n| Model | 型別 | 說明 |\n| :--- | :--- | :--- |\n| `expanded` | `boolean`，預設 `false` | 是否展開內容 |\n\n## Slots\n| Slot | 作用域參數 | 說明 |\n| :--- | :--- | :--- |\n| `header` | — | 標題區，放開指標時切換展開狀態 |\n| `default` | — | 展開、收合的內容 |\n| `footer` | — | 底部區，不隨展開狀態隱藏 |\n\n## Exposed\n| 名稱 | 說明 |\n| :--- | :--- |\n| `contentHeight` | 內容區的高度 |\n| `contentWidth` | 內容區的寬度 |\n\n## 運作方式\n\n### 展開動畫\n\n內容包在一格 grid 裡，展開時列高從 0fr 過場到 1fr，歷時 500ms；收合時內容被裁切隱藏，不需要事先知道內容高度。\n\nheader 監聽的是 pointerup，滑鼠、觸控與觸控筆放開時都會切換。\n\n來源：1. [Expanded.vue](../../../../app/components/Camelot/Expanded.vue)\n\n### 尺寸追蹤\n\n公開的寬高由內建的 ResizeObserver 追蹤內容區尺寸。元件不監聽視窗捲動與縮放，因為那些只影響座標、不影響尺寸。\n\n來源：1. [Expanded.vue](../../../../app/components/Camelot/Expanded.vue)\n\n## 相關頁面\n\n- [Menu](./Menu.md)\n- [Tree](./Tree.md)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

WIKI_PAGE("features/components/Internal-SheetHandle.md",{
"title":"SheetHandle",
"summary":"SheetHandle（匯入名稱 `CamelotInternalSheetHandle`）是底部面板頂端的拖曳把手，屬內部元件：熱區 44px 高、關閉瀏覽器觸控手勢、游標呈抓取狀，中間依主題畫出指示條。它本身不含拖曳邏輯，由 [BaseBottomSheetV2](./BaseBottomSheetV2.md) 監聽它的 pointerdown 開始手勢關閉。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# SheetHandle\n\n## Summary\n\nSheetHandle（匯入名稱 `CamelotInternalSheetHandle`）是底部面板頂端的拖曳把手，屬內部元件：熱區 44px 高、關閉瀏覽器觸控手勢、游標呈抓取狀，中間依主題畫出指示條。它本身不含拖曳邏輯，由 [BaseBottomSheetV2](./BaseBottomSheetV2.md) 監聽它的 pointerdown 開始手勢關閉。\n\n## 運作方式\n\n### 熱區\n\n1. 熱區高 44px，符合觸控最小目標，視覺上只畫中間的指示條。\n2. 關閉瀏覽器觸控手勢，拖曳不會被當成頁面捲動。\n3. 以負上邊距往上延伸，貼齊面板頂端。\n\n| 無障礙屬性 | 值 |\n| :--- | :--- |\n| role | button |\n| tabindex | 0 |\n| aria-label | 拖曳關閉 |\n\n來源：1. [SheetHandle.vue](../../../../app/components/Camelot/Internal/SheetHandle.vue)\n\n### 指示條\n\n| 主題 | 尺寸 | 顏色 |\n| :--- | :--- | :--- |\n| Sci-Fi | 48 × 4px | 30% 主色 |\n| Cupertino | 40 × 6px | 50% 灰 |\n| Aqua | 40 × 6px | 20% 前景色 |\n| Material | 32 × 4px | 次要外框色 |\n\n來源：1. [SheetHandle.vue](../../../../app/components/Camelot/Internal/SheetHandle.vue)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

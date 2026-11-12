WIKI_PAGE("features/components/Gpu.md",{
"title":"Gpu",
"summary":"Gpu（匯入名稱 `CamelotGpu`）是強制 GPU 合成的包裹容器：把內容放進獨立的合成層，並開啟 iOS 的慣性捲動，用來改善動畫閃爍或捲動卡頓。兩項修正都可以個別關閉；容器本身沒有其他樣式與行為。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# Gpu\n\n## Summary\n\nGpu（匯入名稱 `CamelotGpu`）是強制 GPU 合成的包裹容器：把內容放進獨立的合成層，並開啟 iOS 的慣性捲動，用來改善動畫閃爍或捲動卡頓。兩項修正都可以個別關閉；容器本身沒有其他樣式與行為。\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :---: | :--- |\n| `disabledFixTransform` | `boolean` | `false` | 關閉零位移 3D transform 修正 |\n| `disabledFixScrolling` | `boolean` | `false` | 關閉 iOS 觸控慣性捲動修正 |\n\n## Slots\n| Slot | 作用域參數 | 說明 |\n| :--- | :--- | :--- |\n| `default` | — | 要套用修正的內容 |\n\n## 運作方式\n\n### 套用的修正\n\n| 修正 | 條件 | 作用 |\n| :--- | :--- | :--- |\n| GPU transform | 一律套用 | 啟用 GPU 合成 |\n| 零位移 3D transform | 未關閉時 | 強制內容獨立成合成層 |\n| 觸控慣性捲動 | 未關閉時 | 讓 iOS Safari 內的捲動有慣性 |\n\n來源：1. [Gpu.vue](../../../../app/components/Camelot/Gpu.vue)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

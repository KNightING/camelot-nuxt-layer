WIKI_PAGE("features/components/Internal-PasswordToggle.md",{
"title":"PasswordToggle",
"summary":"PasswordToggle（匯入名稱 `CamelotInternalPasswordToggle`）是密碼顯示與隱藏的眼睛按鈕，屬內部元件。[Input](./Input.md) 在 type 為 password 且 passwordToggle 開啟時，把它放在 after 區域尾端，四個主題共用同一顆；它只切換 v-model:revealed，何時自動切回隱碼由 Input 決定。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# PasswordToggle\n\n## Summary\n\nPasswordToggle（匯入名稱 `CamelotInternalPasswordToggle`）是密碼顯示與隱藏的眼睛按鈕，屬內部元件。[Input](./Input.md) 在 type 為 password 且 passwordToggle 開啟時，把它放在 after 區域尾端，四個主題共用同一顆；它只切換 v-model:revealed，何時自動切回隱碼由 Input 決定。\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :---: | :--- |\n| `disabled` | `boolean` | — | 停用，跟隨 Input 的 disabled |\n\n## v-model\n| Model | 型別 | 說明 |\n| :--- | :--- | :--- |\n| `v-model:revealed` | `boolean` | 是否顯示密碼，預設 `false` |\n\n## 運作方式\n\n### 按鈕行為\n\n1. 點擊切換 revealed。\n2. 按下滑鼠時阻止預設行為，焦點留在輸入框，Input 才能在切換後還原游標位置。\n3. 隱碼時顯示睜眼圖示，顯示密碼時顯示閉眼圖示。\n\n| 無障礙屬性 | 值 |\n| :--- | :--- |\n| aria-label | 隱碼時為「顯示密碼」，顯示時為「隱藏密碼」 |\n| aria-pressed | 與 revealed 相同 |\n\n顯示策略 hide-on-change 與 persistent 不在此元件，由 Input 的 passwordRevealMode 控制。\n\n來源：1. [PasswordToggle.vue](../../../../app/components/Camelot/Internal/PasswordToggle.vue)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

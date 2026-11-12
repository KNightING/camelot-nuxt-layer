WIKI_PAGE("features/composables/useErrorRef.md",{
"title":"useErrorRef",
"summary":"useErrorRef 建立一個匯總用的錯誤 ref，並提供 watch 方法監聽一個或多個來源錯誤 ref，任一來源變動就把值同步過來。它只負責匯總，不含佇列、格式轉換與顯示；需要多筆錯誤累積並逐一彈窗時改用 useCamelotError。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# useErrorRef\n\n## Summary\n\nuseErrorRef 建立一個匯總用的錯誤 ref，並提供 watch 方法監聽一個或多個來源錯誤 ref，任一來源變動就把值同步過來。它只負責匯總，不含佇列、格式轉換與顯示；需要多筆錯誤累積並逐一彈窗時改用 useCamelotError。\n\n## 介面\n\n### 簽章\n\n```ts\nconst useErrorRef: () => {\n  error: Ref<ErrorRefType>\n  watch: (errors: Ref<ErrorRefType> | Ref<ErrorRefType>[]) => void\n}\n\ntype ErrorRefType = FetchError | Error | any | null\n```\n\n### 回傳\n\n| 名稱 | 型別 | 說明 |\n| --- | --- | --- |\n| `error` | `Ref<ErrorRefType>` | 匯總後的錯誤 ref，初始為 `undefined` |\n| `watch` | `(errors) => void` | 監聽單一或多個來源錯誤 ref，變動時同步到 `error` |\n\n### watch 參數\n\n| 參數 | 型別 | 預設 | 說明 |\n| --- | --- | --- | --- |\n| `errors` | `Ref<ErrorRefType> \\| Ref<ErrorRefType>[]` | 必填 | 要監聽的錯誤 ref；傳陣列時逐一監聽 |\n\n來源：1. [useErrorRef.ts](../../../../app/composables/useErrorRef.ts)\n\n## 用法\n\n```ts\nconst { error, watch } = useErrorRef()\nwatch([fetchAError, fetchBError])\n```\n\n## 規則\n\n| 規則 | 說明 |\n| --- | --- |\n| 初始同步 | 每個來源都以 immediate 監聽，建立當下就同步一次 |\n| 多來源 | 共用同一個 `error`，後變動的來源覆寫先前的值 |\n| 清除 | 來源變回 `null` 時 `error` 也跟著變回 `null` |\n\n## 相關頁面\n\n- [useCamelotError](./useCamelotError.md)：多筆錯誤累積並逐一彈窗。\n- [錯誤處理系統](../../platform/error-handling.md)：整體錯誤處理流程。\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});

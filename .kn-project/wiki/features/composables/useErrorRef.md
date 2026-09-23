# useErrorRef

## Summary

useErrorRef 建立一個匯總用的錯誤 ref，並提供 watch 方法監聽一個或多個來源錯誤 ref，任一來源變動就把值同步過來。它只負責匯總，不含佇列、格式轉換與顯示；需要多筆錯誤累積並逐一彈窗時改用 useCamelotError。

## 介面

### 簽章

```ts
const useErrorRef: () => {
  error: Ref<ErrorRefType>
  watch: (errors: Ref<ErrorRefType> | Ref<ErrorRefType>[]) => void
}

type ErrorRefType = FetchError | Error | any | null
```

### 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `error` | `Ref<ErrorRefType>` | 匯總後的錯誤 ref，初始為 `undefined` |
| `watch` | `(errors) => void` | 監聽單一或多個來源錯誤 ref，變動時同步到 `error` |

### watch 參數

| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `errors` | `Ref<ErrorRefType> \| Ref<ErrorRefType>[]` | 必填 | 要監聽的錯誤 ref；傳陣列時逐一監聽 |

來源：1. [useErrorRef.ts][]

## 用法

```ts
const { error, watch } = useErrorRef()
watch([fetchAError, fetchBError])
```

## 規則

| 規則 | 說明 |
| --- | --- |
| 初始同步 | 每個來源都以 immediate 監聽，建立當下就同步一次 |
| 多來源 | 共用同一個 `error`，後變動的來源覆寫先前的值 |
| 清除 | 來源變回 `null` 時 `error` 也跟著變回 `null` |

## 相關頁面

- [useCamelotError](./useCamelotError.md)：多筆錯誤累積並逐一彈窗。
- [錯誤處理系統](../../platform/error-handling.md)：整體錯誤處理流程。

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useErrorRef.ts | [app/composables/useErrorRef.ts](../../../../app/composables/useErrorRef.ts) |

[useErrorRef.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

# useErrorRef

> 建立一個統一的錯誤 ref，並可監聽一個或多個來源錯誤 ref，將其值同步至此。

## 簽章
```ts
const useErrorRef: () => {
  error: Ref<ErrorRefType>
  watch: (errors: Ref<ErrorRefType> | Ref<ErrorRefType>[]) => void
}

// type ErrorRefType = FetchError | Error | any | null
```

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `error` | `Ref<ErrorRefType>` | 匯總後的錯誤 ref。 |
| `watch` | `(errors: Ref<ErrorRefType> \| Ref<ErrorRefType>[]) => void` | 監聽單一或多個來源錯誤 ref，變動時同步至 `error`。 |

## 參數（watch）
| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `errors` | `Ref<ErrorRefType> \| Ref<ErrorRefType>[]` | — | 欲監聽的錯誤 ref；陣列時逐一監聽。 |

## 用法
```ts
const { error, watch } = useErrorRef()
watch([fetchAError, fetchBError])
```

## 備註
- 內部對每個來源以 `{ immediate: true }` 建立 watch，立即同步初始值。
- 多個來源共用同一個 `error`，後觸發者會覆寫先前的值。

---
[🏠 Wiki](../index.md)

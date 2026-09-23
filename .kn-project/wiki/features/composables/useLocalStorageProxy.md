# useLocalStorageProxy

## Summary

useLocalStorageProxy 以 VueUse 的 useLocalStorage 為底，建立一個 localStorage 代理物件：用 value 讀寫、用 del 刪除，也可透過 storage 取得底層 ref。代理類別 LocalStorageProxy 不匯出，只能透過此函式建立。

## 介面

### 簽章

```ts
const useLocalStorageProxy: <T>(
  key: string,
  initialValue: MaybeRefOrGetter<T>,
  options?: UseStorageOptions<T>,
) => LocalStorageProxy<T>
```

### 參數

| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `key` | `string` | 必填 | localStorage 鍵名 |
| `initialValue` | `MaybeRefOrGetter<T>` | 必填 | 初始值 |
| `options` | `UseStorageOptions<T>` | — | 原樣傳給 `useLocalStorage` |

### 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `storage` | `RemovableRef<T>` | 底層 ref，唯讀 getter |
| `value` | `T` | 讀寫存取值，等同 `storage.value` |
| `del` | `() => void` | 把值設為 `null`，由 VueUse 移除該鍵 |

來源：1. [useLocalStorageProxy.ts][]

## 用法

```ts
const token = useLocalStorageProxy('token', '')
token.value = 'abc'
console.log(token.value)
token.del()
```

## 規則

| 規則 | 說明 |
| --- | --- |
| 刪除後的值 | `del` 之後 `value` 為 `null`，不在 `T` 的型別範圍內，讀取端要自行處理 |
| 同類工具 | sessionStorage 用 [sessionStorage 代理](./useSessionStorageProxy.md)，非同步儲存用 [useStorageProxy](./useStorageProxy.md) |

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useLocalStorageProxy.ts | [app/composables/useLocalStorageProxy.ts](../../../../app/composables/useLocalStorageProxy.ts) |

[useLocalStorageProxy.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

# useStorageProxy

## Summary

useStorageProxy 以 VueUse 的 useStorageAsync 為底，建立一個可接非同步儲存後端的代理物件：用 value 讀寫、用 patch 淺層合併更新物件、用 del 刪除。未指定後端時使用 localStorage。代理類別 StorageProxy 不匯出，只能透過此函式建立。

## 介面

### 簽章

```ts
const useStorageProxy: <T>(
  key: string,
  initialValue: MaybeRefOrGetter<T>,
  storageLike?: StorageLikeAsync,
  options?: UseStorageAsyncOptions<T>,
) => StorageProxy<T>
```

### 參數

| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `key` | `string` | 必填 | 儲存鍵名 |
| `initialValue` | `MaybeRefOrGetter<T>` | 必填 | 初始值 |
| `storageLike` | `StorageLikeAsync` | localStorage | 自訂儲存後端 |
| `options` | `UseStorageAsyncOptions<T>` | — | 原樣傳給 `useStorageAsync`，如序列化、合併預設值 |

### 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `storage` | `RemovableRef<T>` | 底層 ref，唯讀 getter |
| `value` | `T` | 讀寫存取值 |
| `patch` | `(newValue: T) => void` | 以展開方式淺層合併到目前值 |
| `del` | `() => void` | 把值設為 `null`，由 VueUse 移除該鍵 |

來源：1. [useStorageProxy.ts][]

## 用法

```ts
const profile = useStorageProxy('profile', { name: '', age: 0 })

profile.value.name // 讀取
profile.value = { name: 'A', age: 1 } // 覆寫
profile.patch({ age: 2 }) // 局部合併
profile.del() // 刪除
```

## 規則

| 規則 | 說明 |
| --- | --- |
| `patch` 的型別 | 參數型別是完整的 `T`，只傳部分欄位時需自行放寬型別 |
| 合併深度 | 只合併第一層，巢狀物件整個取代 |
| 刪除後的值 | `del` 之後 `value` 為 `null`，讀取端要自行處理 |

## 相關頁面

- [useLocalStorageProxy](./useLocalStorageProxy.md)、[sessionStorage 代理](./useSessionStorageProxy.md)：同步儲存的代理。

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useStorageProxy.ts | [app/composables/useStorageProxy.ts](../../../../app/composables/useStorageProxy.ts) |

[useStorageProxy.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

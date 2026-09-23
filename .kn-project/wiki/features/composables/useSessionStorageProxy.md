# sessionStorage 代理

## Summary

useSessionStorageProxy 以 VueUse 的 useSessionStorage 為底，建立一個 sessionStorage 代理物件：用 value 讀寫、用 del 刪除，也可透過 storage 取得底層 ref。代理類別 SessionStorageProxy 有匯出，也可直接 new 出實例。

## 介面

### 簽章

```ts
const useSessionStorageProxy: <T>(
  key: string,
  initialValue: MaybeRefOrGetter<T>,
  options?: UseStorageOptions<T>,
) => SessionStorageProxy<T>

export class SessionStorageProxy<T> { /* storage、value、del */ }
```

### 參數

| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `key` | `string` | 必填 | sessionStorage 鍵名 |
| `initialValue` | `MaybeRefOrGetter<T>` | 必填 | 初始值 |
| `options` | `UseStorageOptions<T>` | — | 原樣傳給 `useSessionStorage` |

### 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `storage` | `RemovableRef<T>` | 底層 ref，唯讀 getter |
| `value` | `T` | 讀寫存取值，等同 `storage.value` |
| `del` | `() => void` | 把值設為 `null`，由 VueUse 移除該鍵 |

來源：1. [useSessionStorageProxy.ts][]

## 用法

```ts
const draft = useSessionStorageProxy('draft', '')
draft.value = 'hello'
draft.del()
```

## 規則

| 規則 | 說明 |
| --- | --- |
| 刪除後的值 | `del` 之後 `value` 為 `null`，不在 `T` 的型別範圍內，讀取端要自行處理 |
| 同類工具 | localStorage 用 [useLocalStorageProxy](./useLocalStorageProxy.md)，非同步儲存用 [useStorageProxy](./useStorageProxy.md) |

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useSessionStorageProxy.ts | [app/composables/useSessionStorageProxy.ts](../../../../app/composables/useSessionStorageProxy.ts) |

[useSessionStorageProxy.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

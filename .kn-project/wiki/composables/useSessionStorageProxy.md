# useSessionStorageProxy

> 以 `useSessionStorage` 為基礎，封裝一個具有 `value` 存取與 `del` 刪除方法的 sessionStorage 代理物件。

## 簽章
```ts
const useSessionStorageProxy: <T>(
  key: string,
  initialValue: MaybeRefOrGetter<T>,
  options?: UseStorageOptions<T>,
) => SessionStorageProxy<T>
```

## 參數
| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `key` | `string` | — | sessionStorage 的鍵名。 |
| `initialValue` | `MaybeRefOrGetter<T>` | — | 初始值。 |
| `options` | `UseStorageOptions<T>` | — | 傳遞給 `useSessionStorage` 的選項。 |

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `storage` | `RemovableRef<T>` | 底層 `useSessionStorage` 回傳的 ref（唯讀 getter）。 |
| `value` | `T` | 讀寫存取值，等同於 `storage.value`。 |
| `del` | `() => void` | 將 `storage.value` 設為 `null` 以刪除。 |

## 用法
```ts
const draft = useSessionStorageProxy('draft', '')
draft.value = 'hello'
draft.del()
```

## 備註
- 類別 `SessionStorageProxy` 有匯出，亦可直接使用。
- `del()` 將值設為 `null`，需注意其對 `T` 型別的影響。

---
[🏠 Wiki](../index.md)

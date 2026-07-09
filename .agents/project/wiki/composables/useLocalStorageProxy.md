# useLocalStorageProxy

> 以 `useLocalStorage` 為基礎，封裝一個具有 `value` 存取與 `del` 刪除方法的 localStorage 代理物件。

## 簽章
```ts
const useLocalStorageProxy: <T>(
  key: string,
  initialValue: MaybeRefOrGetter<T>,
  options?: UseStorageOptions<T>,
) => LocalStorageProxy<T>
```

## 參數
| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `key` | `string` | — | localStorage 的鍵名。 |
| `initialValue` | `MaybeRefOrGetter<T>` | — | 初始值。 |
| `options` | `UseStorageOptions<T>` | — | 傳遞給 `useLocalStorage` 的選項。 |

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `storage` | `RemovableRef<T>` | 底層 `useLocalStorage` 回傳的 ref（唯讀 getter）。 |
| `value` | `T` | 讀寫存取值，等同於 `storage.value`。 |
| `del` | `() => void` | 將 `storage.value` 設為 `null` 以刪除。 |

## 用法
```ts
const token = useLocalStorageProxy('token', '')
token.value = 'abc'
console.log(token.value)
token.del()
```

## 備註
- 內部類別 `LocalStorageProxy` 未匯出，僅透過此工廠函式建立實例。
- `del()` 將值設為 `null`，需注意其對 `T` 型別的影響。

---
[🏠 Wiki](../index.md)

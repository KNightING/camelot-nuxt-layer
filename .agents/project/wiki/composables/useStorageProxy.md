# useStorageProxy

> 封裝 VueUse `useStorageAsync`，以類別實例形式提供 `value` 存取、`patch` 局部合併更新與 `del` 刪除。

## 簽章
```ts
export const useStorageProxy = <T>(
  key: string,
  initialValue: MaybeRefOrGetter<T>,
  storageLike?: StorageLikeAsync,
  options?: UseStorageAsyncOptions<T>,
) => StorageProxy<T>
```

## 參數
| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `key` | `string` | （必填） | 儲存鍵名。 |
| `initialValue` | `MaybeRefOrGetter<T>` | （必填） | 初始值。 |
| `storageLike` | `StorageLikeAsync` | `undefined` | 自訂儲存後端（預設由 `useStorageAsync` 決定）。 |
| `options` | `UseStorageAsyncOptions<T>` | `undefined` | VueUse 儲存選項（序列化、合併等）。 |

## 回傳
`StorageProxy<T>` 實例，成員如下：

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `storage` | `RemovableRef<T>` | 底層的 `useStorageAsync` ref（getter）。 |
| `value` | `T` | 讀寫儲存值（getter / setter）。 |
| `patch` | `(newValue: T) => void` | 以展開合併方式局部更新（`{ ...current, ...newValue }`）。 |
| `del` | `() => void` | 將值設為 `null`（觸發移除）。 |

## 用法
```ts
const profile = useStorageProxy('profile', { name: '', age: 0 })

profile.value.name          // 讀取
profile.value = { name: 'A', age: 1 } // 覆寫
profile.patch({ age: 2 })   // 局部合併
profile.del()               // 刪除
```

## 備註
- `patch` 使用淺層展開合併，適合物件型別的部分欄位更新。
- `del` 將 `storage.value` 設為 `null`，依 `RemovableRef` 行為移除該鍵。

---
[🏠 Wiki](../index.md)

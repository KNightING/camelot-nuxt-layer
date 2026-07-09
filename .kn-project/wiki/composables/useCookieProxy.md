# useCookieProxy

> 以類別包裝 Nuxt `useCookie`，提供 value 存取、部分更新（patch）與刪除（del）的便利介面。

## 簽章
```ts
useCookieProxy<T>(
  key: string,
  opts?: ReadOnlyCookeOptions<T>,
): CookieProxy<T>

type ReadOnlyCookeOptions<T> = CookieOptions<T> & { readonly?: false | undefined }
```

## 參數
| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `key` | `string` | — | Cookie 的鍵名。 |
| `opts` | `ReadOnlyCookeOptions<T>` | `undefined` | Nuxt `CookieOptions`（限制 `readonly` 為 `false` 或未設定），傳入 `useCookie`。 |

## 回傳
回傳 `CookieProxy<T>` 實例：

| 成員 | 型別 | 說明 |
| --- | --- | --- |
| `cookie` | `CookieRef<T \| undefined>` | 底層 `useCookie` 的 ref。 |
| `value` | `T \| undefined` | 取得／設定 cookie 值。 |
| `patch` | `(newValue: T) => void` | 以展開合併方式部分更新（`{ ...舊值, ...newValue }`）。 |
| `del` | `() => void` | 將 cookie 值設為 `undefined`（刪除）。 |

## 用法
```ts
const session = useCookieProxy<{ token: string; name: string }>('session')
session.value = { token: 'abc', name: 'Amy' }
session.patch({ name: 'Bob' })
session.del()
```

## 備註
- `patch` 適用於物件型別的 cookie，僅覆寫傳入的欄位。

---
[🏠 Wiki](../index.md)

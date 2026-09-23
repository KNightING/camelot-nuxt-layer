# useCookieProxy

## Summary

`useCookieProxy(key, opts)` 以類別包裝 Nuxt 的 `useCookie`，提供讀寫 value、以物件展開部分更新的 patch，以及刪除的 del。選項同 useCookie，但不接受唯讀模式。

## 運作方式

1. 建構時以鍵名與選項呼叫 useCookie，保存回傳的 cookie ref。
2. 讀寫 value 直接對應 cookie ref 的值。
3. patch 把目前值與新值展開合併後寫回，只覆寫傳入的欄位，適用物件型別的 cookie。
4. del 把值設為 `undefined`，由 useCookie 刪除該 cookie。

來源：1. [useCookieProxy.ts][]

## 用法

```ts
const session = useCookieProxy<{ token: string; name: string }>('session')
session.value = { token: 'abc', name: 'Amy' }
session.patch({ name: 'Bob' })
session.del()
```

## 簽章

```ts
useCookieProxy<T>(key: string, opts?: ReadOnlyCookeOptions<T>): CookieProxy<T>

type ReadOnlyCookeOptions<T> = CookieOptions<T> & { readonly?: false | undefined }
```

`CookieProxy` 類別與選項型別都沒有匯出，只能透過本函式取得實例。

## 參數

| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `key` | `string` | — | cookie 名稱 |
| `opts` | `ReadOnlyCookeOptions<T>` | `undefined` | 傳給 useCookie 的選項，readonly 只能是 `false` 或不設定 |

## 回傳

| 成員 | 型別 | 說明 |
| --- | --- | --- |
| `cookie` | `CookieRef<T \| undefined>` | 底層 useCookie 的 ref |
| `value` | `T \| undefined` | 取得或設定 cookie 值 |
| `patch` | `(newValue: T) => void` | 展開合併後寫回 |
| `del` | `() => void` | 刪除 cookie |

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useCookieProxy.ts | [app/composables/useCookieProxy.ts](../../../../app/composables/useCookieProxy.ts) |

[useCookieProxy.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

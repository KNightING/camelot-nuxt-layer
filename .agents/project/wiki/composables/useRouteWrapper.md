# useRouteWrapper

> 針對固定路徑（path）封裝 `router.push` / `router.replace`，提供便捷的導航方法。

## 簽章
```ts
export const useRouteWrapper = (path: string) => ({
  to,
  replace,
  path,
})
```

## 參數
| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `path` | `string` | （必填） | 目標路徑。 |

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `to` | `(options?: RouteLocationAsRelativeGeneric \| RouteLocationAsPathGeneric) => ...` | 以 `router.push` 導向 `path`，可額外合併 route 選項（如 query、params）。 |
| `replace` | `(options?: RouteLocationAsRelativeGeneric \| RouteLocationAsPathGeneric) => ...` | 以 `router.replace` 導向 `path`。 |
| `path` | `string` | 傳入的路徑。 |

## 用法
```ts
const userPage = useRouteWrapper('/user')

userPage.to() // router.push({ path: '/user' })
userPage.to({ query: { id: '1' } }) // 合併選項
userPage.replace()
```

## 備註
- `options` 會覆蓋展開於 `{ path, ...options }` 之上；由於 `path` 在前，傳入 `options` 中的 `path` 會覆蓋預設值。
- 內部使用 Nuxt 的 `useRouter()` 與 `useRoute()`。

---
[🏠 Wiki](../index.md)

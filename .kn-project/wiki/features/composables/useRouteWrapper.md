# useRouteWrapper

## Summary

useRouteWrapper 針對一個固定路徑包裝 Nuxt router 的 push 與 replace，回傳 to、replace 兩個導航方法與路徑本身，讓頁面導航可以集中定義、在各處重用，並可額外合併 query、hash 等路由選項。

## 介面

### 簽章

```ts
const useRouteWrapper: (path: string) => {
  to: (options?: RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric) => ReturnType<Router['push']>
  replace: (options?: RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric) => ReturnType<Router['replace']>
  path: string
}
```

### 參數

| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `path` | `string` | 必填 | 目標路徑 |

### 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `to` | `(options?) => Promise` | 以 `router.push` 導向 `path`，合併傳入的路由選項 |
| `replace` | `(options?) => Promise` | 以 `router.replace` 導向 `path`，合併傳入的路由選項 |
| `path` | `string` | 傳入的路徑 |

來源：1. [useRouteWrapper.ts][]

## 用法

```ts
const userPage = useRouteWrapper('/user')

userPage.to() // router.push({ path: '/user' })
userPage.to({ query: { id: '1' } }) // 合併選項
userPage.replace()
```

## 規則

| 規則 | 說明 |
| --- | --- |
| 合併順序 | 以 `{ path, ...options }` 組成目標，`options` 內的 `path` 會覆蓋固定路徑 |
| 呼叫時機 | 建立時呼叫 `useRouter`，須在 setup 或 Nuxt 環境內建立 |

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useRouteWrapper.ts | [app/composables/useRouteWrapper.ts](../../../../app/composables/useRouteWrapper.ts) |

[useRouteWrapper.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

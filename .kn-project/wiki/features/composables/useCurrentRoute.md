# useCurrentRoute

## Summary

`useCurrentRoute()` 回傳 router 目前路由的當下值，用來避開 Nuxt 的 `useRoute()` 在部分情境沒有即時更新的問題。回傳的是一次性的路由物件，不是 ref，之後的導覽不會反映到已取得的值。

## 運作方式

1. 呼叫 useRouter 取得 router。
2. 讀取 currentRoute 的值並直接回傳。
3. 需要最新路由時要重新呼叫；要在模板或 computed 中追蹤變化，請在 computed 內呼叫。

來源：1. [useCurrentRoute.ts][]

## 用法

```ts
const path = computed(() => useCurrentRoute().path)
```

## 簽章

```ts
useCurrentRoute(): RouteLocationNormalizedLoaded
```

## 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| （回傳值） | `RouteLocationNormalizedLoaded` | 呼叫當下的路由資訊 |

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useCurrentRoute.ts | [app/composables/useCurrentRoute.ts](../../../../app/composables/useCurrentRoute.ts) |

[useCurrentRoute.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

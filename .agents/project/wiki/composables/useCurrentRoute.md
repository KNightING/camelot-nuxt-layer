# useCurrentRoute

> 透過 `useRouter().currentRoute.value` 取得目前路由，避開 `useRoute()` 未更新的問題。

## 簽章
```ts
useCurrentRoute(): RouteLocationNormalizedLoaded
```

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| （回傳值） | `RouteLocationNormalizedLoaded` | `useRouter().currentRoute.value`，目前的路由資訊。 |

## 用法
```ts
const route = useCurrentRoute()
console.log(route.path)
```

## 備註
- 針對 `useRoute()` 在部分情境未即時更新的問題而設計。
- 相關 issue：nuxt/nuxt#28804、nuxt/nuxt#21340。

---
[🏠 Wiki](../index.md)

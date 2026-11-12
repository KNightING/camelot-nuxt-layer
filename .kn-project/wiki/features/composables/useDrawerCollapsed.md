# useDrawerCollapsed

## Summary

`useDrawerCollapsed()` 回傳一個跨元件共享的抽屜收合狀態 ref，預設為收合。狀態以 Nuxt 的 useState 保存：瀏覽器端所有呼叫端讀寫同一份，伺服器端每個請求各自一份。

## 運作方式

1. 以固定的 key 呼叫 Nuxt 的 useState，初始值為 `true`。
2. 瀏覽器端每次呼叫都取得同一份狀態，任一處改值，其他使用處同步更新。
3. 伺服器端渲染時，每個請求各自一份狀態，請求之間互不影響。
4. 狀態不持久化，重新整理後回到收合。

來源：1. [useDrawerCollapsed.ts](../../../../app/composables/useDrawerCollapsed.ts)

## 用法

```ts
const collapsed = useDrawerCollapsed()
collapsed.value = false
```

## 簽章

```ts
useDrawerCollapsed(): Ref<boolean>
```

## 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| （回傳值） | `Ref<boolean>` | 共享的收合狀態，`true` 為收合 |

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

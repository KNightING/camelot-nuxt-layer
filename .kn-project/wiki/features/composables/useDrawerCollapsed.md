# useDrawerCollapsed

## Summary

`useDrawerCollapsed()` 回傳一個跨元件共享的抽屜收合狀態 ref，預設為收合。狀態是模組層的單一 ref，所有呼叫端讀寫同一份。

## 運作方式

1. 模組載入時建立一個初始值為 `true` 的 ref。
2. 每次呼叫都回傳同一個 ref，任一處改值，其他使用處同步更新。
3. 狀態不持久化，重新整理後回到收合。
4. 伺服器端渲染時，這個模組層 ref 會被同一個伺服器程序的所有請求共用。

來源：1. [useDrawerCollapsed.ts][]

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

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useDrawerCollapsed.ts | [app/composables/useDrawerCollapsed.ts](../../../../app/composables/useDrawerCollapsed.ts) |

[useDrawerCollapsed.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

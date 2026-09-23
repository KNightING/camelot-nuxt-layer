# useDrawerCollapsed

## Summary

`useDrawerCollapsed()` 回傳一個跨元件共享的抽屜收合狀態 ref，預設為收合。狀態以 Nuxt 的 useState 保存：瀏覽器端所有呼叫端讀寫同一份，伺服器端每個請求各自一份。

## 運作方式

1. 以固定的 key 呼叫 Nuxt 的 useState，初始值為 `true`。
2. 瀏覽器端每次呼叫都取得同一份狀態，任一處改值，其他使用處同步更新。
3. 伺服器端渲染時，每個請求各自一份狀態，請求之間互不影響。
4. 狀態不持久化，重新整理後回到收合。

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
| 2026-09-23 | — | [2609231702-fix-wiki-review-code-defects](../../../archive/2609231702-fix-wiki-review-code-defects.md) | 修正程式碼缺陷後更新為修正後的行為 | [#47](https://github.com/KNightING/camelot-nuxt-layer/issues/47) | — |
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useDrawerCollapsed.ts | [app/composables/useDrawerCollapsed.ts](../../../../app/composables/useDrawerCollapsed.ts) |

[useDrawerCollapsed.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

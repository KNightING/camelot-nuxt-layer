# useDelay

## Summary

`useDelay(ms)` 回傳一個在指定毫秒後 resolve 的 Promise，用於非同步流程中的等待。

## 運作方式

1. 呼叫當下以 toValue 讀取毫秒數，之後 ref 再變動不影響這次等待。
2. 以 setTimeout 計時，到期後 resolve。
3. 沒有取消機制。

來源：1. [useDelay.ts][]

## 用法

```ts
await useDelay(1000)
```

## 簽章

```ts
useDelay(milliseconds: MaybeRef<number>): Promise<void>
```

## 參數

| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `milliseconds` | `MaybeRef<number>` | — | 等待的毫秒數 |

## 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| （回傳值） | `Promise<void>` | 計時到期後 resolve |

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useDelay.ts | [app/composables/useDelay.ts](../../../../app/composables/useDelay.ts) |

[useDelay.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

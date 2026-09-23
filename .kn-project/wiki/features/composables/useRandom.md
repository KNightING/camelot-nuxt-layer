# useRandom

## Summary

useRandom 回傳介於 min 與 max 之間、兩端都包含的隨機整數，以 Math.random 計算，不適合用在需要密碼學安全的場合。它是純函式，每次呼叫產生一個新值。

## 介面

### 簽章

```ts
const useRandom: (min?: number, max?: number) => number
```

### 參數

| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `min` | `number` | `0` | 最小值，包含 |
| `max` | `number` | `Number.MAX_VALUE` | 最大值，包含 |

### 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| 回傳值 | `number` | `Math.floor(Math.random() * (max - min + 1)) + min` |

來源：1. [useRandom.ts][]

## 用法

```ts
useRandom(1, 6) // 1 到 6 之間的隨機整數
```

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useRandom.ts | [app/composables/useRandom.ts](../../../../app/composables/useRandom.ts) |

[useRandom.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

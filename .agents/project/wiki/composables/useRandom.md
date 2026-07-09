# useRandom

> 產生介於 `min` 與 `max`（含）之間的隨機整數。

## 簽章
```ts
const useRandom: (min?: number, max?: number) => number
```

## 參數
| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `min` | `number` | `0` | 最小值（含）。 |
| `max` | `number` | `Number.MAX_VALUE` | 最大值（含）。 |

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| （回傳值） | `number` | `Math.floor(Math.random() * (max - min + 1)) + min` 計算出的隨機整數。 |

## 用法
```ts
useRandom(1, 6) // 1~6 之間的隨機整數
```

---
[🏠 Wiki](../index.md)

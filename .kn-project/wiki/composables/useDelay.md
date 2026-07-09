# useDelay

> 回傳一個在指定毫秒後 resolve 的 Promise，用於非同步延遲。

## 簽章
```ts
useDelay(milliseconds: MaybeRef<number>): Promise<void>
```

## 參數
| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `milliseconds` | `MaybeRef<number>` | — | 延遲的毫秒數，內部以 `toValue` 解析。 |

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| （回傳值） | `Promise<void>` | 於 `setTimeout` 到期後 resolve。 |

## 用法
```ts
await useDelay(1000) // 等待 1 秒
```

## 備註
- 內部使用 `setTimeout`。

---
[🏠 Wiki](../index.md)

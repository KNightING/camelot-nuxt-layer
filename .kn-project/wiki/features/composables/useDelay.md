# useDelay

## Summary

`useDelay(ms)` 回傳一個在指定毫秒後 resolve 的 Promise，用於非同步流程中的等待。

## 運作方式

1. 呼叫當下以 toValue 讀取毫秒數，之後 ref 再變動不影響這次等待。
2. 以 setTimeout 計時，到期後 resolve。
3. 沒有取消機制。

來源：1. [useDelay.ts](../../../../app/composables/useDelay.ts)

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

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

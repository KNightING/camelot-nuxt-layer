# useInfinitePage

> 結合 `useScrollOnBottom` 實作無限捲動載入：捲動到底且非載入中、非結尾時，節流呼叫 `nextPage`。

## 簽章
```ts
const useInfinitePage: (options: {
  nextPage: VoidFunction
  isPending: Ref<boolean | null | undefined>
  isEnd?: Ref<boolean | null | undefined>
  target?: MaybeRefOrGetter<HTMLElement | SVGElement | null | undefined>
  offset?: MaybeRefOrGetter<number>
}) => void
```

## 參數
| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `nextPage` | `VoidFunction` | — | 載入下一頁的函式。 |
| `isPending` | `Ref<boolean \| null \| undefined>` | — | 是否載入中；為真時不觸發下一頁。 |
| `isEnd` | `Ref<boolean \| null \| undefined>` | — | 是否已到最後一頁；為真時不觸發下一頁。 |
| `target` | `MaybeRefOrGetter<HTMLElement \| SVGElement \| null \| undefined>` | `window` | 捲動監聽目標，傳入 `useScrollOnBottom`。 |
| `offset` | `MaybeRefOrGetter<number>` | `20` | 到底容差，傳入 `useScrollOnBottom`。 |

## 回傳
無（此 composable 不回傳值）。

## 用法
```ts
useInfinitePage({
  nextPage: loadMore,
  isPending,
  isEnd,
})
```

## 備註
- `nextPage` 以 `useThrottleFn` 包裝進行節流；觸發前檢查 `isEnd` 與 `isPending`。
- 監聽 `isOnBottom`（`{ immediate: true }`），為真時呼叫節流函式。
- client 端額外監聽 `isPending`：載入結束後延遲 100ms，若 `documentElement.scrollHeight <= clientHeight`（頁面無法捲動）則再次嘗試載入下一頁；重複觸發前會 `clearTimeout`。

---
[🏠 Wiki](../index.md)

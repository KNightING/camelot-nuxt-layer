# useCamelotVirtual

> 可變列高的虛擬視窗計算（量測後快取列高），提供可視範圍、前後留白與捲動控制。

## 簽章
```ts
useCamelotVirtual(
  scrollEl: Ref<HTMLElement | null | undefined>,
  count: MaybeRefOrGetter<number>,
  estimate: MaybeRefOrGetter<number>,
  options?: {
    overscan?: MaybeRefOrGetter<number>
    horizontal?: MaybeRefOrGetter<boolean>
    headerOffset?: MaybeRefOrGetter<number>
  },
): {
  range: ComputedRef<{ start: number; end: number }>
  visibleIndices: ComputedRef<number[]>
  topPad: ComputedRef<number>
  bottomPad: ComputedRef<number>
  totalSize: ComputedRef<number>
  setSize: (index: number, size: number) => void
  scrollToIndex: (index: number) => void
  readScroll: () => void
}
```

## 參數
| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `scrollEl` | `Ref<HTMLElement \| null \| undefined>` | — | 捲動容器。 |
| `count` | `MaybeRefOrGetter<number>` | — | 項目總數。 |
| `estimate` | `MaybeRefOrGetter<number>` | — | 預估單項尺寸（px）。 |
| `options.overscan` | `MaybeRefOrGetter<number>` | `4` | 視窗前後多渲染的項目數。 |
| `options.horizontal` | `MaybeRefOrGetter<boolean>` | — | 水平模式（以 width／`scrollLeft` 計）。 |
| `options.headerOffset` | `MaybeRefOrGetter<number>` | `0` | 虛擬項目開始前於捲動內容中的固定偏移（如 sticky header + pinned 列高）。 |

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `range` | `ComputedRef<{ start; end }>` | 目前應渲染的索引範圍（含 overscan）。 |
| `visibleIndices` | `ComputedRef<number[]>` | `range` 內的索引陣列。 |
| `topPad` | `ComputedRef<number>` | 前方留白（撐高）尺寸。 |
| `bottomPad` | `ComputedRef<number>` | 後方留白尺寸。 |
| `totalSize` | `ComputedRef<number>` | 所有項目的總尺寸。 |
| `setSize` | `(index, size) => void` | 由呼叫端回報某項的實際尺寸以修正快取。 |
| `scrollToIndex` | `(index) => void` | 捲動至指定索引位置（含 `headerOffset`）。 |
| `readScroll` | `() => void` | 重新讀取捲動位置與視窗尺寸。 |

## 用法
```ts
const scrollEl = ref<HTMLElement | null>(null)
const { visibleIndices, topPad, bottomPad, setSize } = useCamelotVirtual(
  scrollEl, () => items.length, 48, { overscan: 6 },
)
```

## 備註
- `sizes` 長度隨 `count` 同步，新項目以 `estimate` 填入；`offsets` 為前綴和，`findIndex` 以二分搜尋定位。
- `watch(scrollEl)`（immediate）掛載 `scroll` 事件監聽與 `ResizeObserver`，並於 cleanup 時移除；`window` 未定義時不執行。

---
[🏠 Wiki](../index.md)

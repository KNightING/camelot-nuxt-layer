# useCamelotVirtual

## Summary

`useCamelotVirtual(scrollEl, count, estimate, options)` 是可變列高的虛擬視窗計算：先以預估尺寸排版，渲染後由呼叫端回報實際尺寸並快取，逐步修正可視範圍。回傳前後留白尺寸，呼叫端以「前後撐高、中間實際渲染」的方式虛擬化，div 或表格的 spacer 列皆適用。VirtualScroll 與 Table 以它實作。

## 運作方式

### 計算流程

1. 尺寸陣列長度隨項目總數同步，新項目以預估尺寸填入。
2. 前綴和記錄每一項的起始位置，總尺寸即最後一項的結束位置。
3. 可視上緣是捲動位置扣掉 headerOffset，下緣再加上可視高度或寬度。
4. 以二分搜尋找出上下緣所在的索引，前後各加 overscan 項，得到渲染範圍。
5. 前方留白為範圍起點的位置，後方留白為總尺寸扣掉範圍終點的位置。

來源：1. [useCamelotVirtual.ts][]

### 尺寸回報與效能

| 設計 | 說明 |
| --- | --- |
| 原地寫入 | 尺寸存在非響應式陣列，setSize 為 O(1)，不複製整條陣列 |
| 版本計數 | 另以一個 ref 作為響應式訊號，同一輪的多次 setSize 以 microtask 合併成一次遞增 |
| 增量前綴和 | 記下最小受影響索引，只重算其後的區間，前段沿用快取 |
| 不用 computed | 前綴和快取重用同一個陣列參照，computed 以 Object.is 比對會停止更新；改由各 computed 自行讀取版本計數 |
| 忽略的回報 | 尺寸小於等於 0、與快取相同，或索引超出範圍時略過 |

來源：1. [useCamelotVirtual.ts][]

### 捲動監聽

1. 捲動容器出現時立即讀取一次捲動位置與可視尺寸。
2. 監聽容器的 scroll 事件，並以 ResizeObserver 觀察容器尺寸，兩者都重新讀取。
3. 容器更換或卸載時移除監聽；沒有 window 時不掛載。

來源：1. [useCamelotVirtual.ts][]

## 用法

```ts
const scrollEl = ref<HTMLElement | null>(null)
const { visibleIndices, topPad, bottomPad, setSize } = useCamelotVirtual(
  scrollEl, () => items.value.length, 48, { overscan: 6 },
)
```

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
| `scrollEl` | `Ref<HTMLElement \| null \| undefined>` | — | 捲動容器 |
| `count` | `MaybeRefOrGetter<number>` | — | 項目總數 |
| `estimate` | `MaybeRefOrGetter<number>` | — | 預估單項尺寸，單位 px |
| `options.overscan` | `MaybeRefOrGetter<number>` | `4` | 可視範圍前後多渲染的項目數 |
| `options.horizontal` | `MaybeRefOrGetter<boolean>` | `false` | 水平模式，以寬度與橫向捲動計算 |
| `options.headerOffset` | `MaybeRefOrGetter<number>` | `0` | 虛擬項目之前的固定偏移，例如 sticky 表頭加釘選列的高度 |

## 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `range` | `ComputedRef<{ start; end }>` | 應渲染的索引範圍，含 overscan，end 不含 |
| `visibleIndices` | `ComputedRef<number[]>` | 範圍內的索引陣列 |
| `topPad` | `ComputedRef<number>` | 前方留白尺寸 |
| `bottomPad` | `ComputedRef<number>` | 後方留白尺寸 |
| `totalSize` | `ComputedRef<number>` | 所有項目的總尺寸 |
| `setSize` | `(index, size) => void` | 回報某項的實際尺寸 |
| `scrollToIndex` | `(index) => void` | 捲動到指定項目，位置含 headerOffset |
| `readScroll` | `() => void` | 手動重新讀取捲動位置與可視尺寸 |

## 相關頁面

- [VirtualScroll](../components/VirtualScroll.md)
- [Table](../components/Table.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useCamelotVirtual.ts | [app/composables/useCamelotVirtual.ts](../../../../app/composables/useCamelotVirtual.ts) |

[useCamelotVirtual.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

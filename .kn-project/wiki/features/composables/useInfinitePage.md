# useInfinitePage

## Summary

useInfinitePage 實作無限捲動載入：以 useScrollOnBottom 偵測是否捲到底，到底且不在載入中、也還沒到最後一頁時，節流呼叫 nextPage。資料少到頁面無法捲動時，載入結束後會自動再補載下一頁，直到頁面能捲動或到底為止。

## 介面

### 簽章

```ts
const useInfinitePage: (options: {
  nextPage: VoidFunction
  isPending: Ref<boolean | null | undefined>
  isEnd?: Ref<boolean | null | undefined>
  target?: MaybeRefOrGetter<HTMLElement | SVGElement | null | undefined>
  offset?: MaybeRefOrGetter<number>
}) => void
```

### 參數

| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `nextPage` | `VoidFunction` | 必填 | 載入下一頁的函式 |
| `isPending` | `Ref<boolean \| null \| undefined>` | 必填 | 是否載入中；為真時不觸發 |
| `isEnd` | `Ref<boolean \| null \| undefined>` | — | 是否已到最後一頁；為真時不觸發 |
| `target` | `MaybeRefOrGetter<HTMLElement \| SVGElement \| null \| undefined>` | — | 捲動監聽目標，傳給 useScrollOnBottom；未指定時掛載後改用 `window` |
| `offset` | `MaybeRefOrGetter<number>` | `20` | 到底容差像素，傳給 useScrollOnBottom |

### 回傳

無。

來源：1. [useInfinitePage.ts][]　2. [useScrollOnBottom.ts][]

## 用法

```ts
useInfinitePage({
  nextPage: loadMore,
  isPending,
  isEnd,
})
```

## 運作方式

1. 以 VueUse 的 `useThrottleFn` 包裝 `nextPage`，執行前檢查 `isEnd` 與 `isPending`。
2. 以 immediate 監聽 `isOnBottom`，變成真時呼叫節流後的函式。
3. 在瀏覽器端另外監聽 `isPending`：載入結束後等 100ms。
4. 若此時整頁高度不超過可視高度，也就是頁面還不能捲動，就再呼叫一次節流後的函式。

| 規則 | 說明 |
| --- | --- |
| 補載判斷對象 | 永遠看整頁的捲動高度，不看自訂 `target` |
| 伺服端 | 未傳 `target` 時交給 useScrollOnBottom 在掛載後才取 `window`，伺服端呼叫不會出錯 |

## 相關頁面

- [useScrollOnBottom](./useScrollOnBottom.md)：到底偵測。

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231702-fix-wiki-review-code-defects](../../../archive/2609231702-fix-wiki-review-code-defects.md) | 修正程式碼缺陷後更新為修正後的行為 | [#47](https://github.com/KNightING/camelot-nuxt-layer/issues/47) | — |
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useInfinitePage.ts | [app/composables/useInfinitePage.ts](../../../../app/composables/useInfinitePage.ts) |
| useScrollOnBottom.ts | [app/composables/useScrollOnBottom.ts](../../../../app/composables/useScrollOnBottom.ts) |

[useInfinitePage.ts]: #references
[useScrollOnBottom.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

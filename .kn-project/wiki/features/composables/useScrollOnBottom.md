# useScrollOnBottom

## Summary

useScrollOnBottom 偵測指定捲動目標是否已捲到底部，容許一段像素容差，回傳響應式的 isOnBottom。目標可以是 window、document 或任一元素，預設為 window。它在元件掛載後才開始監聽，是 useInfinitePage 的底層。

## 介面

### 簽章

```ts
const useScrollOnBottom: (options?: {
  target?: MaybeRefOrGetter<HTMLElement | SVGElement | Window | Document | null | undefined>
  offset?: MaybeRefOrGetter<number>
}) => {
  isOnBottom: Ref<boolean>
}
```

### 參數

| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `options.target` | `MaybeRefOrGetter<HTMLElement \| SVGElement \| Window \| Document \| null \| undefined>` | `window` | 捲動監聽目標，解析規則見下表 |
| `options.offset` | `MaybeRefOrGetter<number>` | `20` | 判定到底的容差像素 |

### 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `isOnBottom` | `Ref<boolean>` | 捲動位置加可視高度大於等於總高度減容差時為 `true` |

來源：1. [useScrollOnBottom.ts][]

## 用法

```ts
const { isOnBottom } = useScrollOnBottom({ offset: 40 })
```

## 運作方式

1. 元件掛載後才解析目標並註冊事件；掛載前 `isOnBottom` 固定為 `false`。
2. 監聽目標的 scroll 事件，以及 window 與 visualViewport 的 resize 事件。
3. 事件觸發時以 `requestAnimationFrame` 排程一次檢查。
4. 註冊後不會主動檢查一次，第一次捲動或縮放前 `isOnBottom` 都是 `false`。

| 目標解析 | 使用的數值 |
| --- | --- |
| 未傳 `target` | 視為 window |
| 傳入但解析為 `undefined`，或為 Document | 改用 `document.scrollingElement` |
| window | `scrollY`；可視高度取 visualViewport 高度或 `innerHeight`；總高度取整頁 `scrollHeight` |
| 元素 | 元素自身的 `scrollTop`、`clientHeight`、`scrollHeight` |

| 規則 | 說明 |
| --- | --- |
| 目標型別 | 是否為 window 只在掛載時判定一次，之後切換目標型別不會改變監聽方式 |
| 目標為 `null` | 總高度當作 0，視窗縮放時 `isOnBottom` 會變成 `true` |

## 相關頁面

- [useInfinitePage](./useInfinitePage.md)：以到底偵測實作無限捲動。

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useScrollOnBottom.ts | [app/composables/useScrollOnBottom.ts](../../../../app/composables/useScrollOnBottom.ts) |

[useScrollOnBottom.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

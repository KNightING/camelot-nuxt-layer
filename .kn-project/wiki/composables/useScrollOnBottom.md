# useScrollOnBottom

> 偵測指定捲動目標是否已捲動至底部（含 offset 容差），回傳響應式 `isOnBottom`。

## 簽章
```ts
const useScrollOnBottom: (options?: {
  target?: MaybeRefOrGetter<HTMLElement | SVGElement | Window | Document | null | undefined>
  offset?: MaybeRefOrGetter<number>
}) => {
  isOnBottom: Ref<boolean>
}
```

## 參數
| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `options.target` | `MaybeRefOrGetter<HTMLElement \| SVGElement \| Window \| Document \| null \| undefined>` | `window` | 捲動監聽目標。`undefined` 時視為 `window`；解析後為 `undefined` 或 `Document` 時使用 `document.scrollingElement`。 |
| `options.offset` | `MaybeRefOrGetter<number>` | `20` | 判定到底的容差像素。 |

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `isOnBottom` | `Ref<boolean>` | 當 `scrollTop + viewportHeight >= totalHeight - offset` 時為 `true`。 |

## 用法
```ts
const { isOnBottom } = useScrollOnBottom({ offset: 40 })
```

## 備註
- 邏輯於 `tryOnMounted` 中初始化。
- 目標為 `Window` 時使用 `scrollY`、`visualViewport.height`/`innerHeight`、`documentElement.scrollHeight`；否則使用元素的 `scrollTop`/`clientHeight`/`scrollHeight`。
- 捲動、`window` resize 與 `visualViewport` resize 事件皆透過 `useEventListener` 監聽，並以 `requestAnimationFrame` 排程檢查。

---
[🏠 Wiki](../index.md)

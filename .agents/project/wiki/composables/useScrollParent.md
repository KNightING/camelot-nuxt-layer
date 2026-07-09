# useScrollParent

> 由指定元素往上尋找第一個可捲動（`scrollHeight > clientHeight`）的父層元素，回傳響應式結果。

## 簽章
```ts
function useScrollParent(target?: MaybeElementRef): ComputedRef<HTMLElement | null>
```

## 參數
| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `target` | `MaybeElementRef` | — | 起始元素（透過 `unrefElement` 取值）。 |

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `scrollParent` | `ComputedRef<HTMLElement \| null>` | 遞迴向上尋得的可捲動父元素；找不到則為 `null`。 |

## 用法
```ts
const el = ref<HTMLElement>()
const scrollParent = useScrollParent(el)
```

## 備註
- 遞迴檢查：若節點 `scrollHeight > clientHeight` 即回傳該節點，否則往 `parentElement` 繼續尋找。
- 節點為 null/undefined 時回傳 `null`。

---
[🏠 Wiki](../index.md)

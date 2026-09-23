# useScrollParent

## Summary

useScrollParent 從指定元素本身開始往上找，回傳第一個內容高度超過可視高度的元素，也就是最近的捲動容器；找不到時為 null。結果是 computed，只在目標元素改變時重算，不會因為內容高度變化而更新。

## 介面

### 簽章

```ts
function useScrollParent(target?: MaybeElementRef): ComputedRef<HTMLElement | null>
```

### 參數

| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `target` | `MaybeElementRef` | — | 起始元素，以 `unrefElement` 取值 |

### 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| 回傳值 | `ComputedRef<HTMLElement \| null>` | 找到的捲動容器；找不到或目標為空時為 `null` |

來源：1. [useScrollParent.ts][]

## 用法

```ts
const el = ref<HTMLElement>()
const scrollParent = useScrollParent(el)
```

## 規則

| 規則 | 說明 |
| --- | --- |
| 判定條件 | 只比較 `scrollHeight` 與 `clientHeight`，不看 CSS overflow 設定 |
| 起點 | 包含目標元素自己；目標本身可捲動時直接回傳它 |
| 方向 | 只判斷垂直方向 |
| 重算時機 | 目標元素改變時；內容高度變化不會觸發 |

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useScrollParent.ts | [app/composables/useScrollParent.ts](../../../../app/composables/useScrollParent.ts) |

[useScrollParent.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

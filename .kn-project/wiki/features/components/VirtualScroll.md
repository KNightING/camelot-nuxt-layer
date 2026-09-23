# VirtualScroll

## Summary

泛型虛擬滾動容器：只渲染可視範圍內的項目，渲染後量測實際尺寸修正範圍，因此項目不必等高；支援垂直與水平方向、前後預繪數量與捲到指定索引。匯入名稱為 `CamelotVirtualScroll`（Nuxt 自動匯入）。

## 運作方式

### 可變高度計算

VirtualScroll 不要求項目等高，可視範圍由 [useCamelotVirtual](../composables/useCamelotVirtual.md) 計算：

1. 尚未量測的項目以預估尺寸計算。
2. 項目渲染後以尺寸觀察量出實際尺寸，寫回尺寸快取；水平時量寬度，垂直時量高度。
3. 依尺寸快取維護前綴和位移；只有變動點之後的區段需要重算。
4. 依捲動位置以二分搜尋找出可視範圍，前後再多渲染設定的預繪數量。
5. 元件拿回前後留白與可視索引組出清單，並對外提供捲到指定索引的方法。

[Table](./Table.md) 的虛擬滾動使用同一個 composable。

來源：1. [VirtualScroll.vue][]　2. [useCamelotVirtual.ts][]

### 項目鍵與插槽

1. 項目鍵依序取：取值函式的結果、項目中指定欄位的值，都沒有時用索引。
2. 可視索引先解析成索引與項目的配對，濾掉不存在的項目後才交給插槽，插槽拿到的項目一定有值。
3. 項目清單換成新陣列時，重新讀取捲動位置並量測一次。

來源：1. [VirtualScroll.vue][]

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `items` | `T[]` | — | 資料項目陣列，必填。 |
| `itemKey` | `string \| ((item: T, index: number) => string \| number)` | — | 每項唯一鍵：欄位名或取值函式，預設用索引。 |
| `estimatedItemSize` | `number` | `44` | 預估單項尺寸，單位 px，用於尚未量測的項目。 |
| `overscan` | `number` | `4` | 可視範圍前後多渲染的項目數。 |
| `horizontal` | `boolean` | `false` | 水平虛擬滾動。 |
| `height` | `string` | — | 固定高度，例如 `'320px'`。 |
| `maxHeight` | `string` | — | 最大高度，內容不足時自適應。 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | `{ item: T, index: number }` | 單一項目的呈現，`item` 保證不是 `undefined`。 |

## Exposed
| 名稱 | 說明 |
| :--- | :--- |
| `scrollToIndex` | 捲動至指定索引的項目。 |

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| VirtualScroll.vue | [app/components/Camelot/VirtualScroll.vue](../../../../app/components/Camelot/VirtualScroll.vue) |
| useCamelotVirtual.ts | [app/composables/useCamelotVirtual.ts](../../../../app/composables/useCamelotVirtual.ts) |

[VirtualScroll.vue]: #references
[useCamelotVirtual.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

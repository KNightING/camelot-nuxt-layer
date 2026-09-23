# RippleTabs

## Summary

`CamelotRippleTabs` 是可水平捲動的膠囊式分頁列：每個分頁點擊時有漣漪效果，選中的分頁以色彩角色的 container 色階標示，並自動捲到分頁列中央。資料可以是字串陣列或物件陣列，也能用預設 slot 完全自訂分頁外觀。泛型元件，資料型別由 `data` 推得。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `data` | `T[]` | — | 分頁資料陣列 |
| `displayKey` | `string` | — | 項目為物件時用來顯示的欄位鍵 |
| `modelValue` | `number` | — | 目前選中的索引 |
| `scrollSmooth` | `boolean` | `true` | 選中時是否平滑捲動 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色，選中態使用它的 container 色階 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `update:modelValue` | `value?: number` | 選中索引變更時觸發 |
| `changedWithClick` | `value: number` | 由點擊造成選中變更時觸發 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `number` | 目前選中的索引 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | `{ data: T, index: number, isSelected: boolean }` | 自訂單一分頁內容；預設為帶漣漪的膠囊分頁 |

## 運作方式

### 選取與捲動

1. 點擊未選中的分頁：更新選中索引，並發出 `changedWithClick`；點已選中的分頁不動作。
2. 選中索引改變時，不論來自點擊或外部，分頁列都捲動讓該分頁置中，最左只捲到起點。
3. `scrollSmooth` 為假時直接跳到目標位置。

來源：1. [RippleTabs.vue][]

### 顯示文字與外觀

1. 項目是物件且 `displayKey` 是它的欄位時，顯示該欄位的值；否則直接顯示項目本身。
2. 分頁不換行，間距 20px，捲軸隱藏。
3. 未選中分頁用表面底色；選中分頁的底色、框線與文字改用色彩角色的 container 色階。

來源：1. [RippleTabs.vue][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| RippleTabs.vue | [app/components/Camelot/RippleTabs.vue](../../../../app/components/Camelot/RippleTabs.vue) |

[RippleTabs.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

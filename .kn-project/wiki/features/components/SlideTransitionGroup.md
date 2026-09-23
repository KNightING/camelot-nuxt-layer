# SlideTransitionGroup

## Summary

以左右滑動轉場切換單一顯示項目的泛型容器：同一時間只顯示目前索引的項目，透過公開的上一項、下一項方法切換。匯入名稱為 `CamelotSlideTransitionGroup`（Nuxt 自動匯入）。

## 運作方式

1. 項目清單每項需含唯一的 key 與 value，data 可選，會傳給插槽。
2. 只渲染索引等於目前值的項目，並置中疊放。
3. 上一項：索引減 1，以向右滑動的轉場切換；索引已小於等於 0 時不作動。
4. 下一項：索引加 1，以向左滑動的轉場切換；索引已大於等於項目數時不作動。
5. 下一項的上限是項目數本身，此時畫面上沒有項目，使用端需自行在最後一項停止呼叫。

來源：1. [SlideTransitionGroup.vue][]　2. [items.ts][]

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `items` | `Items<T>` | — | 項目清單，每項需含 `key` 與 `value`，`data` 可選。 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model` | `number` | 目前顯示項目的索引，預設 `0`。 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | `{ item, data, index }` | 目前項目、其 `data` 與索引。 |

## Exposed
| 名稱 | 說明 |
| :--- | :--- |
| `prev` | 切換至上一項。 |
| `next` | 切換至下一項。 |

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| SlideTransitionGroup.vue | [app/components/Camelot/SlideTransitionGroup.vue](../../../../app/components/Camelot/SlideTransitionGroup.vue) |
| items.ts | [shared/types/items.ts](../../../../shared/types/items.ts) |

[SlideTransitionGroup.vue]: #references
[items.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

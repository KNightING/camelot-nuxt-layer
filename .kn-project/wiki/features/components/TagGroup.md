# TagGroup

## Summary

可新增與刪除的標籤群組：以 Tag 列出目前標籤，尾端的新增按鈕展開行內輸入框，支援去重、逐項鎖定、逐項顏色與外觀，以及數量上限。匯入名稱為 `CamelotTagGroup`（Nuxt 自動匯入）。

## 運作方式

### 項目格式

每一項可以是純字串，或帶 label、color、variant、locked 的物件；物件沒給的欄位沿用群組預設。

來源：1. [TagGroup.vue][]　2. [camelot.ts][]

### 新增

1. 點新增按鈕展開輸入框並自動聚焦。
2. 按 Enter 或輸入框失焦時提交；按 Esc 取消並關閉輸入框。
3. 提交空白內容時直接關閉輸入框。
4. 不允許重複時，輸入已存在的值會清空輸入框但不新增。
5. 新增成功後發出新增與變更事件。
6. 連續新增模式下輸入框保持開啟；關閉連續新增或達到上限時，新增後自動關閉。

來源：1. [TagGroup.vue][]

### 刪除與停用

| 情境 | 行為 |
|---|---|
| 點標籤的關閉鈕 | 移除該項，發出移除與變更事件 |
| 輸入框為空時按 Backspace | 移除最後一個標籤 |
| 鎖定項 | 沒有關閉鈕，Backspace 也不會移除 |
| 整組停用 | 隱藏新增按鈕，所有標籤都沒有關閉鈕 |
| 達到數量上限 | 隱藏新增按鈕 |

來源：1. [TagGroup.vue][]

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `color` | `CamelotColorRole` | `'primary'` | 群組預設顏色，逐項可用 `item.color` 覆寫。 |
| `variant` | `CamelotTagVariant` | `'soft'` | 群組預設外觀，逐項可用 `item.variant` 覆寫。 |
| `size` | `'sm' \| 'md'` | `'md'` | 尺寸。 |
| `disabled` | `boolean` | `false` | 整組停用：隱藏新增按鈕並移除刪除鈕。 |
| `addable` | `boolean` | `true` | 是否顯示新增按鈕。 |
| `allowDuplicate` | `boolean` | `false` | 是否允許重複值。 |
| `continuousAdd` | `boolean` | `true` | `true` 新增後維持輸入；`false` 新增一個即關閉輸入框。 |
| `max` | `number` | — | 標籤數上限，未設定表示不限制。 |
| `placeholder` | `string` | `'新增標籤…'` | 輸入框佔位文字。 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `add` | `value: string` | 新增一個標籤時觸發。 |
| `remove` | `value: string, index: number` | 移除一個標籤時觸發。 |
| `change` | `values: CamelotTagInput[]` | 新增或移除後觸發，帶入新清單。 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model` | `CamelotTagInput[]` | 標籤清單，純字串或物件，預設 `[]`。 |

## 相關頁面

- [Tag](./Tag.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| TagGroup.vue | [app/components/Camelot/TagGroup.vue](../../../../app/components/Camelot/TagGroup.vue) |
| camelot.ts | [shared/types/camelot.ts](../../../../shared/types/camelot.ts) |

[TagGroup.vue]: #references
[camelot.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

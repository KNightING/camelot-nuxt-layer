# TimeRow

## Summary

TimeRow（匯入名稱 `CamelotInternalTimeRow`）是時間輸入列，屬內部元件：前方時鐘圖示，接著時、分、秒三個 [TimeField](./Internal-TimeField.md) 欄位，12 小時制時尾端多一顆上午下午切換鈕。DateV2、DateRangeV2、TimeV2 與月曆用它選時間，數值一律以 24 小時制存放。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `precision` | `'hour' \| 'minute' \| 'second'` | `'second'` | 顯示到時、分或秒 |
| `hourFormat` | `'12' \| '24'` | `'24'` | 小時制；12 時顯示 AM、PM 切換鈕 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `change` | — | 時、分、秒或上午下午任一變更時觸發 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model:hours` | `number` | 小時，24 小時制，預設 `0` |
| `v-model:minutes` | `number` | 分鐘，預設 `0` |
| `v-model:seconds` | `number` | 秒，預設 `0` |

## 運作方式

### 精細度

| precision | 顯示欄位 |
| :--- | :--- |
| hour | 時 |
| minute | 時、分 |
| second | 時、分、秒 |

來源：1. [TimeRow.vue][]

### 12 小時制

| 項目 | 行為 |
| :--- | :--- |
| 時欄位範圍 | 1 到 12；24 小時制為 0 到 23 |
| 顯示 | 0 點與 12 點都顯示為 12 |
| 改時 | 依目前上午或下午換算回 24 小時制寫回 |
| AM、PM 鈕 | 小時加 12 後取 24 的餘數，切換上下午 |

來源：1. [TimeRow.vue][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| TimeRow.vue | [app/components/Camelot/Internal/TimeRow.vue](../../../../app/components/Camelot/Internal/TimeRow.vue) |

[TimeRow.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

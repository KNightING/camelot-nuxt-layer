# FieldFrame

## Summary

FieldFrame（匯入名稱 `CamelotInternalFieldFrame`）是表單欄位共用的主題外框，屬內部元件：Sci-Fi 主題時把內容包進 [ScifiFrame](./Scifi-Frame.md) 畫出 HUD 外框，其他主題直接渲染內容、不加任何元素。NumberCounter、DateV2、DateRangeV2、TimeV2 用它讓欄位外觀與 Sci-Fi 的 Input 一致。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `focused` | `boolean` | `false` | 聚焦態，傳給 HUD 外框 |
| `disabled` | `boolean` | `false` | 停用時關閉掃描線與懸停光澤 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | — | 欄位本體 |

## 運作方式

### Sci-Fi 外框

只有 Sci-Fi 主題會產生外框，設定與 Sci-Fi 的 Input 相同：

| 效果 | 條件 |
| :--- | :--- |
| 聚焦外框 | focused 為 true |
| 掃描線 | 未停用 |
| 懸停光澤 | 滑鼠懸停且未停用 |
| 準星啟用 | 聚焦或懸停 |
| 背景格線 | 一律關閉 |

其他主題時元件只輸出插槽內容，欄位的框線與底色由使用端自己的主題樣式負責。

來源：1. [FieldFrame.vue][]

### 使用端

| 元件 | 聚焦態來源 |
| :--- | :--- |
| [DateV2](./DateV2.md) | 月曆開啟中 |
| [DateRangeV2](./DateRangeV2.md) | 月曆開啟中 |
| [TimeV2](./TimeV2.md) | 時間面板開啟中 |
| [NumberCounter](./NumberCounter.md) | 輸入框聚焦中 |

來源：1. [DateV2.vue][]　2. [DateRangeV2.vue][]　3. [TimeV2.vue][]　4. [NumberCounter.vue][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 建立 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| FieldFrame.vue | [app/components/Camelot/Internal/FieldFrame.vue](../../../../app/components/Camelot/Internal/FieldFrame.vue) |
| DateV2.vue | [app/components/Camelot/DateV2.vue](../../../../app/components/Camelot/DateV2.vue) |
| DateRangeV2.vue | [app/components/Camelot/DateRangeV2.vue](../../../../app/components/Camelot/DateRangeV2.vue) |
| TimeV2.vue | [app/components/Camelot/TimeV2.vue](../../../../app/components/Camelot/TimeV2.vue) |
| NumberCounter.vue | [app/components/Camelot/NumberCounter.vue](../../../../app/components/Camelot/NumberCounter.vue) |

[FieldFrame.vue]: #references
[DateV2.vue]: #references
[DateRangeV2.vue]: #references
[TimeV2.vue]: #references
[NumberCounter.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

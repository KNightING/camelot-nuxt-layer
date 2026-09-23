# Steps

## Summary

步驟指示器：依目前步驟索引顯示流程進度，已完成的步驟打勾、進行中的步驟以主色標示，可選擇開放點擊切換步驟。Cupertino、Sci-Fi、Aqua 主題有專屬樣式。匯入名稱為 `CamelotSteps`（Nuxt 自動匯入）。

## 運作方式

### 步驟狀態

| 狀態 | 條件 | 預設圓點 |
|---|---|---|
| 已完成 | 索引小於目前步驟 | 顯示 ✓ |
| 進行中 | 索引等於目前步驟 | 顯示序號，主色標示 |
| 未開始 | 索引大於目前步驟 | 顯示序號 |

來源：1. [Steps.vue][]

### 點擊切換

1. 未開啟點擊切換時，點擊不作用。
2. 禁止往後時，點目前步驟之後的步驟不作用。
3. 禁止往前時，點目前步驟之前的步驟不作用。
4. 其餘情況把目前步驟改成被點的索引。

來源：1. [Steps.vue][]

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `steps` | `string[]` | — | 步驟文字陣列，必填。 |
| `enableChangeByClick` | `boolean` | — | 啟用點擊切換步驟。 |
| `disableClickToNext` | `boolean` | — | 禁止點擊切換到後面的步驟。 |
| `disableClickToPrevision` | `boolean` | — | 禁止點擊切換到前面的步驟。 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色。 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model` | `number` | 目前步驟索引，從 0 起算，預設 `0`。 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `dot` | `{ value, index, isComplete, isDoing }` | 自訂步驟圓點。 |
| `content` | `{ value, index, isComplete, isDoing }` | 自訂步驟文字內容。 |

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Steps.vue | [app/components/Camelot/Steps.vue](../../../../app/components/Camelot/Steps.vue) |

[Steps.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

# ⏰ 時間選擇器

## Summary

`CamelotTimeV2` 是純時間選擇器，操作與外觀比照日期選擇器 DateV2：觸發框是時鐘圖示加唯讀輸入框，點開後在桌機顯示浮層、手機顯示對話框，裡面是可輸入的時／分／秒欄位與「確認」鈕。v-model 是 24 小時制字串，顯示格式依 `hourFormat` 與 `timePrecision` 決定；支援四種主題與 `color` 色彩角色，不引入新依賴。

## 運作方式

### 選時間

1. 點觸發框開啟選擇器；停用時不開啟。
2. `showType` 為 `auto` 時，手機寬度用對話框，其餘用浮層；也可固定為 `popup` 或 `dialog`。
3. 在時間列改時、分、秒或 AM／PM，值即時寫回 v-model。
4. 按「確認」關閉選擇器；若從未改過時間就按確認，會以目前欄位值（預設 00:00）寫入。
5. 浮層模式點外面也會關閉。

來源：1. [TimeV2.vue][]　2. [TimeRow.vue][]

### 值與顯示格式

| 項目 | 規則 |
| :--- | :--- |
| v-model | 24 小時制字串；`second` 精細度為 `HH:mm:ss`，其餘為 `HH:mm` |
| 讀入 | 以冒號拆開，時限制 0 到 23、分秒限制 0 到 59 |
| 觸發框顯示 | 24 小時制用 `HH`，12 小時制用 `hh` 並加 AM／PM；依精細度接上分、秒 |
| 範例 | 值 `14:30:00`、12 小時制、秒精細度，顯示 `02:30:00 PM` |
| `hour` 精細度 | 觸發框只顯示時，v-model 仍是 `HH:mm` |

來源：1. [TimeV2.vue][]

### 主題

1. 觸發框、開啟態與面板樣式來自共用的 picker 主題，四主題與 DateV2 一致。
2. scifi 主題下，觸發框外層套上表單欄位共用的 HUD 外框，開啟時呈 focus 態；其他主題不加外框。
3. 浮層陰影與圓角依主題設定在浮層外層，避免被面板裁切；錯誤態時邊框改為錯誤色。

來源：1. [TimeV2.vue][]　2. [useCamelotPickerTheme.ts][]　3. [FieldFrame.vue][]

## Props

| Prop | 預設 | 說明 |
| :--- | :--- | :--- |
| `v-model` | — | 時間字串，24 小時制 |
| `color` | `'primary'` | 色彩角色 |
| `label` | — | 標籤 |
| `required` | — | 必填星號 |
| `disabled` | — | 停用 |
| `isError` | — | 錯誤態 |
| `placeholder` | `'HH:mm'` | 無值時顯示 |
| `showType` | `'auto'` | `'auto'`、`'popup'` 或 `'dialog'` |
| `selectZIndex` | — | 浮層 z-index |
| `timePrecision` | `'minute'` | `'hour'`、`'minute'` 或 `'second'` |
| `hourFormat` | `'24'` | `'12'` 或 `'24'` |

來源：1. [TimeV2.vue][]

## 相關頁面

- [TimeV2](./components/TimeV2.md)
- [Internal/TimeRow](./components/Internal-TimeRow.md)
- [Internal/TimeField](./components/Internal-TimeField.md)
- [日期選擇器](./calendar.md)
- [主題系統](../platform/theme-system.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| TimeV2.vue | [app/components/Camelot/TimeV2.vue](../../../app/components/Camelot/TimeV2.vue) |
| TimeRow.vue | [app/components/Camelot/Internal/TimeRow.vue](../../../app/components/Camelot/Internal/TimeRow.vue) |
| useCamelotPickerTheme.ts | [app/composables/useCamelotPickerTheme.ts](../../../app/composables/useCamelotPickerTheme.ts) |
| FieldFrame.vue | [app/components/Camelot/Internal/FieldFrame.vue](../../../app/components/Camelot/Internal/FieldFrame.vue) |

[TimeV2.vue]: #references
[TimeRow.vue]: #references
[useCamelotPickerTheme.ts]: #references
[FieldFrame.vue]: #references

---
[⚙️ Env](../environment.md) | [🏠 Wiki](../index.md)

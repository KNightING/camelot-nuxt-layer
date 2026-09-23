# TimeV2

## Summary

時間選擇器：點觸發欄位後，以浮層或對話框顯示時、分、秒選擇列與確認按鈕，支援 12 與 24 小時制及精細度控制。欄位標題用 FieldLabel；觸發欄位最低 42px，樣式跟各主題的 Input 一致，Sci-Fi 另包 HUD 外框。匯入名稱為 `CamelotTimeV2`（Nuxt 自動匯入）。

## 運作方式

### 觸發欄位

| 主題 | 樣式 | 展開時 |
|---|---|---|
| Material | Filled：淺底、只有下框線 | 下框線換主色，並加 1px 內陰影 |
| Cupertino | 淺底、無可見框線 | 轉亮底，並加 inset 主色框 |
| Aqua | 玻璃底 | 聚焦光暈 |
| Sci-Fi | HUD 外框，內容區 40px | 外框進入聚焦狀態 |

1. 欄位最低 42px，字級 1rem 設在根節點；左側為時鐘圖示，輸入欄唯讀。
2. 點欄位切換開關；停用時不作用，欄位轉灰並半透明。
3. 錯誤狀態時框線改為錯誤色。
4. 額外屬性會綁到內部唯讀輸入欄。

點圖示等非輸入欄的位置時，欄位會阻止預設行為；否則瀏覽器會再對輸入欄補發一次點擊，把剛開的浮層又關掉。

來源：1. [TimeV2.vue][]　2. [useCamelotPickerTheme.ts][]　3. [FieldFrame.vue][]

### 呈現方式

| 設定 | 呈現 |
|---|---|
| auto | 手機用對話框，其他裝置用浮層 |
| popup | 浮層；點欄位與面板以外的地方即關閉 |
| dialog | 對話框 |

時、分、秒各欄的下拉清單會傳送到最近的對話框，沒有時傳到 body，層級比時間浮層高一層，在 Dialog 或 Sheet 內也能正常顯示與點選。

來源：1. [TimeV2.vue][]　2. [TimeField.vue][]　3. [useCamelotTeleportTarget.ts][]

### 值與顯示

1. 綁定值一律是 24 小時制字串：精細度到秒時為時分秒，其餘為時分。
2. 讀入綁定值時，時限制在 0 到 23，分與秒限制在 0 到 59。
3. 調整選擇列即寫回綁定值。
4. 欄位顯示依小時制與精細度轉換；12 小時制在時間後加上 AM 或 PM。
5. 首次開啟未調整就按確認，會套用目前的內部值，預設為 00:00。

來源：1. [TimeV2.vue][]

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色。 |
| `label` | `string` | — | 欄位標題。 |
| `required` | `boolean` | — | 標題旁顯示必填星號。 |
| `disabled` | `boolean` | — | 停用。 |
| `isError` | `boolean` | — | 錯誤狀態，框線改為錯誤色。 |
| `placeholder` | `string` | `'HH:mm'` | 未選值時的提示文字。 |
| `showType` | `'auto' \| 'popup' \| 'dialog'` | `'auto'` | 呈現方式；`auto` 時手機用對話框、其他用浮層。 |
| `selectZIndex` | `number` | — | 浮層 z-index。 |
| `timePrecision` | `'hour' \| 'minute' \| 'second'` | `'minute'` | 精細度：`hour` 僅時、`minute` 時分、`second` 時分秒。 |
| `hourFormat` | `'12' \| '24'` | `'24'` | 12 或 24 小時制。 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model` | `string` | 24 小時制時間字串，`"HH:mm"` 或 `"HH:mm:ss"`。 |

## 相關頁面

- [FieldLabel](./FieldLabel.md)
- [Internal TimeRow](./Internal-TimeRow.md)
- [Internal TimeField](./Internal-TimeField.md)
- [Internal FieldFrame](./Internal-FieldFrame.md)
- [useCamelotTeleportTarget](../composables/useCamelotTeleportTarget.md)
- [時間選擇器](../time-picker.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| TimeV2.vue | [app/components/Camelot/TimeV2.vue](../../../../app/components/Camelot/TimeV2.vue) |
| useCamelotPickerTheme.ts | [app/composables/useCamelotPickerTheme.ts](../../../../app/composables/useCamelotPickerTheme.ts) |
| FieldFrame.vue | [app/components/Camelot/Internal/FieldFrame.vue](../../../../app/components/Camelot/Internal/FieldFrame.vue) |
| TimeField.vue | [app/components/Camelot/Internal/TimeField.vue](../../../../app/components/Camelot/Internal/TimeField.vue) |
| useCamelotTeleportTarget.ts | [app/composables/useCamelotTeleportTarget.ts](../../../../app/composables/useCamelotTeleportTarget.ts) |

[TimeV2.vue]: #references
[useCamelotPickerTheme.ts]: #references
[FieldFrame.vue]: #references
[TimeField.vue]: #references
[useCamelotTeleportTarget.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

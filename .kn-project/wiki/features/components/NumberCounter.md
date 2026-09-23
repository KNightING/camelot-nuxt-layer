# NumberCounter

## Summary

`CamelotNumberCounter` 是帶加減按鈕的數字輸入欄位：中間可直接輸入，左右按鈕依步進值加減並夾在上下限內，可依目前值的小數位數自動決定步進。高度與 Input 一致，最低 42px、隨字級撐高，外觀依主題跟著各主題的 Input。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `step` | `number` | — | 加減步進值（取絕對值）；開啟 `minStepByValue` 且目前值有小數時，會被依值算出的步進覆蓋 |
| `min` | `number` | — | 按減號時的下限 |
| `max` | `number` | — | 按加號時的上限 |
| `placeholder` | `string` | — | 輸入框提示文字 |
| `label` | `string` | — | 欄位標題文字 |
| `required` | `boolean` | — | 是否為必填（顯示標題必填星號） |
| `disabled` | `boolean` | — | 是否停用 |
| `color` | `CamelotColorRole` | — | 色彩角色（未提供時為 `'primary'`） |
| `isContainer` | `boolean` | — | 是否使用 container 色階（未提供時為 `false`） |
| `minStepByValue` | `boolean` | — | 目前值有小數時，以最小小數位作為步進（例如 `0.25` 的步進為 `0.01`），並覆蓋 `step` |
| `usedMinStepByValue` | `boolean` | — | 需搭配 `minStepByValue`；算出的步進比目前步進大時保留較小者，避免步進被放大 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `number`（預設 `0`） | 目前數值 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `label` | `{ label: string }` | 自訂標題區塊，預設渲染 `CamelotFieldLabel` |
| `minus` | — | 自訂減號按鈕內容，預設為含漣漪效果的 `-` |
| `plus` | — | 自訂加號按鈕內容，預設為含漣漪效果的 `+` |

## 運作方式

### 各主題外框

| 主題 | 外框 |
| :--- | :--- |
| aqua | 半透明軌道底、12px 圓角，聚焦時加光暈 |
| cupertino | 與 Cupertino Input 相同：無可見框線，聚焦時轉亮底並加內側角色色框 |
| scifi | 包在與 Sci-Fi Input 相同的 HUD 外框裡，hover 與聚焦時有掃描光與準星 |
| material | 與 Material Input、SelectV2 同為 Filled 欄位：上方圓角、容器底色與底線，聚焦時底線改為角色色 |

高度與 Input 相同，最低 42px；字級放大時，加減按鈕與容器一起撐高。Sci-Fi 主題的內容區扣掉 HUD 外框上下各 1px。

停用時整個元件半透明、游標顯示禁止，並且不接受點擊。

來源：1. [NumberCounter.vue][]　2. [FieldFrame.vue][]

### 步進值

1. 有設定 `step` 時，以它的絕對值為步進。
2. 沒設 step、也沒開 minStepByValue 時，步進為 1。
3. 開啟 `minStepByValue` 且目前值帶小數時，步進改為該值的最小小數位，例如 0.25 的步進是 0.01；這一步會覆蓋 step。
4. 同時開啟 `usedMinStepByValue` 時，若算出的步進比目前步進大，保留目前較小的步進。
5. 開啟 minStepByValue 但目前值是整數時，有 step 就用 step，否則沿用上一次的步進。

來源：1. [NumberCounter.vue][]

### 加減與輸入

1. 按加減號時以浮點數安全的加法計算，避免 0.1 加 0.2 這類誤差。
2. 按加號超過上限時停在上限；按減號低於下限時停在下限。直接輸入的值不會被夾限。
3. 加減後輸入框自動取得焦點。
4. 行動裝置上，按加減號造成的聚焦不會彈出鍵盤；使用者點擊輸入框後才切成小數鍵盤，失焦後恢復。
5. 原生數字輸入框的上下箭頭已隱藏。

來源：1. [NumberCounter.vue][]　2. [useFloat.ts][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| NumberCounter.vue | [app/components/Camelot/NumberCounter.vue](../../../../app/components/Camelot/NumberCounter.vue) |
| FieldFrame.vue | [app/components/Camelot/Internal/FieldFrame.vue](../../../../app/components/Camelot/Internal/FieldFrame.vue) |
| useFloat.ts | [app/composables/useFloat.ts](../../../../app/composables/useFloat.ts) |

[NumberCounter.vue]: #references
[FieldFrame.vue]: #references
[useFloat.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

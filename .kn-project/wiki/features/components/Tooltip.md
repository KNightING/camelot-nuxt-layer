# Tooltip

## Summary

提示浮層：滑鼠或觸控筆懸停、觸控長壓、鍵盤 Tab 聚焦時顯示，點擊不觸發。浮層自行找空間，偏好在觸發元素上方，不夠時翻到下方，水平置中並限制在可視範圍內，外觀依主題切換。匯入名稱為 `CamelotTooltip`（Nuxt 自動匯入）。

## 運作方式

### 觸發

| 輸入方式 | 開啟 | 關閉 |
|---|---|---|
| 滑鼠、觸控筆 | 移入後等待開啟延遲 | 移出 |
| 觸控 | 長壓達設定時間 | 手指放開、取消或滑動超過 10px |
| 鍵盤 | Tab 聚焦且為 focus-visible | 失焦 |

1. 點擊造成的聚焦不會開啟，避免變成「點一下就出現」。
2. 長壓期間抑制系統的長壓選單與文字選取。
3. 停用時立即關閉，並清掉等待中的計時。
4. 只在截斷時顯示的模式下，每次開啟前檢查觸發器或其直接子元素是否水平溢出超過 1px。

來源：1. [Tooltip.vue][]

### 定位

1. 固定上方或下方時照設定；自動時上方放得下或上方空間不小於下方就放上方，否則放下方。
2. 水平以觸發元素為中心，再限制在可視範圍內，四邊留 8px 邊距。
3. 可視範圍以 visual viewport 為準，行動裝置鍵盤彈出時仍能正確避開。
4. 開啟期間每個畫面幀重算位置，觸發元素因捲動或動畫位移時也能跟上。

來源：1. [Tooltip.vue][]

### 疊層與無障礙

1. 浮層傳送到最近的對話框，沒有時傳到 body，避免被對話框的 top layer 壓住。
2. 浮層帶有 popup 標記，[BaseDialogV2](./BaseDialogV2.md) 不會把對它的點擊當成點遮罩。
3. 浮層角色為 tooltip，開啟時觸發器以 aria-describedby 指向它。
4. 預設層級用[疊層刻度](../../platform/layering.md)的 popup 層。

來源：1. [Tooltip.vue][]　2. [useCamelotTeleportTarget.ts][]

### 用例

[Internal Calendar](./Internal-Calendar.md) 的日期標籤以區塊排版加「只在截斷時顯示」，文字被截斷時才提示完整內容。

來源：1. [Calendar.vue][]

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `content` | `string` | `''` | 純文字內容；富內容改用 `content` 插槽。 |
| `placement` | `'auto' \| 'top' \| 'bottom'` | `'auto'` | 偏好位置，`auto` 會依空間翻轉。 |
| `openDelay` | `number` | `150` | 懸停開啟延遲，單位 ms。 |
| `longPressDuration` | `number` | `500` | 觸控長壓多久顯示，單位 ms。 |
| `offset` | `number` | `6` | 與觸發元素的距離，單位 px。 |
| `disabled` | `boolean` | `false` | 停用。 |
| `zIndex` | `number` | — | 浮層 z-index；未設定時用 popup 層的 CSS 變數。 |
| `block` | `boolean` | `false` | 觸發器改為區塊排版並可收縮，預設為行內區塊；供內含截斷文字、需撐滿寬度的情境。 |
| `onlyWhenTruncated` | `boolean` | `false` | 只在觸發器文字被截斷時才顯示。 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | — | 觸發元素。 |
| `content` | — | 浮層富內容，優先於 `content` prop。 |

## 相關頁面

- [useCamelotTeleportTarget](../composables/useCamelotTeleportTarget.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Tooltip.vue | [app/components/Camelot/Tooltip.vue](../../../../app/components/Camelot/Tooltip.vue) |
| useCamelotTeleportTarget.ts | [app/composables/useCamelotTeleportTarget.ts](../../../../app/composables/useCamelotTeleportTarget.ts) |
| Calendar.vue | [app/components/Camelot/Internal/Calendar.vue](../../../../app/components/Camelot/Internal/Calendar.vue) |

[Tooltip.vue]: #references
[useCamelotTeleportTarget.ts]: #references
[Calendar.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

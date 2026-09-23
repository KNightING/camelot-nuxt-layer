# PopupV2

## Summary

`CamelotPopupV2` 是依附在觸發元素上的彈出浮層：點擊或 hover 開啟，浮層以固定定位跟著觸發元素，空間不足時自動翻到上方或靠右對齊，並在頁面捲動時自動關閉。浮層預設掛到頁面最外層；觸發元素在對話框內時改掛進該對話框。下拉選單、日期選擇器等浮層元件都建立在它之上。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `zIndex` | `number` | `var(--cml-z-popup)` | 浮層 z-index；未指定時採用[疊層刻度](../../platform/layering.md)的 popup 層級，傳 `0` 也視為有效值 |
| `disabled` | `boolean` | — | 停用觸發；停用後元件更新時會關閉浮層 |
| `disabledShadow` | `boolean` | — | 關閉浮層陰影 |
| `disabledCloseWhenScrolling` | `boolean` | — | 頁面捲動時不自動關閉 |
| `disabledAutoSpace` | `boolean` | — | 關閉浮層貼邊時的左右留白 |
| `manual` | `boolean` | — | 手動控制開關：點擊觸發元素與點擊外部都不會改變開關狀態 |
| `verticalPosition` | `'auto' \| 'top' \| 'bottom'` | — | 垂直位置；未指定時自動判斷 |
| `isClickInside` | `(string \| MaybeElementRef<MaybeElement>)[]` | — | 視為點擊內部、不觸發點擊外部關閉的元素清單 |
| `disabledClickOutside` | `boolean` | — | 點擊外部時不自動關閉 |
| `popupWidthMode` | `'fit-content' \| 'min-target' \| 'same-target'` | — | 浮層寬度模式；未指定時依內容寬度 |
| `teleport` | `string \| MaybeElementRef<MaybeElement>` | — | 自訂浮層掛載目標 |
| `popupClass` | `string \| string[] \| Record<string, boolean>` | — | 套用於浮層外層容器的 class |
| `triggerMode` | `'click' \| 'hover'` | — | 觸發模式；未指定時為點擊 |
| `hoverDelay` | `number` | — | hover 模式滑鼠移開後延遲關閉的毫秒數，未指定時為 200 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `open` | `boolean` | 是否開啟（預設 `false`） |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | — | 觸發元素 |
| `popup` | — | 浮層內容 |

## 運作方式

### 開啟與關閉

| 觸發 | 行為 |
| :--- | :--- |
| 點擊模式 | 點觸發元素切換開關 |
| hover 模式 | 滑鼠進入觸發元素或浮層即開啟；離開兩者後延遲 `hoverDelay` 關閉，期間移回則取消關閉 |
| 點擊外部 | 關閉；`manual`、`disabledClickOutside` 開啟時不作用 |
| 頁面捲動 | 關閉；`disabledCloseWhenScrolling` 開啟時不作用 |
| 捲動父層捲動 | 關閉；在對話框內時一律關閉，不受 `disabledCloseWhenScrolling` 影響 |

來源：1. [PopupV2.vue][]

### 定位

1. 浮層以固定定位放在觸發元素下方，左緣對齊觸發元素。
2. 觸發元素底部加上浮層高度超出視窗時翻到上方；`verticalPosition` 可強制上方或下方。
3. 觸發元素左緣加上浮層寬度超出視窗右緣時改為靠右對齊。
4. 浮層開啟期間每一幀追蹤觸發元素位置；開啟當下先同步量測一次，關閉與卸載時停止追蹤。
5. 行動裝置鍵盤彈出造成可視區位移時，依可視區偏移修正位置；浮層開啟且沒有輸入框聚焦時凍結偏移，避免收鍵盤時浮層跳動。

因為使用固定定位，祖先元素若設定 transform、perspective、filter 或 will-change，定位可能失效。

來源：1. [PopupV2.vue][]

### 寬度模式

| 模式 | 浮層寬度 |
| :--- | :--- |
| `fit-content`（未指定時同此） | 依內容寬度 |
| `min-target` | 依內容寬度，但不小於觸發元素 |
| `same-target` | 與觸發元素同寬 |

來源：1. [PopupV2.vue][]

### 掛載目標與疊層

1. 有 `teleport` 時掛到指定目標。
2. 否則若觸發元素位在原生對話框內，掛進該對話框；對話框會建立頂層，掛在外面的浮層 z-index 再高也會被壓住。
3. 其餘情況掛到頁面最外層。
4. 浮層容器帶有 `data-camelot-popup` 屬性。掛進對話框後浮層落在對話框內容框之外，[BaseDialogV2](./BaseDialogV2.md) 靠這個標記把它與遮罩區分，點選單選項才不會被誤判成點遮罩而關閉對話框。自訂浮層要有相同行為時，也要帶上這個屬性。
5. 預設層級高於 Drawer 與 BottomSheet，因為掛進對話框後三者互為同層兄弟節點，見[疊層刻度](../../platform/layering.md)。

來源：1. [PopupV2.vue][]

### 陰影

陰影畫在帶 `popupClass` 的外層容器上，內容本身包在展開動畫容器裡並裁切溢出。要自訂浮層圓角時，把圓角 class 放進 `popupClass`，陰影才會跟著圓角，不會被裁成方形。

來源：1. [PopupV2.vue][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| PopupV2.vue | [app/components/Camelot/PopupV2.vue](../../../../app/components/Camelot/PopupV2.vue) |

[PopupV2.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

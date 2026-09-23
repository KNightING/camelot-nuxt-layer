# Drawer

## Summary

Drawer（匯入名稱 `CamelotDrawer`）是側邊抽屜，有兩種型態：floating 從畫面左或右滑入並蓋上遮罩，fixed 在版面中佔位、以寬度展開或收合。面板分成 header、可捲動的主要內容與 footer 三區，外觀依主題切換，開關由 v-model:open 控制。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `position` | `'left' \| 'right'` | `'left'` | 抽屜出現的位置 |
| `variant` | `'floating' \| 'fixed'` | `'floating'` | 浮動滑入或行內佔位 |
| `width` | `string` | `'320px'` | 抽屜寬度；floating 另限制最寬 90vw |
| `closeByMask` | `boolean` | `true` | 是否可點遮罩或按 Esc 關閉 |
| `zIndex` | `number` | — | floating 容器層級；未指定時用 `--cml-z-drawer`，見 [疊層刻度](../../platform/layering.md) |

zIndex 調高到超過 popup 層級時，Drawer 內的 Select、Popup 浮層會被面板蓋住。

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `close` | — | 透過遮罩點擊或 Esc 關閉時觸發 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `open` | `boolean`，預設 `false` | 抽屜是否開啟 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `header` | — | 抽屜頂部區塊 |
| `default` | — | 抽屜主要內容，超出時可捲動 |
| `footer` | — | 抽屜底部區塊 |

## 運作方式

### 兩種型態

| 型態 | 行為 |
| :--- | :--- |
| floating | 掛到 body，半透明遮罩淡入，面板從所在側滑入 |
| fixed | 留在原位，容器寬度在 0 與 width 之間過場；靠右時面板貼齊右緣 |

兩種型態在使用者偏好減少動態時都停用過場動畫。

來源：1. [Drawer.vue][]

### 關閉與捲動鎖

1. floating 開啟時鎖住頁面捲動，關閉或元件卸載時解除。
2. 多層 Drawer 共用同一個計數，全部關閉才解除，關掉內層不會讓外層背景又能捲動。
3. 全域樣式固定保留捲軸空間，鎖捲動時版面寬度不會跳動。
4. closeByMask 開啟時，點遮罩或按 Esc 都會關閉並觸發 close；Esc 只對 floating 有效。

來源：1. [Drawer.vue][]　2. [tailwind.css][]

### 面板外觀

兩種型態的面板都不畫邊框，只用底色與陰影和背景區隔。

| 主題 | 面板樣式 |
| :--- | :--- |
| Aqua | 75% 半透明底、背景模糊與大範圍陰影；不套用共用的玻璃面板工具，以避開它的髮絲邊框 |
| Sci-Fi | 實色底，外圍一圈 18% 主色光暈 |
| Cupertino | 實色底與大範圍陰影 |
| Material | 低階容器底色與大範圍陰影 |

來源：1. [Drawer.vue][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Drawer.vue | [app/components/Camelot/Drawer.vue](../../../../app/components/Camelot/Drawer.vue) |
| tailwind.css | [app/assets/css/tailwind.css](../../../../app/assets/css/tailwind.css) |

[Drawer.vue]: #references
[tailwind.css]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

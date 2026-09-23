# CascadeMenu

## Summary

CascadeMenu 是以觸發器包裹的多層級聯選單，匯入名稱 `CamelotCascadeMenu`。點擊觸發器開啟根面板，子選單以 hover 或點擊往側邊飛出；點擊外部、按 Esc 或捲動視窗時關閉，面板會傳送到最近的對話框或 body，在 Dialog 與 Sheet 內也能正常使用。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `items` | `CamelotCascadeMenuItem[]` | — | 選單項目清單。 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色。 |
| `submenuTrigger` | `'hover' \| 'click'` | `'hover'` | 子選單展開方式。 |
| `openDelay` | `number` | `80` | 展開延遲（ms）。 |
| `closeDelay` | `number` | `160` | 關閉延遲（ms）。 |
| `zIndex` | `number` | — | 面板基底 z-index，實際層級 = 基底 + level。未指定時回落 `calc(var(--cml-z-popup) + level)`（見[疊層刻度](../../platform/layering.md)）。 |
| `disabled` | `boolean` | `false` | 是否停用。 |
| `closeOnSelect` | `boolean` | `true` | 選取後是否關閉整組選單。 |
| `maxHeight` | `number \| string` | `360` | 單一面板選項區最大高度（number 視為 px），超過則該面板內部捲動。 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `select` | `item: CamelotCascadeMenuItem` | 選取某項目時觸發。 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `open` | `boolean`（預設 `false`） | 選單是否展開。 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | `{ open: boolean }` | 觸發器內容，點擊可切換展開狀態。 |

## 運作方式

CascadeMenu 是浮層飛出式選單，子層往側邊展開；行內手風琴式、子層往下縮排的選單請用 [Menu](./Menu.md)。

### 展開與收合

1. 根面板一律由點擊觸發器開啟。
2. hover 模式下，滑入含子項的列，經過 `openDelay` 後展開子面板；滑到同層葉節點時收起已展開的兄弟子面板。
3. 滑出面板後經過 `closeDelay` 才收合；途中滑入子面板時，會沿祖先鏈取消所有收合計時。
4. hover 模式點含子項的父項，不會收合也不會關閉選單；只有葉節點會觸發選取。
5. click 模式下點父項切換子面板，不受滑鼠進出影響。

子面板 Teleport 出去後，在 DOM 上不是父面板的後代，滑向子面板時父面板一定先收到滑出事件，所以第 3 步要沿祖先鏈取消。

兄弟項目切換時，子面板以展開項的值作為 key 重建，舊面板不會殘留，也不會在淡出時飛到角落。

來源：1. [CascadeMenuPanel.vue][]

### 定位

面板掛載時在瀏覽器繪製前同步量測錨點與自身尺寸，算出位置後凍結，只在視窗 resize 時重算。

定位完成前面板以隱藏狀態佔位，開啟的第一幀不會從左上角閃現。

| 面板 | 預設位置 | 空間不足時 |
| :--- | :--- | :--- |
| 根面板 | 觸發器下緣、左對齊 | 右側不足改為右對齊；下方不足翻到觸發器上方 |
| 子面板 | 該列右側、頂端對齊 | 右側不足翻到左側；下方不足往上移 |

面板與視窗邊緣至少保留 8px。

來源：1. [CascadeMenuPanel.vue][]

### 捲動

單一面板選項區的最大高度，取 `maxHeight` 與視窗高度減 16px 的較小值，超過時在面板內捲動。

捲動容器放在內層，面板本身裁切內容，捲軸貼齊面板內緣且不破壞圓角。

來源：1. [CascadeMenuPanel.vue][]

### 外觀

| 主題 | 面板 |
| :--- | :--- |
| aqua | 圓角玻璃面板 |
| scifi | 直角、等寬字、30% 角色色邊框與內發光 |
| cupertino | 背景模糊的半透明圓角面板 |
| material | 實色圓角面板與陰影 |

選中與 hover 樣式和 [SelectV2](./SelectV2.md) 的下拉選項共用同一組主題設定，兩者效果一致。

來源：1. [CascadeMenuPanel.vue][]　2. [useCamelotMenuItemTheme.ts][]

### 型別放置

選項資料契約放在 shared 型別目錄。面板之間的上下文型別與注入 key 含 DOM 型別，只能放在 app 端的型別目錄，規則見 [Layer 整合](../../dev/layer-integration.md)。

來源：1. [shared/types/cascadeMenu.ts][]　2. [app/types/cascadeMenu.ts][]

### 關閉與共享設定

1. 根元件向各層面板提供設定、選取、全部關閉與面板註冊函式。
2. 在觸發器與所有已註冊面板之外按下指標時關閉。
3. 按 Esc 或視窗捲動時關閉。
4. 元件更新時若處於停用狀態，強制關閉。

| 規則 | 說明 |
|---|---|
| 設定讀取時機 | 展開方式、延遲、基底 z-index、最大高度在元件建立時讀取一次，之後變更不生效 |
| 色彩角色 | 面板傳送出去後 CSS 變數繼承中斷，每個面板各自套用角色色 class 補回 |
| 傳送目標 | 經 [useCamelotTeleportTarget](../composables/useCamelotTeleportTarget.md) 找最近的對話框，沒有則用 body |

來源：1. [CascadeMenu.vue][]　2. [CascadeMenuPanel.vue][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| CascadeMenu.vue | [app/components/Camelot/CascadeMenu.vue](../../../../app/components/Camelot/CascadeMenu.vue) |
| CascadeMenuPanel.vue | [app/components/Camelot/Internal/CascadeMenuPanel.vue](../../../../app/components/Camelot/Internal/CascadeMenuPanel.vue) |
| useCamelotMenuItemTheme.ts | [app/composables/useCamelotMenuItemTheme.ts](../../../../app/composables/useCamelotMenuItemTheme.ts) |
| shared/types/cascadeMenu.ts | [shared/types/cascadeMenu.ts](../../../../shared/types/cascadeMenu.ts) |
| app/types/cascadeMenu.ts | [app/types/cascadeMenu.ts](../../../../app/types/cascadeMenu.ts) |

[CascadeMenu.vue]: #references
[CascadeMenuPanel.vue]: #references
[useCamelotMenuItemTheme.ts]: #references
[shared/types/cascadeMenu.ts]: #references
[app/types/cascadeMenu.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

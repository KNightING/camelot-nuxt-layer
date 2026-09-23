# SelectV2

## Summary

泛型下拉選擇器：點觸發器展開選項面板，支援搜尋過濾、虛擬滾動、單一選項停用與自訂選項插槽，觸發器與面板依主題切換樣式。觸發器最低 42px，字級 1rem 設在根節點。匯入名稱為 `CamelotSelectV2`（Nuxt 自動匯入）。

## 運作方式

### 觸發器

| 主題 | 樣式 | 展開時 |
|---|---|---|
| Material | Filled：淺底、只有下框線 | 下框線換主色，並加 1px 內陰影 |
| Cupertino | 淺底、無可見框線 | 轉亮底，並加 inset 主色框 |
| Aqua | 玻璃底 | 可搜尋時由聚焦光暈表現，框線不變 |
| Sci-Fi | HUD 外框包住內容，內容區 40px | 外框樣式不變 |
| 預設 | 一般框線 | 框線換主色 |

1. 觸發器最低 42px；Sci-Fi 內容區 40px，加上外框共 42px。
2. 可搜尋時觸發器是輸入欄：展開後輸入文字即過濾，有文字時右側出現清除鈕。
3. 關閉面板時清空搜尋文字。

來源：1. [SelectV2.vue][]

### 選項與預設值

1. 選項顯示文字依序取 label、name、value。
2. 有自訂過濾函式時用它；否則以不分大小寫比對 value、label、name。
3. 開啟預設選取且目前沒有值時，自動選第一個「未停用」的選項。
4. 選取值改變時發出變更事件，帶入整筆選項資料。
5. 開啟選取後不關閉時，再點一次已選中的項目仍會關閉，視為確認。

來源：1. [SelectV2.vue][]　2. [selectOptions.ts][]

### 選項面板

1. 面板寬度預設最小等於觸發器，選項較長時隨內容加寬；需要同寬時用 same-target。
2. 展開時把已選項捲到面板中央；虛擬滾動時改捲到已選項的索引。
3. 選項列帶 title，文字被截斷時可懸停看到完整內容。
4. 面板本身設定文字色，自訂插槽內容不必再指定。
5. 選中與懸停樣式和 [CascadeMenu](./CascadeMenu.md) 共用同一組主題設定。
6. 面板陰影畫在浮層外層，避免被面板的溢出裁切切成方形。

來源：1. [SelectV2.vue][]　2. [useCamelotMenuItemTheme.ts][]

### Sci-Fi 面板差異

Sci-Fi 主題的選項面板包在 HUD 外框內，固定最高 200px，不支援虛擬滾動，也不支援依值指定的選項插槽。

來源：1. [SelectV2.vue][]

### 停用

| 情境 | 行為 |
|---|---|
| 整個元件停用 | 面板不展開，整體半透明、游標顯示禁止 |
| 單一選項停用 | 該列不可點、不套懸停效果，透明度 0.38 |
| 停用選項剛好是目前值 | 仍保留選中樣式，看得出選在哪 |
| 搜尋時 | 停用選項仍會出現在結果中 |

自訂選項插槽自行送出的點擊也會被擋下，停用選項無法藉此被選取。

來源：1. [SelectV2.vue][]

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `options` | `SelectOptions<T>` | — | 選項清單。 |
| `optionsContainerMaxHeight` | `number` | `200` | 選項容器最大高度，單位 px。 |
| `zIndex` | `number` | — | 浮層 z-index。 |
| `disableCloseWhenSelected` | `boolean` | — | 選取後不自動關閉；再點已選中的項目仍會關閉。 |
| `default` | `boolean` | `true` | 未選值時自動選第一個未停用的選項。 |
| `disabledCloseWhenScrolling` | `boolean` | `true` | 捲動時不關閉浮層。 |
| `searchable` | `boolean` | `true` | 觸發器改為可輸入搜尋。 |
| `searchPlaceholder` | `string` | `'搜尋...'` | 搜尋提示字。 |
| `filterFunction` | `(option: SelectOption<T>, query: string) => boolean` | — | 自訂過濾函式。 |
| `popupWidthMode` | `'fit-content' \| 'min-target' \| 'same-target'` | `'min-target'` | 浮層寬度模式。 |
| `optionsContainerClass` | `string \| string[] \| Record<string, boolean>` | — | 選項容器自訂 class。 |
| `placeholder` | `string` | `'請選擇...'` | 未選時的提示字。 |
| `virtualScroll` | `boolean` | `false` | 啟用虛擬滾動，Sci-Fi 主題不適用。 |
| `itemHeight` | `number` | `36` | 虛擬滾動列高，單位 px。 |
| `overscan` | `number` | `5` | 虛擬滾動預繪列數。 |
| `disabled` | `boolean` | `false` | 是否停用。 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色。 |
| `label` | `string` | — | 欄位標題文字。 |
| `required` | `boolean` | — | 是否顯示必填標記。 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `changed` | `SelectOption<T>` | 選中資料變動時觸發。 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `string \| number` | 目前選取選項的值。 |
| `open` | `boolean`，預設 `false` | 浮層是否展開。 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `label` | `{ label: string }` | 自訂欄位標題，預設渲染 FieldLabel。 |
| `default` | `{ selectedData }` | 自訂觸發器內容，預設依主題渲染靜態或搜尋觸發器。 |
| `header` | `{ searchValue, setSearchValue }` | 選項清單上方的自訂表頭。 |
| `option` | `{ index, data, isSelected }` | 所有選項共用的呈現覆寫。 |
| `option-${value}` | `{ index, data, isSelected }` | 特定值選項的呈現覆寫，優先於 `option`；Sci-Fi 不支援。 |
| `empty-options` | — | 無可選選項時的內容。 |

## 相關頁面

- [FieldLabel](./FieldLabel.md)
- [PopupV2](./PopupV2.md)
- [CascadeMenu](./CascadeMenu.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| SelectV2.vue | [app/components/Camelot/SelectV2.vue](../../../../app/components/Camelot/SelectV2.vue) |
| selectOptions.ts | [shared/types/selectOptions.ts](../../../../shared/types/selectOptions.ts) |
| useCamelotMenuItemTheme.ts | [app/composables/useCamelotMenuItemTheme.ts](../../../../app/composables/useCamelotMenuItemTheme.ts) |

[SelectV2.vue]: #references
[selectOptions.ts]: #references
[useCamelotMenuItemTheme.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

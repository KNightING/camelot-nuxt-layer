# SelectV2

> 泛型下拉選擇器，支援搜尋過濾、虛擬滾動、四種主題觸發器樣式與豐富的選項插槽。

**匯入名稱**：`CamelotSelectV2`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `options` | `SelectOptions<T>` | — | 選項清單。 |
| `optionsContainerMaxHeight` | `number` | `200` | 選項容器最大高度（px）。 |
| `zIndex` | `number` | — | 浮層 z-index。 |
| `disableCloseWhenSelected` | `boolean` | — | 選取後不自動關閉。 |
| `default` | `boolean` | `true` | 未選值時自動選第一個選項。 |
| `disabledCloseWhenScrolling` | `boolean` | `true` | 捲動時不關閉浮層。 |
| `searchable` | `boolean` | `true` | 觸發器改為可輸入搜尋。 |
| `searchPlaceholder` | `string` | `'搜尋...'` | 搜尋提示字。 |
| `filterFunction` | `(option: SelectOption<T>, query: string) => boolean` | — | 自訂過濾函式。 |
| `popupWidthMode` | `'fit-content' \| 'min-target' \| 'same-target'` | `'min-target'` | 浮層寬度模式。 |
| `optionsContainerClass` | `string \| string[] \| Record<string, boolean>` | — | 選項容器自訂 class。 |
| `placeholder` | `string` | `'請選擇...'` | 未選時的提示字。 |
| `virtualScroll` | `boolean` | `false` | 啟用虛擬滾動。 |
| `itemHeight` | `number` | `36` | 虛擬滾動列高（px）。 |
| `overscan` | `number` | `5` | 虛擬滾動預繪列數。 |
| `disabled` | `boolean` | `false` | 是否停用。 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色。 |
| `label` | `string` | — | 欄位標題文字。 |
| `required` | `boolean` | — | 是否顯示必填標記。 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `changed` | `SelectOption<T>` | 當選中資料變動時觸發。 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `string \| number` | 目前選取選項的值。 |
| `open` | `boolean`（預設 `false`） | 浮層是否展開。 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `label` | `{ label: string }` | 自訂欄位標題，預設渲染 `CamelotFieldLabel`。 |
| （預設） | `{ selectedData }` | 自訂觸發器內容，預設依主題渲染靜態 / 搜尋觸發器。 |
| `header` | `{ searchValue, setSearchValue }` | 選項清單上方的自訂表頭。 |
| `option` | `{ index, data, isSelected }` | 單一選項的預設呈現覆寫（所有選項共用）。 |
| `option-${value}` | `{ index, data, isSelected }` | 針對特定值選項的呈現覆寫（優先於 `option`）。 |
| `empty-options` | — | 無可選選項時的內容（非 scifi 模式）。 |

## 備註
- 使用 `<script setup lang="ts" generic="T">` 泛型；選項顯示文字依序取 `label ?? name ?? value`。
- 搜尋：有 `filterFunction` 時採用之，否則以小寫比對 `value / label / name`。
- 虛擬滾動採 `@vueuse/core` 的 `useVirtualList`；開啟浮層時會多次派發 `resize` 以校正尺寸。
- `default` 為真且 `modelValue` 未定義時，自動選取第一個選項（`immediate` watch）。
- 觸發器樣式依 `themeMode`（scifi / cupertino / material / aqua / 預設）切換；浮層基於 `CamelotPopupV2`。

---
[🏠 Wiki](../index.md)

# RippleTabs

> 可水平捲動的膠囊式分頁列，帶漣漪效果與選中自動置中捲動。

**匯入名稱**：`CamelotRippleTabs`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `data` | `T[]` | — | 分頁資料陣列（泛型 `T`） |
| `displayKey` | `string` | — | 當項目為物件時，用於顯示的欄位鍵 |
| `modelValue` | `number` | — | 目前選中的索引 |
| `scrollSmooth` | `boolean` | `true` | 選中時捲動是否平滑 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色（選中態使用 container 色階） |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `update:modelValue` | `value?: number` | 選中索引變更時觸發（v-model） |
| `changedWithClick` | `value: number` | 由點擊造成選中變更時觸發 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `number` | 目前選中的索引 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | `{ data: T, index: number, isSelected: boolean }` | 自訂單一分頁內容；預設為帶漣漪的膠囊 tab |

## 備註
- 泛型元件（`generic="T"`）。
- `getDisplayLabel`：項目為物件且 `displayKey` 為有效鍵時顯示該欄位，否則顯示項目本身。
- 選中變更時，`watch(selectedIndex)` 計算並捲動使該 tab 置中；`scrollSmooth` 控制行為（`smooth`／`auto`）。
- `useCamelotRoleColorClass(color, () => true)` 使選中態採用 container 色階。
- 點擊已選中項不重複觸發；隱藏 webkit scrollbar。

---
[🏠 Wiki](../index.md)

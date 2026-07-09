# CascadeMenu

> 以觸發器包裹多層級聯選單，支援 hover / click 展開子選單、點擊外部與 Esc 關閉。

**匯入名稱**：`CamelotCascadeMenu`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `items` | `CamelotCascadeMenuItem[]` | — | 選單項目清單。 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色。 |
| `submenuTrigger` | `'hover' \| 'click'` | `'hover'` | 子選單展開方式。 |
| `openDelay` | `number` | `80` | 展開延遲（ms）。 |
| `closeDelay` | `number` | `160` | 關閉延遲（ms）。 |
| `zIndex` | `number` | `50` | 面板基底 z-index。 |
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
| （預設） | `{ open: boolean }` | 觸發器內容，點擊可切換展開狀態。 |

## 備註
- 透過 `provide(CAMELOT_CASCADE_MENU_KEY, ...)` 向各層 `CamelotInternalCascadeMenuPanel` 提供設定、`select`、`closeAll` 與面板註冊函式。
- 點擊觸發器與所有面板之外、按 Esc、視窗捲動時皆會關閉；`disabled` 於 `onUpdated` 時強制關閉。
- 配色由 `useCamelotRoleColorClass(color)` 提供。

---
[🏠 Wiki](../index.md)

# Tabs

> 分頁切換元件，具滑動指示器並適配各主題（aqua 藥丸 / material 底線 / cupertino 區段 / scifi HUD）樣式。

**匯入名稱**：`CamelotTabs`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `options` | `SelectOptions<T>` | — | 分頁選項清單。 |
| `dataKey` | `string` | — | 從 `option.data` 取顯示文字的欄位名。 |
| `scrollSmooth` | `boolean` | `true` | 切換時平滑捲動至選取分頁。 |
| `trigger` | `'click' \| 'hover' \| 'manual'` | — | 觸發切換方式；`manual` 時僅發出事件不改變選取。 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色。 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `click` | `(index: number, option: SelectOption<T>)` | 點擊分頁時觸發。 |
| `changed` | `(index: number, option: SelectOption<T>)` | 選取變更時觸發。 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model` | `string \| number` | 目前選取項的 `value`。 |
| `v-model:selectedIndex` | `number \| undefined` | 目前選取項的索引（與 value 雙向對應）。 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | `{ item, option, data, text, index, isSelected }` | 自訂單一分頁內容。 |

## 備註
- 泛型元件（`generic="T"`）。
- 指示器位置以 `getBoundingClientRect` 於執行期量測，於選取／選項／主題變更、容器 resize、字體載入後重算。
- `hover` 觸發模式下滑鼠移入即切換。

---
[🏠 Wiki](../index.md)

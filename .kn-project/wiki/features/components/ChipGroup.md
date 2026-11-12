# ChipGroup

## Summary

ChipGroup 是可點選的標籤群組，匯入名稱 `CamelotChipGroup`：點一下切換選取，可單選或多選。選項重用單選與勾選群組的選項型別；與不能選取的 [Tag](./Tag.md) 和可編輯的 TagGroup 是不同用途。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :--- | :--- |
| `options` | `CamelotGroupOption[]` | `[]` | 選項；每項有 label、value，選填 disabled |
| `multiple` | `boolean` | `false` | 允許同時選取多個；false 時選另一個會取代原本的 |
| `color` | `CamelotColorRole` | `'primary'` | 選取態的色彩角色 |
| `disabled` | `boolean` | `false` | 整組停用；逐選項停用用 option.disabled |
| `label` | `string` | `''` | 群組標題 |
| `required` | `boolean` | `false` | 標題旁顯示必填標記 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `change` | `selectedValues: (string \| number)[]` | 選取的項目改變時觸發 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `(string \| number)[]`（預設 `[]`） | 目前選取項目的 value；單選模式最多一個 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `label` | `label` | 自訂群組標題 |
| `chip` | `option`、`selected` | 自訂單顆標籤的內容 |

## 規則
| 規則 | 說明 |
| :--- | :--- |
| 單選 | 點已選取的項目不會取消；選另一個才會換 |
| 多選 | 再點一次已選取的項目會取消 |
| 無障礙 | 單選是 radiogroup，多選是一組帶按下狀態的按鈕 |
| 選取態 | Tactile 與 Aqua 為角色色填滿，Sci-Fi 為角色色框線加發光，其他風格為角色色淡底 |

來源：1. [ChipGroup.vue](../../../../app/components/Camelot/ChipGroup.vue)

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

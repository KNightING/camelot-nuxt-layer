# Tactile Checkbox

## Summary

Tactile Checkbox 是 Tactile 主題的勾選框外觀實作，匯入名稱 `CamelotTactileCheckbox`。一般在 Tactile 主題下由 [Checkbox](./Checkbox.md) 自動選用。它是可用鍵盤操作的按鈕，勾號以描線方式出現，支援半選與圓形外框。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :--- | :--- |
| `disabled` | `boolean` | `false` | 停用勾選框 |
| `shape` | `'square' | 'circle'` | `'square'` | 外框形狀 |
| `indeterminate` | `boolean` | `false` | 半選狀態；已勾選時不顯示 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `change` | `checked: boolean` | 勾選狀態改變時觸發 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `boolean`（預設 `false`） | 勾選狀態 |

## 外觀
| 狀態 | 外觀 |
| :--- | :--- |
| 未勾選 | 22×22，1.5px 內框線 |
| 勾選 | 角色色平塗，勾號描線出現 |
| 半選 | 角色色平塗，中央一條橫線 |
| 按下 | 縮小到 85%，放開以彈簧回彈 |

來源：1. [Tactile/Checkbox.vue](../../../../app/components/Camelot/Tactile/Checkbox.vue)

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

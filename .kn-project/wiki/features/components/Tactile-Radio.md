# Tactile Radio

## Summary

Tactile Radio 是 Tactile 主題的單選圓鈕外觀實作，匯入名稱 `CamelotTactileRadio`。一般在 Tactile 主題下由 [Radio](./Radio.md) 自動選用。它是可用鍵盤操作的按鈕，選取時中央圓點以彈簧放大。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :--- | :--- |
| `disabled` | `boolean` | `false` | 停用圓鈕 |
| `deselectable` | `boolean` | `false` | 點擊已選取的圓鈕可取消選取 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `change` | `checked: boolean` | 選取狀態改變時觸發 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `boolean`（預設 `false`） | 選取狀態 |

## 外觀
| 狀態 | 外觀 |
| :--- | :--- |
| 未選取 | 22×22 圓形，1.5px 內框線 |
| 選取 | 角色色平塗，中央圓點以彈簧放大 |
| 按下 | 縮小到 85%，放開以彈簧回彈 |

來源：1. [Tactile/Radio.vue](../../../../app/components/Camelot/Tactile/Radio.vue)

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

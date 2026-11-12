# Tactile Switch

## Summary

Tactile Switch 是 Tactile 主題的開關外觀實作，匯入名稱 `CamelotTactileSwitch`。一般在 Tactile 主題下由 [Switch](./Switch.md) 自動選用。它是可用鍵盤操作的按鈕，按住時拇指會橫向拉伸，放開後以彈簧滑到另一側。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :--- | :--- |
| `disabled` | `boolean` | `false` | 停用開關 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `change` | `checked: boolean` | 切換狀態改變時觸發 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `boolean`（預設 `false`） | 開關狀態 |

## 外觀
| 狀態 | 外觀 |
| :--- | :--- |
| 關 | 46×28 灰階軌道，22px 白色拇指在左 |
| 開 | 軌道改為角色色平塗，拇指滑到右側 |
| 按住 | 拇指拉長到 28px；開啟狀態下往左長，不會超出軌道 |
| 停用 | 半透明並灰階，無法切換 |

來源：1. [Tactile/Switch.vue](../../../../app/components/Camelot/Tactile/Switch.vue)

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

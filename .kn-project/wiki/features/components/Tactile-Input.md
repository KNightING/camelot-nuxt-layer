# Tactile Input

## Summary

Tactile Input 是 Tactile 主題的輸入框外觀實作，匯入名稱 `CamelotTactileInput`。一般在 Tactile 主題下由 [Input](./Input.md) 自動選用：實心灰階底、14px 圓角，聚焦時轉為亮底並加上 2px 角色色外框。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :--- | :--- |
| `placeholder` | `string` | `''` | 提示文字 |
| `disabled` | `boolean` | `false` | 停用輸入 |
| `type` | `CamelotInputType` | `'text'` | 原生輸入類型 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `focus` | `event: FocusEvent` | 原生輸入框取得焦點 |
| `blur` | `event: FocusEvent` | 原生輸入框失去焦點 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `string | number` | 輸入值 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `before` | — | 輸入框左側內容 |
| `after` | — | 輸入框右側內容 |

## 對外公開
| 名稱 | 說明 |
| :--- | :--- |
| `inputEl` | 原生輸入框元素，供外層呼叫聚焦或全選 |

來源：1. [Tactile/Input.vue](../../../../app/components/Camelot/Tactile/Input.vue)

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

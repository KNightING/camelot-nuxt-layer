# Stepper

## Summary

Stepper 是步進器，匯入名稱 `CamelotStepper`：兩顆圓形按鈕夾著「數值加單位」的文字，點按鈕以固定的量增減，到達上下限時對應按鈕停用。它不是輸入框，數值只能靠按鈕改；需要直接輸入數字請用 [NumberCounter](./NumberCounter.md)。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :--- | :--- |
| `min` | `number` | 無 | 最小值；未指定表示沒有下限 |
| `max` | `number` | 無 | 最大值；未指定表示沒有上限 |
| `step` | `number` | `1` | 每次增減的量，必須是整數 |
| `unit` | `string` | `''` | 顯示在數值後面的單位，例如「小時」 |
| `label` | `string` | `''` | 群組的無障礙名稱 |
| `labels` | `CamelotStepperLabels` | 減少、增加 | 兩顆按鈕的無障礙名稱 |
| `disabled` | `boolean` | `false` | 整組停用 |
| `color` | `CamelotColorRole` | `'primary'` | 按鈕與焦點環的色彩角色 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `change` | `value: number` | 按鈕改變數值後觸發 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `number`（預設 `0`） | 目前數值 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | `value` | 取代中間的「數值加單位」文字 |
| `minus` | — | 取代減少按鈕的圖示 |
| `plus` | — | 取代增加按鈕的圖示 |

## 規則
| 規則 | 說明 |
| :--- | :--- |
| 整數運算 | 只做整數加減；步進量給小數會得到浮點誤差，需要小數請在外層處理 |
| 上下限 | 結果會限制在 min 與 max 之間，到達時對應按鈕停用 |
| 外觀 | Tactile 是灰階膠囊加立體圓鈕，按下縮小並以彈簧回彈；其他風格各有對應的容器與按鈕 |

來源：1. [Stepper.vue](../../../../app/components/Camelot/Stepper.vue)

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

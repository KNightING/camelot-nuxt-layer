# AnimatedNumber

## Summary

AnimatedNumber 是大數字顯示元件，匯入名稱 `CamelotAnimatedNumber`。以等寬字體顯示格式化後的數字，數值變動時只有變化的字元會從下方滾進來並淡入。它只負責顯示，不做任何運算。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :--- | :--- |
| `value` | `number \| 十進位字串` | `0` | 要顯示的數字；字串（例如 `'144.00'`）原樣交給 Intl 格式化 |
| `prefix` | `string` | `''` | 數字前面的符號，例如「$」 |
| `suffix` | `string` | `''` | 數字後面的單位 |
| `fractionDigits` | `number` | `0` | 固定顯示的小數位數 |
| `locale` | `string` | 瀏覽器語系 | 決定千分位與小數點的 BCP 47 語系 |
| `size` | `CamelotNumberSize` | `'lg'` | 尺寸：md 24px、lg 36px、xl 60px |
| `color` | `CamelotColorRole` | `'primary'` | Sci-Fi 風格的發光色 |

## 規則
| 規則 | 說明 |
| :--- | :--- |
| 第一次渲染 | 不播動畫，只有之後數值變動才播 |
| 滾動範圍 | 以字元位置與內容判斷，變動的字元重新播放；沒變的字元不動 |
| 無障礙 | 整串數字以一個標籤朗讀，個別字元對輔助工具隱藏 |
| 減少動態 | 使用者偏好減少動態時不播動畫 |

來源：1. [AnimatedNumber.vue](../../../../app/components/Camelot/AnimatedNumber.vue)

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

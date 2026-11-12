# ChatBubble

## Summary

ChatBubble 是訊息對話泡泡，匯入名稱 `CamelotChatBubble`。分為對方與自己兩種方向：對方靠左、中性底色，自己靠右、強調色；出現時從尾巴那一角放大淡入，可在泡泡下方附時間等補充資訊。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :--- | :--- |
| `text` | `string` | `''` | 訊息文字 |
| `side` | `CamelotChatBubbleSide` | `'start'` | start 對方靠左、end 自己靠右 |
| `color` | `CamelotColorRole` | `'primary'` | 自己那一側泡泡使用的色彩角色 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | — | 取代文字的自訂內容 |
| `meta` | — | 泡泡下方的補充資訊，例如時間 |

## 外觀
| 主題 | 自己 | 對方 |
| :--- | :--- | :--- |
| tactile | 反相表面 | 實心灰階底 |
| aqua | 玻璃填色 | 玻璃軌道底 |
| scifi | 角色色框線加外發光 | 淡色框線 |
| cupertino、material | 角色色平塗 | 表面容器色 |

來源：1. [ChatBubble.vue](../../../../app/components/Camelot/ChatBubble.vue)

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

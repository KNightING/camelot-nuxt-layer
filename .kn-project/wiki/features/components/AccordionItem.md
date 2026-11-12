# AccordionItem

## Summary

AccordionItem 是 [Accordion](./Accordion.md) 的單一項目，匯入名稱 `CamelotAccordionItem`：一列可點擊的標題加展開指示圖示，下方是以高度過場展開的內容區。展開與否由外層傳入，自己不保存狀態。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :--- | :--- |
| `title` | `string` | `''` | 標題文字 |
| `expanded` | `boolean` | `false` | 是否展開 |
| `disabled` | `boolean` | `false` | 停用後無法點擊 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `toggle` | — | 標題被點擊或以鍵盤觸發 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `title` | — | 自訂標題 |
| `default` | — | 展開後顯示的內容 |

## 外觀
| 主題 | 展開指示圖示 |
| :--- | :--- |
| tactile | 灰階圓鈕；展開時轉為角色色平塗並旋轉半圈 |
| aqua | 玻璃軌道圓鈕；展開時轉為玻璃填色 |
| scifi | 展開時改為角色色並帶外發光 |
| 其他 | 展開時改為角色色 |

來源：1. [AccordionItem.vue](../../../../app/components/Camelot/AccordionItem.vue)

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

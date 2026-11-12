# Accordion

## Summary

Accordion 是多個可收合項目的群組，匯入名稱 `CamelotAccordion`。傳入項目陣列，以 v-model 取得目前展開的項目；預設一次只展開一個，可改為允許多個同時展開。五種主題各有對應的容器外觀。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :--- | :--- |
| `items` | `CamelotAccordionItem[]` | `[]` | 項目清單；每項有 value、title，選填 content 與 disabled |
| `multiple` | `boolean` | `false` | 允許同時展開多個項目 |
| `color` | `CamelotColorRole` | `'primary'` | 展開指示圖示使用的角色色 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `change` | `expandedValues: CamelotAccordionValue[]` | 展開的項目改變時觸發 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `CamelotAccordionValue[]`（預設 `[]`） | 目前展開項目的 value；單開模式最多一個 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `title` | `item`、`expanded` | 自訂項目標題 |
| `content` | `item` | 自訂項目內容；未提供時顯示項目的 content 文字 |

## 規則
| 規則 | 說明 |
| :--- | :--- |
| 單開模式 | 展開一個項目會收合其他項目 |
| 多開模式 | 各項目獨立展開與收合 |
| 再點一次 | 已展開的項目會收合 |
| 停用項目 | 標題變淡，無法點擊 |

來源：1. [Accordion.vue](../../../../app/components/Camelot/Accordion.vue)　2. [AccordionItem.vue](../../../../app/components/Camelot/AccordionItem.vue)

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

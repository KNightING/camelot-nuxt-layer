# Tag

> 標籤徽章，支援三種外觀、兩種尺寸與可關閉按鈕。

**匯入名稱**：`CamelotTag`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `label` | `string` | - | 標籤文字（亦可用預設插槽覆寫） |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色 |
| `variant` | `'solid' \| 'soft' \| 'outline'` | `'soft'` | 外觀：solid 實心 / soft 柔色 / outline 外框 |
| `size` | `'sm' \| 'md'` | `'md'` | 尺寸 |
| `closable` | `boolean` | - | 是否顯示關閉按鈕 |
| `disabled` | `boolean` | - | 停用（降低透明度、關閉按鈕不可點） |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `close` | - | 點擊關閉按鈕時觸發 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `icon` | - | 標籤前置圖示 |
| `default` | - | 標籤內容（未提供時顯示 `label`） |

## 備註
- 依主題套用不同形狀：`aqua` 藥丸+毛玻璃、`scifi` 切角+大寫加寬字距、`cupertino` 圓角、預設中圓角。
- `scifi` 主題的 `soft` 變體帶邊框與外發光。

---
[🏠 Wiki](../index.md)

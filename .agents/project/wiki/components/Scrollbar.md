# Scrollbar

> 自訂捲軸容器，隱藏原生捲軸並於捲動時顯示可拖曳的細捲軸，支援垂直與水平模式。

**匯入名稱**：`CamelotScrollbar`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `horizontal` | `boolean` | — | 是否為水平捲動模式（否則為垂直） |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | — | 捲動容器內容 |

## Exposed
| 名稱 | 說明 |
| :--- | :--- |
| `scrollToTop(options?)` | 捲動至頂端；`options.behavior` 預設 `'smooth'` |
| `scrollToBottom(options?)` | 捲動至底端；`options.behavior` 預設 `'smooth'` |

## 備註
- 原生捲軸以 `scrollbar-width: none` 與 `::-webkit-scrollbar { display: none }` 隱藏。
- 捲動時捲軸淡入，停止捲動 1 秒後自動淡出。
- thumb 可用滑鼠拖曳，拖曳時同步更新 `scrollLeft` / `scrollTop`。
- 掛載與 `resize` 時重新計算 thumb 尺寸與位置。

---
[🏠 Wiki](../index.md)

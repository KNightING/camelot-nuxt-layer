# IdxForm

> 依欄位順序（data-idx）以 Enter 逐一聚焦下一個輸入欄位、Shift+Tab 回上一個，最後一欄按 Enter 觸發 submit。

**匯入名稱**：`CamelotIdxForm`

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `submit` | — | 在最後一個欄位按 Enter（無下一欄位）時觸發 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | — | 表單內容（`input`、`select` 會自動編上 `data-idx`） |

## 備註
- 掛載表單後會對所有 `input`、`select` 依序寫入 `data-idx` 屬性作為索引。
- Enter 拆成 `keydown`（記錄目前索引）與 `keypress`（跳到下一欄或送出），以避免中文輸入法組字衝突。
- Shift+Tab 會聚焦上一個索引的欄位。

---
[🏠 Wiki](../index.md)

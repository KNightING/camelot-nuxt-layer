# Cupertino Button

> Cupertino（iOS）風格按鈕，按壓時具縮放與淡出效果。<主題實作>

**匯入名稱**：`CamelotCupertinoButton`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `disabled` | `boolean` | `false` | 是否停用按鈕 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `click` | `event: MouseEvent` | 點擊按鈕時觸發 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | — | 按鈕內容 |

## 備註
- 背景色使用 `--cml-color-current-color`，文字色使用 `--cml-color-current-on-color`。
- 啟用時按壓（active）會縮放至 0.97 並降低不透明度；停用時降低不透明度並灰階。

---
[🏠 Wiki](../index.md)

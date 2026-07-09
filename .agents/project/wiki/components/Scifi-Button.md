# Scifi Button

> 科幻風格按鈕，透過 ScifiFrame 提供邊框、掃描線、光澤與準星等互動視覺。<主題實作（Scifi）>

**匯入名稱**：`CamelotScifiButton`

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
- 內部維護 `isHovered`、`isFocused`、`isActive` 狀態，驅動 `CamelotScifiFrame` 的 `filled`、`show-scanline`、`show-shine`、`active-reticle`、`focused` 屬性。
- `disabled` 時停用互動（`pointer-events-none`、降低透明度、`tabindex` 設為 -1）。
- 文字色使用 `--cml-color-current-color` 混色，按下時切換為 `--cml-color-current-on-color`。

---
[🏠 Wiki](../index.md)

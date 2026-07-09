# Scifi Switch

> 科幻（Scifi）風格的開關切換元件。此為 Scifi 主題實作，通常由 `CamelotSwitch` 依主題自動載入。

**匯入名稱**：`CamelotScifiSwitch`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `disabled` | `boolean` | `false` | 是否停用，停用時不可點擊並套用灰階透明樣式 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `change` | `checked: boolean` | 切換狀態時觸發，帶入切換後的值 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `boolean`（預設 `false`） | 開關狀態，開為 `true`、關為 `false` |

## 備註
- 內含 `CamelotScifiReticle` 作為外框準星裝飾，hover 或選取時顯示。
- 切換時透過 `element.animate` 播放亮度閃爍與光暈動畫（約 200ms）。
- 右側顯示 `ON` / `OFF` 狀態文字。
- 停用時直接忽略點擊，不觸發 `change`。

---
[🏠 Wiki](../index.md)

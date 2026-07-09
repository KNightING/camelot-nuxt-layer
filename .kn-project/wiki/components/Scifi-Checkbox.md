# ScifiCheckbox

> 科幻（Sci-fi）風格的核取方塊視覺實作，含 hover 準星、掃描動畫與 indeterminate 狀態。內部主題實作。

**匯入名稱**：`CamelotScifiCheckbox`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `disabled` | `boolean` | `false` | 是否停用。 |
| `indeterminate` | `boolean` | `false` | 是否為半選（未定）狀態，顯示為已勾選外觀。 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `change` | `checked: boolean` | 勾選狀態切換時觸發。 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `boolean`（預設 `false`） | 是否為勾選狀態。 |

## 備註
- `toggle` 於停用時不作用；不同於 Radio，任何點擊皆會切換（無 `deselectable` 限制）。
- hover 時透過 `CamelotScifiReticle` 顯示準星；勾選時 indicator 帶掃描線動畫。
- `modelValue` 或 `indeterminate` 任一為真即套用 `checked` 外觀。

---
[🏠 Wiki](../index.md)

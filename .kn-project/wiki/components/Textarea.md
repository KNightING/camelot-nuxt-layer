# Textarea

> 多行文字輸入元件，支援自動增高、字數計算與多主題樣式。

**匯入名稱**：`CamelotTextarea`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `label` | `string` | — | 欄位標題文字 |
| `required` | `boolean` | — | 是否為必填（顯示於標題的必填星號） |
| `placeholder` | `string` | — | 提示文字 |
| `disabled` | `boolean` | — | 是否停用，停用時套用 `cursor-not-allowed opacity-50` |
| `rows` | `number` | `3` | 預設顯示列數 |
| `autosize` | `boolean` | `false` | 是否隨內容自動增高 |
| `maxRows` | `number` | — | 自動增高時的最大列數上限 |
| `resize` | `'none' \| 'vertical' \| 'both'` | `'vertical'` | 手動縮放方向（`autosize` 開啟時強制不可縮放） |
| `maxlength` | `number` | — | 最大字元數 |
| `showCount` | `boolean` | `false` | 是否顯示字數統計（需同時設定 `maxlength`） |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `string`（預設 `''`） | 文字輸入值 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `label` | `{ label: string }` | 自訂標題區塊，預設渲染 `CamelotFieldLabel` |

## 備註
- 透過 `useCamelotRoleColorClass(color)` 注入色彩角色 class。
- `autosize` 開啟時，於輸入、`model` 變動與 `onMounted` 後於 `nextTick` 重新計算高度；設定 `maxRows` 時以行高與 padding 推算高度上限。
- 字數統計顯示 `{{ model?.length ?? 0 }} / {{ maxlength }}`，需 `showCount` 與 `maxlength` 皆有值才顯示。
- 依 `themeMode`（`aqua` / `scifi` / `cupertino` / 預設 Material）套用不同外觀樣式。

---
[🏠 Wiki](../index.md)

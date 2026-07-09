# FieldLabel

> 表單欄位標題文字，支援必填星號並依主題調整字體樣式。

**匯入名稱**：`CamelotFieldLabel`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `label` | `string` | `''` | 標題文字，為空時不渲染任何內容 |
| `required` | `boolean` | `false` | 是否為必填，為 `true` 時於文字後方顯示紅色 `*` |

## 備註
- 透過 `useCamelotTheme()` 取得 `themeMode`；當主題為 `scifi` 時採用小型大寫、加寬字距（`text-xs uppercase tracking-[0.1em]`），其餘主題使用 `text-sm font-medium`。
- `label` 為空字串時整個元件不顯示（`v-if="label"`）。

---
[🏠 Wiki](../index.md)

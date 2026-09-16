# Internal PasswordToggle

## Summary

密碼顯示／隱藏切換的眼睛按鈕，由 `CamelotInput` 在 `type='password'` 且 `passwordToggle` 開啟時放在 `after` slot 之後，四個主題子元件共用。內部（Internal）實作。

**匯入名稱**：`CamelotInternalPasswordToggle`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `disabled` | `boolean` | — | 停用（跟隨 Input 的 `disabled`） |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model:revealed` | `boolean` | 是否顯示密碼（預設 `false`） |

## 備註
- `@mousedown.prevent`：點擊不奪走 input 焦點，讓 `CamelotInput` 得以在切換後還原游標位置。
- `aria-label` 依狀態為「顯示密碼」／「隱藏密碼」，並設 `aria-pressed`。
- 圖示：`material-symbols/visibility-outline-rounded` ↔ `visibility-off-outline-rounded`。
- 顯示策略（`hide-on-change` / `persistent`）不在此元件，由 [Input](./Input.md) 的 `passwordRevealMode` 控制。

---
[🏠 Wiki](../../index.md)

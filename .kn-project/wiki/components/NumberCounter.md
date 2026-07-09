# NumberCounter

> 數字計數器輸入元件，含加減按鈕、步進控制與依值動態步進。

**匯入名稱**：`CamelotNumberCounter`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `step` | `number` | — | 加減步進值，若設定則優先於 `minStepByValue` |
| `min` | `number` | — | 最小值下限 |
| `max` | `number` | — | 最大值上限 |
| `placeholder` | `string` | — | 輸入框提示文字 |
| `label` | `string` | — | 欄位標題文字 |
| `required` | `boolean` | — | 是否為必填（顯示標題必填星號） |
| `disabled` | `boolean` | — | 是否停用 |
| `color` | `CamelotColorRole` | — | 色彩角色（未提供時預設 `'primary'`） |
| `isContainer` | `boolean` | — | 是否作為 container 色彩情境（未提供時預設 `false`） |
| `minStepByValue` | `boolean` | — | 是否以目前值的最小單位作為 step（例如值 `0.2` → step `0.1`）；設定 `step` 時以 `step` 優先 |
| `usedMinStepByValue` | `boolean` | — | 是否沿用曾經值的最小單位作為 step（需 `minStepByValue` 為 `true`），避免 step 被放大 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `number`（預設 `0`） | 目前數值 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `label` | `{ label: string }` | 自訂標題區塊，預設渲染 `CamelotFieldLabel` |
| `minus` | — | 自訂減號按鈕內容，預設為含漣漪效果的 `-` |
| `plus` | — | 自訂加號按鈕內容，預設為含漣漪效果的 `+` |

## 備註
- 透過 `useCamelotRoleColorClass(color, isContainer)` 注入色彩角色 class。
- 加減運算使用 `useFloat().plus` 進行浮點數安全計算，並依 `min` / `max` 夾限。
- 加減後自動 focus 輸入框。
- 輸入框 `inputmode` 於未聚焦時為 `none`、點擊聚焦後切為 `decimal`，以控制行動裝置鍵盤。
- 隱藏原生 number input 的上下箭頭（spin button）。
- 依 `themeMode`（`aqua` / `cupertino` / `scifi` / 預設）套用不同容器外觀。

---
[🏠 Wiki](../index.md)

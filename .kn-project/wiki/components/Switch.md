# Switch

> 開關主元件，依主題自動切換 Material／Cupertino／Aqua／Scifi 實作，並可附標籤。

**匯入名稱**：`CamelotSwitch`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `label` | `string` | `''` | 標籤文字 |
| `disabled` | `boolean` | `false` | 是否停用 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色 |
| `isContainer` | `boolean` | `false` | 是否作為 container 色彩情境 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `change` | `checked: boolean` | 切換狀態時觸發，帶入切換後的值 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `boolean`（預設 `false`） | 開關狀態 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `label` | `{ label: string }` | 自訂標籤內容，預設渲染 `CamelotFieldLabel` |

## 備註
- 透過 `useCamelotTheme()` 的 `themeMode` 選擇對應主題子元件：`scifi` → `CamelotScifiSwitch`、`cupertino` → `CamelotCupertinoSwitch`、`aqua` → `CamelotAquaSwitch`、其餘 → `CamelotMaterialSwitch`。
- 點擊標籤（`toggleByLabel`）亦可切換狀態，停用時不作用。
- 透過 `useCamelotRoleColorClass(color, isContainer)` 注入色彩角色 class。

---
[🏠 Wiki](../index.md)

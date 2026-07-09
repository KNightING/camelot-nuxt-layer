# Radio

> 依目前主題（scifi / cupertino / aqua / material）渲染對應風格的單選圓鈕，並附帶可點擊的標籤。

**匯入名稱**：`CamelotRadio`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `label` | `string` | `''` | 標籤文字。 |
| `disabled` | `boolean` | `false` | 是否停用。 |
| `deselectable` | `boolean` | `false` | 點擊已選取項可取消選取（非必填情境）。 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色。 |
| `isContainer` | `boolean` | `false` | 是否使用容器色（container）配色。 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `change` | `checked: boolean` | 選取狀態切換時觸發。 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `boolean`（預設 `false`） | 是否為選取狀態。 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `label` | `{ label: string }` | 自訂標籤內容，預設渲染 `CamelotFieldLabel`。 |

## 備註
- 依 `useCamelotTheme()` 的 `themeMode` 分派到 `CamelotScifiRadio`、`CamelotCupertinoRadio`、`CamelotAquaRadio`，其餘（含 material）使用 `CamelotMaterialRadio`。
- 點擊標籤（`selectByLabel`）與圓鈕行為一致：停用時不作用；已選取且非 `deselectable` 時再次點擊不會取消。
- 配色由 `useCamelotRoleColorClass(color, isContainer)` 提供。

---
[🏠 Wiki](../index.md)

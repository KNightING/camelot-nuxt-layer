# Button

> 依當前主題（scifi／cupertino／aqua／material）自動切換實作的公開按鈕元件。

**匯入名稱**：`CamelotButton`（Nuxt 自動匯入）

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `label` | `string` | `'Button'` | 按鈕文字（無 default 插槽內容時顯示） |
| `disabled` | `boolean` | `false` | 是否停用按鈕 |
| `color` | `CamelotColorRole` | `'primary'` | 角色色彩（Material 版面使用） |
| `isContainer` | `boolean` | `false` | 是否使用容器色（Material 版面使用） |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `click` | `event: MouseEvent` | 按鈕點擊事件 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | — | 按鈕內容；未提供時顯示 `label` |

## 備註
- 透過 `useCamelotTheme()` 的 `themeMode` 選擇對應主題按鈕（`CamelotScifiButton`／`CamelotCupertinoButton`／`CamelotAquaButton`／預設 `CamelotMaterialButton`）。
- `color` 與 `isContainer` 僅傳遞給 Material 版面；角色色彩由 `useCamelotRoleColorClass` 套用。

---
[🏠 Wiki](../index.md)

# Breadcrumb

> 麵包屑導覽列，顯示層級路徑，最後一項為當前頁面且不可點擊。

**匯入名稱**：`CamelotBreadcrumb`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `items` | `BreadcrumbItem[]` | — | 麵包屑項目陣列 |
| `separator` | `string` | — | 自訂分隔字元；留空則用 chevron 圖示 |
| `color` | `CamelotColorRole` | `'primary'` | 角色色彩 |

`BreadcrumbItem`：`{ label: string; value?: string \| number; href?: string; disabled?: boolean }`

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `select` | `(item: BreadcrumbItem, index: number)` | 點擊非最後一項且未 disabled 時觸發 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `item` | `{ item, index, isLast }` | 自訂單一項目內容；預設顯示 `item.label` |
| `separator` | — | 自訂分隔符號；預設 chevron 圖示或 `separator` 字元 |

## 備註
- 有 `href` 的項目渲染為 `<a>`，否則為 `<button>`。
- 最後一項套用 `aria-current="page"` 並停用點擊。
- `themeMode` 為 scifi 時採等寬字體、大寫與加寬字距。

---
[🏠 Wiki](../index.md)

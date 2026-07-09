# useCamelotPickerTheme

> 日期選擇器（DateV2／DateRangeV2／內部日曆）各風格的共用樣式解析，集中提供觸發欄位、面板與選中態的 class。

## 簽章
```ts
useCamelotPickerTheme(): {
  themeMode: Ref<CamelotThemeMode>
  triggerClass: ComputedRef<string>
  panelClass: ComputedRef<string>
  selectedSurfaceClass: ComputedRef<string>
}
```

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `themeMode` | `Ref<CamelotThemeMode>` | 目前主題風格，取自 `useCamelotTheme()`。 |
| `triggerClass` | `ComputedRef<string>` | 觸發欄位（input 外框）的樣式 class，依 `themeMode`（aqua／scifi／cupertino／預設 material）解析。 |
| `panelClass` | `ComputedRef<string>` | 日曆浮層／對話框容器表面的樣式 class。 |
| `selectedSurfaceClass` | `ComputedRef<string>` | 選中態表面（日／月／年）的樣式 class。 |

## 用法
```ts
const { triggerClass, panelClass, selectedSurfaceClass } = useCamelotPickerTheme()
```

## 備註
- 各 class 隨 `themeMode` 變動：`aqua`、`scifi`、`cupertino` 各有專屬樣式，其餘（material）走 `default` 分支。
- 目的為避免在多個日期選擇器元件重複定義四種風格的 class 對應。

---
[🏠 Wiki](../index.md)

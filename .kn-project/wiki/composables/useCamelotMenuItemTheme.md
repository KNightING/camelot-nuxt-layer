# useCamelotMenuItemTheme

> 選單／選項列的四風格「選中（active）與 hover」效果共用核心，供 CascadeMenu 與 SelectV2 共用。

## 簽章
```ts
useCamelotMenuItemTheme(): {
  activeClass: ComputedRef<string>
  hoverClass: ComputedRef<string>
}
```

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `activeClass` | `ComputedRef<string>` | 選中（active／selected）態的樣式 class，依 `themeMode`（aqua／scifi／cupertino／預設 material）解析。 |
| `hoverClass` | `ComputedRef<string>` | 未選態的 hover 樣式 class。 |

## 用法
```ts
const { activeClass, hoverClass } = useCamelotMenuItemTheme()
```

## 備註
- `themeMode` 取自 `useCamelotTheme()`；class 字串為字面量，供 Tailwind v4 掃描器於編譯期產生 utility。
- 全數消費 router 注入的 `--cml-color-current-color` / `--cml-color-current-on-color`（CurrentColor 系統），確保 CascadeMenu 與 SelectV2 效果一致。

---
[🏠 Wiki](../index.md)

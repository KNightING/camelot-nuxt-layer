# Material3Provider

## Summary

`CamelotMaterial3Provider` 是一層 div 容器，把指定的 Material 3 明亮與暗色配色方案以 CSS 變數套在自己身上，讓裡面的子元件改用這組配色，而不影響頁面其他區域。明暗切換跟隨全域色彩模式；沒傳的方案沿用全域配色。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `lightColorScheme` | `Material3ColorSchemePartial` | — | 明亮模式使用的 Material 3 配色（可只給部分色） |
| `darkColorScheme` | `Material3ColorSchemePartial` | — | 暗色模式使用的 Material 3 配色（可只給部分色） |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | — | 套用配色方案的內容 |

## 運作方式

### 套用配色

1. 元件掛載後，以自己的容器元素與傳入的兩組配色建立區域配色。
2. 沒傳的那組方案，改用當下的全域明亮或暗色配色。
3. 目前是暗色模式時套用暗色方案，否則套用明亮方案；色彩模式為自動時依系統偏好判斷。
4. 色彩模式切換時，容器上的 CSS 變數跟著換成另一組方案。

來源：1. [Material3Provider.vue][]　2. [useMaterial3ColorScheme.ts][]

### 限制

配色只在掛載時讀取一次；掛載後再修改 `lightColorScheme` 或 `darkColorScheme`，不會更新到容器上。需要換配色時，重新掛載元件（例如變更 `key`）。

來源：1. [Material3Provider.vue][]

## 相關頁面

- [配色系統](../../platform/color-scheme.md)
- [ColorSchemeProvider](./ColorSchemeProvider.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Material3Provider.vue | [app/components/Camelot/Material3Provider.vue](../../../../app/components/Camelot/Material3Provider.vue) |
| useMaterial3ColorScheme.ts | [app/composables/useMaterial3ColorScheme.ts](../../../../app/composables/useMaterial3ColorScheme.ts) |

[Material3Provider.vue]: #references
[useMaterial3ColorScheme.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

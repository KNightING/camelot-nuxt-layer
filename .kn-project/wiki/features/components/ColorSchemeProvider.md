# ColorSchemeProvider

## Summary

ColorSchemeProvider 把自訂的明亮與暗色配色方案套用到整份文件根節點，匯入名稱 `CamelotColorSchemeProvider`。它是泛型元件，屬於全域套用：傳入的配色會合併進全站共用的配色方案，依目前色彩模式寫成 CSS 變數；需要只影響局部區塊時改用 [CustomColorSchemeProvider](./CustomColorSchemeProvider.md)。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `lightColorScheme` | `CustomColorScheme<T>` | — | 明亮模式使用的自訂配色方案 |
| `darkColorScheme` | `CustomColorScheme<T>` | — | 暗色模式使用的自訂配色方案 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | — | 原樣渲染的內容，本元件不額外包外層元素 |

## Exposed
| 名稱 | 說明 |
| :--- | :--- |
| `usedColorScheme` | 目前色彩模式下實際使用中的配色方案 |

## 運作方式

1. 建立時以 [useCustomColorScheme](../composables/useCustomColorScheme.md) 綁定文件根節點，把 props 合併進全站共用的明亮與暗色方案。
2. 掛載後與每次更新時，再把 props 合併一次，讓 props 變動生效。
3. 全站共用一個監聽器，色彩模式或方案變動時把使用中的方案寫到根節點的 CSS 變數。

| 規則 | 說明 |
|---|---|
| 合併方式 | 只覆蓋有傳入的鍵，不會刪除先前設定過的顏色；明亮與暗色建議都設定 |
| 卸載後 | 已合併的配色留在全站方案中，不會還原 |

來源：1. [ColorSchemeProvider.vue][]　2. [useCustomColorScheme.ts][]

## 相關頁面
- [色彩方案](../../platform/color-scheme.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| ColorSchemeProvider.vue | [app/components/Camelot/ColorSchemeProvider.vue](../../../../app/components/Camelot/ColorSchemeProvider.vue) |
| useCustomColorScheme.ts | [app/composables/useCustomColorScheme.ts](../../../../app/composables/useCustomColorScheme.ts) |

[ColorSchemeProvider.vue]: #references
[useCustomColorScheme.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

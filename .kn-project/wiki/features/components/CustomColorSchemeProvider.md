# 區域配色提供者

## Summary

區域配色提供者（CustomColorSchemeProvider）把自訂的明亮與暗色配色方案套用在自身包裹的區塊內，匯入名稱 `CamelotCustomColorSchemeProvider`。它是泛型元件，屬於區域套用：以全站配色為底合併傳入的配色，寫成該區塊的 CSS 變數，不影響區塊外；需要全域套用時改用 [ColorSchemeProvider](./ColorSchemeProvider.md)。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `lightColorScheme` | `CustomColorScheme<T>` | — | 明亮模式使用的自訂配色方案 |
| `darkColorScheme` | `CustomColorScheme<T>` | — | 暗色模式使用的自訂配色方案 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | — | 套用配色方案的內容，包在一個 div 容器內 |

## Exposed
| 名稱 | 說明 |
| :--- | :--- |
| `usedColorScheme` | 目前色彩模式下實際使用中的配色方案 |

## 運作方式

1. 建立時以 [useCustomColorScheme](../composables/useCustomColorScheme.md) 綁定自身的 div 容器，以當下的全站配色為底合併 props，成為本區塊專屬的方案。
2. 每次更新時再把 props 合併一次，讓 props 變動生效。
3. 色彩模式或方案變動時，把使用中的方案寫到容器的 CSS 變數，子元素透過繼承取得。

| 規則 | 說明 |
|---|---|
| 作用範圍 | 只影響容器與其後代；傳送到 body 的浮層不在範圍內 |
| 合併方式 | 只覆蓋有傳入的鍵，不會刪除先前設定過的顏色 |

來源：1. [CustomColorSchemeProvider.vue][]　2. [useCustomColorScheme.ts][]

## 相關頁面
- [色彩方案](../../platform/color-scheme.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| CustomColorSchemeProvider.vue | [app/components/Camelot/CustomColorSchemeProvider.vue](../../../../app/components/Camelot/CustomColorSchemeProvider.vue) |
| useCustomColorScheme.ts | [app/composables/useCustomColorScheme.ts](../../../../app/composables/useCustomColorScheme.ts) |

[CustomColorSchemeProvider.vue]: #references
[useCustomColorScheme.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

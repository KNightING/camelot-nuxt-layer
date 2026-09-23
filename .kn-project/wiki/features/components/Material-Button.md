# Material Button

## Summary

`CamelotMaterialButton` 是 Material 主題的填色膠囊按鈕，內建漣漪效果與 hover、停用狀態。一般不直接使用，而是由 `CamelotButton` 在 Material 主題（也是預設主題）下自動選用；透過它使用時字級為 1rem，按鈕最低高度 42px，字級放大時隨內容撐高。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `disabled` | `boolean` | `false` | 是否停用按鈕 |
| `color` | `string` | `'primary'` | 色彩角色名稱，`isContainer` 為真時用來決定漣漪色 |
| `isContainer` | `boolean` | `false` | 是否為 container 樣式，影響漣漪顏色 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `click` | `event: MouseEvent` | 點擊按鈕時觸發 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | — | 按鈕內容 |

## 運作方式

### 外觀

| 項目 | 行為 |
| :--- | :--- |
| 尺寸 | 最低 42px，左右留白 24px，字重 medium |
| 顏色 | 底色取目前色彩角色，文字取角色的前景色；色彩角色由外層元件提供 |
| hover | 提高亮度並加深陰影 |
| 停用 | 透明度 38%，取消 hover 的亮度與陰影變化，游標顯示禁止 |

來源：1. [Material/Button.vue][]　2. [Button.vue][]

### 漣漪

按下時以漣漪元件在按下處擴散水波紋。`isContainer` 為真時漣漪色取該色彩角色的 container 前景色，否則為白色。

來源：1. [Material/Button.vue][]

## 相關頁面

- [Button](./Button.md)
- [RippleEffect](./RippleEffect.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Material/Button.vue | [app/components/Camelot/Material/Button.vue](../../../../app/components/Camelot/Material/Button.vue) |
| Button.vue | [app/components/Camelot/Button.vue](../../../../app/components/Camelot/Button.vue) |

[Material/Button.vue]: #references
[Button.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

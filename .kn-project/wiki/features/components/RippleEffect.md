# RippleEffect

## Summary

`CamelotRippleEffect` 是包住任意內容的容器，指標按下時從按下的位置擴散一圈水波紋，650 毫秒後自動移除。Material 按鈕、RippleTabs、NumberCounter 的加減按鈕都用它提供點擊回饋。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `rippleColor` | `string` | — | 水波紋顏色，需為 hex 色碼 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | — | 要套用水波紋效果的內容 |

## 運作方式

### 水波紋

1. 指標按下時，當場量測一次容器大小，不做常駐追蹤；同一頁可能有數十個實例，常駐追蹤會掛上大量捲動與縮放監聽。
2. 水波紋直徑為容器對角線的兩倍，保證從任一點擴散都能蓋滿容器。
3. 水波紋以按下點為圓心，在 600 毫秒內從 0 放大並淡出。
4. 容器裁切溢出，水波紋不接收指標事件，不影響內容的點擊。

來源：1. [RippleEffect.vue][]

### 顏色

`rippleColor` 在元件重新渲染後才轉成 RGB 寫入容器的 CSS 變數，掛載當下不會寫入。

不是 hex 色碼時無法轉換，變數維持原值；專案其他地方沒有定義這個變數，所以在寫入之前水波紋沒有顏色、看不見。

來源：1. [RippleEffect.vue][]　2. [useColor.ts][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| RippleEffect.vue | [app/components/Camelot/RippleEffect.vue](../../../../app/components/Camelot/RippleEffect.vue) |
| useColor.ts | [app/composables/useColor.ts](../../../../app/composables/useColor.ts) |

[RippleEffect.vue]: #references
[useColor.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

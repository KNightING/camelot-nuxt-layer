# Gpu

## Summary

Gpu（匯入名稱 `CamelotGpu`）是強制 GPU 合成的包裹容器：把內容放進獨立的合成層，並開啟 iOS 的慣性捲動，用來改善動畫閃爍或捲動卡頓。兩項修正都可以個別關閉；容器本身沒有其他樣式與行為。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `disabledFixTransform` | `boolean` | `false` | 關閉零位移 3D transform 修正 |
| `disabledFixScrolling` | `boolean` | `false` | 關閉 iOS 觸控慣性捲動修正 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | — | 要套用修正的內容 |

## 運作方式

### 套用的修正

| 修正 | 條件 | 作用 |
| :--- | :--- | :--- |
| GPU transform | 一律套用 | 啟用 GPU 合成 |
| 零位移 3D transform | 未關閉時 | 強制內容獨立成合成層 |
| 觸控慣性捲動 | 未關閉時 | 讓 iOS Safari 內的捲動有慣性 |

來源：1. [Gpu.vue][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Gpu.vue | [app/components/Camelot/Gpu.vue](../../../../app/components/Camelot/Gpu.vue) |

[Gpu.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

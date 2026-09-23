# Aqua Input

## Summary

Aqua Input 是 Aqua 主題（毛玻璃風格）的輸入框外觀實作，匯入名稱 `CamelotAquaInput`（Nuxt 自動匯入）。一般在 Aqua 主題下由公開元件 [Input](./Input.md) 自動選用，聚焦時外框出現光暈；它提供前後插槽，並把原生 input 元素暴露給外層。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `placeholder` | `string` | `''` | 佔位提示文字 |
| `disabled` | `boolean` | `false` | 是否停用輸入框 |
| `type` | `CamelotInputType` | `'text'` | 原生 input type，由 Input 依密碼顯示切換狀態下傳 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `string \| number` | 輸入框的值 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `before` | — | 輸入框前方內容（如圖示） |
| `after` | — | 輸入框後方內容（如圖示） |

## Exposed
| 名稱 | 型別 | 說明 |
| :--- | :--- | :--- |
| `inputEl` | `Ref<HTMLInputElement \| null>` | 原生 input，供 Input 轉接給消費端呼叫 focus、select |

## 運作方式

| 項目 | 行為 |
|---|---|
| 尺寸 | 最低高度 42px，字級繼承自 Input 根節點；字級變大時跟著撐高 |
| 外觀 | 玻璃軌道底色、12px 控制項圓角 |
| 聚焦 | 聚焦期間外框加上光暈，失焦後移除 |

來源：1. [Aqua/Input.vue][]

## 相關頁面
- [主題系統](../../platform/theme-system.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Aqua/Input.vue | [app/components/Camelot/Aqua/Input.vue](../../../../app/components/Camelot/Aqua/Input.vue) |

[Aqua/Input.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

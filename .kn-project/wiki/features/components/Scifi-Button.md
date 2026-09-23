# Scifi Button

## Summary

`CamelotScifiButton` 是 Sci-Fi 主題的按鈕：外層包 HUD 外框，平時有掃描線，hover 時有光澤掠過與準星，按下時整個外框填滿色彩角色。文字為粗體大寫並加寬字距。一般不直接使用，而是由 `CamelotButton` 在 Sci-Fi 主題下自動選用；色彩角色由外層元件提供。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `disabled` | `boolean` | `false` | 是否停用按鈕 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `click` | `event: MouseEvent` | 點擊按鈕時觸發 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | — | 按鈕內容 |

## 運作方式

### 互動狀態

| 狀態 | HUD 外框效果 |
| :--- | :--- |
| 平時 | 顯示掃描線 |
| hover | 光澤掠過，準星啟動 |
| 聚焦 | 外框聚焦樣式，準星啟動 |
| 按下 | 外框填滿色彩角色，文字改用角色前景色 |
| 停用 | 關閉掃描線與所有互動效果，透明度 60%，不接受點擊，也無法以 Tab 聚焦 |

來源：1. [Scifi/Button.vue][]　2. [Scifi/Frame.vue][]

### 外觀

按鈕內容區最低 40px、最窄 120px，左右留白 24px；文字取色彩角色混入兩成白色，粗體、全大寫、字距加寬。

來源：1. [Scifi/Button.vue][]

## 相關頁面

- [Button](./Button.md)
- [Scifi Frame](./Scifi-Frame.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Scifi/Button.vue | [app/components/Camelot/Scifi/Button.vue](../../../../app/components/Camelot/Scifi/Button.vue) |
| Scifi/Frame.vue | [app/components/Camelot/Scifi/Frame.vue](../../../../app/components/Camelot/Scifi/Frame.vue) |

[Scifi/Button.vue]: #references
[Scifi/Frame.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

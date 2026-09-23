# Aqua Button

## Summary

Aqua Button 是 Aqua 主題（毛玻璃風格）的按鈕外觀實作，匯入名稱 `CamelotAquaButton`（Nuxt 自動匯入）。一般不直接使用，而是在 Aqua 主題下由公開元件 [Button](./Button.md) 自動選用；它只負責外觀、停用狀態與轉發點擊事件。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `disabled` | `boolean` | `false` | 是否停用按鈕 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `click` | `event: MouseEvent` | 按鈕點擊事件 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | — | 按鈕內容 |

## 運作方式

| 項目 | 行為 |
|---|---|
| 尺寸 | 最低高度 42px，字級沿用外層（由 Button 設為 1rem）；字級變大時按鈕跟著撐高 |
| 外觀 | 玻璃填色、半粗體文字、12px 控制項圓角 |
| 互動 | hover 略微提亮，按下時縮小回彈 |
| 停用 | 降低不透明度並灰階，游標改為禁止 |

來源：1. [Aqua/Button.vue][]

## 相關頁面
- [Button](./Button.md)
- [主題系統](../../platform/theme-system.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Aqua/Button.vue | [app/components/Camelot/Aqua/Button.vue](../../../../app/components/Camelot/Aqua/Button.vue) |

[Aqua/Button.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

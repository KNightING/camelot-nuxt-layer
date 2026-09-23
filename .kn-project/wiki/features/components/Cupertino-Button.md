# Cupertino Button

## Summary

Cupertino Button 是 Cupertino 主題（iOS 風格）的按鈕外觀實作，匯入名稱 `CamelotCupertinoButton`。一般在 Cupertino 主題下由公開元件 [Button](./Button.md) 自動選用，按壓時縮小並淡出；它只負責外觀、停用狀態與轉發點擊事件。

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

| 項目 | 行為 |
|---|---|
| 尺寸 | 最低高度 42px，字級沿用外層（由 Button 設為 1rem）；字級變大時按鈕跟著撐高 |
| 色彩 | 背景用目前角色色，文字用對應的 on 色 |
| 按壓 | 啟用時按下縮放到 0.97 並降低不透明度 |
| 停用 | 降低不透明度並灰階，游標改為禁止 |

來源：1. [Cupertino/Button.vue][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Cupertino/Button.vue | [app/components/Camelot/Cupertino/Button.vue](../../../../app/components/Camelot/Cupertino/Button.vue) |

[Cupertino/Button.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

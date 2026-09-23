# Aqua Switch

## Summary

Aqua Switch 是 Aqua 主題（毛玻璃風格）的開關外觀實作，匯入名稱 `CamelotAquaSwitch`。一般在 Aqua 主題下由 [Switch](./Switch.md) 自動選用，點擊切換開關並送出 change 事件。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `disabled` | `boolean` | `false` | 停用開關 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `change` | `checked: boolean` | 切換狀態改變時觸發 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `boolean`（預設 `false`） | 開關狀態 |

## 運作方式

| 狀態 | 外觀 |
|---|---|
| 關 | 玻璃軌道底色，圓鈕在左 |
| 開 | 玻璃填色，圓鈕滑到右側 |
| 停用 | 半透明並灰階，點擊不切換 |

來源：1. [Aqua/Switch.vue][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Aqua/Switch.vue | [app/components/Camelot/Aqua/Switch.vue](../../../../app/components/Camelot/Aqua/Switch.vue) |

[Aqua/Switch.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

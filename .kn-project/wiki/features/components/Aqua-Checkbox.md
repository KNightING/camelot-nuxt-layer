# Aqua Checkbox

## Summary

Aqua Checkbox 是 Aqua 主題（毛玻璃風格）的核取方塊外觀實作，匯入名稱 `CamelotAquaCheckbox`。支援方形與圓形外框、未定（半選）狀態，一般在 Aqua 主題下由 [Checkbox](./Checkbox.md) 自動選用。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `disabled` | `boolean` | `false` | 是否停用 |
| `shape` | `'square' \| 'circle'` | `'square'` | 外框形狀 |
| `indeterminate` | `boolean` | `false` | 未定（半選）狀態，顯示橫線標記 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `change` | `checked: boolean` | 切換狀態時觸發，帶入切換後的值 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `boolean`（預設 `false`） | 核取狀態 |

## 運作方式

| 狀態 | 外觀 |
|---|---|
| 未勾選 | 玻璃軌道底色 |
| 勾選 | 玻璃填色，顯示打勾標記 |
| 未定且未勾選 | 玻璃填色，顯示橫線標記 |
| 停用 | 半透明並灰階，點擊無效、不觸發 change |

來源：1. [Aqua/Checkbox.vue][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Aqua/Checkbox.vue | [app/components/Camelot/Aqua/Checkbox.vue](../../../../app/components/Camelot/Aqua/Checkbox.vue) |

[Aqua/Checkbox.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

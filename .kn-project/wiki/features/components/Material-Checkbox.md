# Material Checkbox

## Summary

`CamelotMaterialCheckbox` 是 Material 主題的核取方塊：18px 方框，勾選時填滿色彩角色並顯示打勾，支援半選（未定）狀態。一般不直接使用，而是由 `CamelotCheckbox` 在 Material 主題（也是預設主題）下自動選用；標籤、色彩角色由外層元件提供。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `disabled` | `boolean` | `false` | 是否停用 |
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

### 狀態外觀

| 狀態 | 外觀 |
| :--- | :--- |
| 未勾選 | 外框線色的空心方框 |
| 勾選 | 方框填滿色彩角色，顯示打勾 |
| 半選且未勾選 | 方框填滿色彩角色，顯示橫線 |
| 停用 | 透明度 38%，不接受點擊 |

方框固定為 2px 小圓角的方形，不提供形狀設定。

來源：1. [Material/Checkbox.vue][]

### 點擊

1. 點擊方框即切換勾選狀態，並以新值發出 `change`。
2. 半選狀態下點擊，會切換為勾選；半選旗標本身由外部控制，元件不會改動它。
3. 停用時忽略點擊，不發出 `change`。

來源：1. [Material/Checkbox.vue][]

## 相關頁面

- [Checkbox](./Checkbox.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Material/Checkbox.vue | [app/components/Camelot/Material/Checkbox.vue](../../../../app/components/Camelot/Material/Checkbox.vue) |

[Material/Checkbox.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

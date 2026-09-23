# Checkbox

## Summary

Checkbox 是核取方塊的公開元件，匯入名稱 `CamelotCheckbox`。它依當前主題選用 Scifi、Cupertino、Aqua 或 Material 的實作，支援未定（半選）狀態與圓形外框，並可在右側附帶可點擊的標籤。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `label` | `string` | `''` | 標籤文字 |
| `disabled` | `boolean` | `false` | 是否停用 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色 |
| `isContainer` | `boolean` | `false` | 改用角色的容器色 |
| `shape` | `'square' \| 'circle'` | `'square'` | 外框形狀（Scifi / Material 實作不套用） |
| `indeterminate` | `boolean` | `false` | 未定（半選）狀態 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `change` | `checked: boolean` | 切換狀態時觸發，帶入切換後的值 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `boolean`（預設 `false`） | 核取狀態 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `label` | `{ label: string }` | 自訂標籤內容，預設渲染 FieldLabel |

## 運作方式

### 主題切換

1. 依目前主題模式選用實作：scifi、cupertino、aqua，其餘一律 material。
2. 外框形狀只傳給 Cupertino 與 Aqua；Scifi 與 Material 不接受，外框固定。
3. 外層依 color 與 isContainer 設定目前角色色，內層實作取用這組顏色。
4. 有標籤文字或 label 插槽時才渲染標籤；點標籤也會切換並送出 change，停用時無效。

| 主題 | 實作 |
|---|---|
| scifi | [Scifi Checkbox](./Scifi-Checkbox.md) |
| cupertino | [Cupertino Checkbox](./Cupertino-Checkbox.md) |
| aqua | [Aqua Checkbox](./Aqua-Checkbox.md) |
| 其他 | [Material Checkbox](./Material-Checkbox.md) |

來源：1. [Checkbox.vue][]

### 尺寸

| 主題 | 方框 | 勾號 |
| :--- | :--- | :--- |
| aqua | 20×20 | 6×10 |
| material | 18×18 | 6×10 |
| cupertino | 22×22 | 12×8 |
| scifi | 方塊指示器 | 不畫勾號 |

來源：1. [Aqua/Checkbox.vue][]　2. [Material/Checkbox.vue][]　3. [Cupertino/Checkbox.vue][]　4. [Scifi/Checkbox.vue][]

## 相關頁面
- [CheckboxGroup](./CheckboxGroup.md)
- [FieldLabel](./FieldLabel.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Checkbox.vue | [app/components/Camelot/Checkbox.vue](../../../../app/components/Camelot/Checkbox.vue) |
| Aqua/Checkbox.vue | [app/components/Camelot/Aqua/Checkbox.vue](../../../../app/components/Camelot/Aqua/Checkbox.vue) |
| Material/Checkbox.vue | [app/components/Camelot/Material/Checkbox.vue](../../../../app/components/Camelot/Material/Checkbox.vue) |
| Cupertino/Checkbox.vue | [app/components/Camelot/Cupertino/Checkbox.vue](../../../../app/components/Camelot/Cupertino/Checkbox.vue) |
| Scifi/Checkbox.vue | [app/components/Camelot/Scifi/Checkbox.vue](../../../../app/components/Camelot/Scifi/Checkbox.vue) |

[Checkbox.vue]: #references
[Aqua/Checkbox.vue]: #references
[Material/Checkbox.vue]: #references
[Cupertino/Checkbox.vue]: #references
[Scifi/Checkbox.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

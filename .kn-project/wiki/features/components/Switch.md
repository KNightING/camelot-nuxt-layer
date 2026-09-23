# Switch

## Summary

開關主元件：依目前主題自動選用 Material、Cupertino、Aqua 或 Sci-Fi 的開關實作，可在右側附標籤，點標籤也能切換。匯入名稱為 `CamelotSwitch`（Nuxt 自動匯入）。

## 運作方式

### 主題選用

| 主題 | 使用的實作 |
|---|---|
| Sci-Fi | [Scifi Switch](./Scifi-Switch.md) |
| Cupertino | Cupertino Switch |
| Aqua | Aqua Switch |
| 其他 | Material Switch |

1. 開關本身與標籤都會切換狀態，並發出變更事件，帶入切換後的值。
2. 停用時點標籤不作用，標籤轉為半透明、游標顯示禁止。
3. 色彩角色與容器色情境會套到整個元件，子實作取用同一組目前色彩。

來源：1. [Switch.vue][]

### 尺寸

各主題的開關高度都是 22px，和勾選框並排時對齊。

| 主題 | 軌道 | 把手 |
| :--- | :--- | :--- |
| Aqua | 40×22 | 18 |
| Material | 40×22 | 未選 12、選中 16 |
| Cupertino | 40×22 | 18 |
| Sci-Fi | 48×22，軌道內顯示 ON、OFF 文字 | 14 |

來源：1. [Aqua/Switch.vue][]　2. [Material/Switch.vue][]　3. [Cupertino/Switch.vue][]　4. [Scifi/Switch.vue][]

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `label` | `string` | `''` | 標籤文字。 |
| `disabled` | `boolean` | `false` | 是否停用。 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色。 |
| `isContainer` | `boolean` | `false` | 是否使用容器色情境。 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `change` | `checked: boolean` | 切換狀態時觸發，帶入切換後的值。 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `boolean`，預設 `false` | 開關狀態。 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `label` | `{ label: string }` | 自訂標籤內容，預設渲染 FieldLabel。 |

## 相關頁面

- [FieldLabel](./FieldLabel.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Switch.vue | [app/components/Camelot/Switch.vue](../../../../app/components/Camelot/Switch.vue) |
| Aqua/Switch.vue | [app/components/Camelot/Aqua/Switch.vue](../../../../app/components/Camelot/Aqua/Switch.vue) |
| Material/Switch.vue | [app/components/Camelot/Material/Switch.vue](../../../../app/components/Camelot/Material/Switch.vue) |
| Cupertino/Switch.vue | [app/components/Camelot/Cupertino/Switch.vue](../../../../app/components/Camelot/Cupertino/Switch.vue) |
| Scifi/Switch.vue | [app/components/Camelot/Scifi/Switch.vue](../../../../app/components/Camelot/Scifi/Switch.vue) |

[Switch.vue]: #references
[Aqua/Switch.vue]: #references
[Material/Switch.vue]: #references
[Cupertino/Switch.vue]: #references
[Scifi/Switch.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

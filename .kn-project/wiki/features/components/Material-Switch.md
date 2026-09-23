# Material Switch

## Summary

`CamelotMaterialSwitch` 是 Material 主題的開關：40×22px 的膠囊軌道，開啟時軌道填滿色彩角色、圓鈕放大並移到右側。一般不直接使用，而是由 `CamelotSwitch` 在 Material 主題（也是預設主題）下自動選用；色彩角色由外層元件提供。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `disabled` | `boolean` | `false` | 停用開關 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `change` | `checked: boolean` | 切換狀態改變時觸發，帶入切換後的值 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `boolean`（預設 `false`） | 開關狀態 |

## 運作方式

### 狀態外觀

| 狀態 | 外觀 |
| :--- | :--- |
| 關閉 | 外框線色框線、淺色容器底，左側 12px 小圓鈕 |
| 開啟 | 軌道與框線填滿色彩角色，右側 16px 圓鈕用角色前景色 |
| 停用 | 軌道改為淡灰、透明度 38%，游標顯示禁止 |

1. 點擊軌道即切換狀態並發出 `change`。
2. 停用時點擊不會切換，也不發出事件。

來源：1. [Material/Switch.vue][]

## 相關頁面

- [Switch](./Switch.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Material/Switch.vue | [app/components/Camelot/Material/Switch.vue](../../../../app/components/Camelot/Material/Switch.vue) |

[Material/Switch.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

# Cupertino Switch

## Summary

Cupertino Switch 是 Cupertino 主題（iOS 風格）的開關外觀實作，匯入名稱 `CamelotCupertinoSwitch`。一般在 Cupertino 主題下由 [Switch](./Switch.md) 自動選用，點擊切換開關並送出 change 事件。

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
| 關 | 半透明灰色軌道，白色圓鈕在左 |
| 開 | 軌道改為目前角色色，圓鈕滑到右側 |
| 停用 | 半透明並灰階，點擊不切換 |

來源：1. [Cupertino/Switch.vue][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Cupertino/Switch.vue | [app/components/Camelot/Cupertino/Switch.vue](../../../../app/components/Camelot/Cupertino/Switch.vue) |

[Cupertino/Switch.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

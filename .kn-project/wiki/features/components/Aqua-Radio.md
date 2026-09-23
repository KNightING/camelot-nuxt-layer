# Aqua Radio

## Summary

Aqua Radio 是 Aqua 主題（毛玻璃風格）的單選圓鈕外觀實作，匯入名稱 `CamelotAquaRadio`。一般在 Aqua 主題下由 [Radio](./Radio.md) 自動選用；預設選取後不能再點掉，開啟可取消選取時才允許點已選項取消。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `disabled` | `boolean` | `false` | 是否停用 |
| `deselectable` | `boolean` | `false` | 是否允許點擊已選取項目以取消選取（非必填情境） |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `change` | `checked: boolean` | 切換狀態時觸發，帶入切換後的值 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `boolean`（預設 `false`） | 是否選取 |

## 運作方式

| 狀態 | 行為 |
|---|---|
| 未選取 | 玻璃軌道底色，點擊後選取 |
| 已選取 | 玻璃填色，中央圓點放大浮現 |
| 已選取再點 | 預設不變；開啟可取消選取時改回未選取 |
| 停用 | 半透明並灰階，點擊無效 |

中央圓點以滿版圓縮放呈現，避免非整數像素比螢幕下的半像素偏移。

來源：1. [Aqua/Radio.vue][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Aqua/Radio.vue | [app/components/Camelot/Aqua/Radio.vue](../../../../app/components/Camelot/Aqua/Radio.vue) |

[Aqua/Radio.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

# ScifiRadio

## Summary

Sci-Fi 主題的單選圓鈕視覺實作，選取時邊框發光、中央指示點以縮放方式出現。通常由公開的 Radio 依主題自動選用，匯入名稱為 `CamelotScifiRadio`（Nuxt 自動匯入）。

## 運作方式

1. 停用時點擊不作用。
2. 已選取且未開啟可取消選取時，再次點擊不會取消。
3. 其餘情況點擊會切換選取狀態，並發出變更事件。
4. 選取時邊框發光，中央指示點縮為一半大小，顏色取目前色彩變數。

來源：1. [Scifi/Radio.vue][]

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `disabled` | `boolean` | `false` | 是否停用。 |
| `deselectable` | `boolean` | `false` | 點擊已選取項可取消選取，用於非必填情境。 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `change` | `checked: boolean` | 選取狀態切換時觸發。 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `boolean`，預設 `false` | 是否為選取狀態。 |

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Scifi/Radio.vue | [app/components/Camelot/Scifi/Radio.vue](../../../../app/components/Camelot/Scifi/Radio.vue) |

[Scifi/Radio.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

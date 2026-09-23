# MaterialRadio

## Summary

`CamelotMaterialRadio` 是 Material 主題的單選圓鈕：20px 圓框，選取時框線與內部圓點改用色彩角色。一般不直接使用，而是由 `CamelotRadio` 在 Material 主題（也是預設主題）下自動選用；標籤與色彩角色由外層元件提供。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `disabled` | `boolean` | `false` | 是否停用 |
| `deselectable` | `boolean` | `false` | 點擊已選取項可取消選取（非必填情境） |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `change` | `checked: boolean` | 選取狀態切換時觸發 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `boolean`（預設 `false`） | 是否為選取狀態 |

## 運作方式

### 點擊

1. 未選取時點擊：改為選取並發出 `change`。
2. 已選取時點擊：只有 `deselectable` 為真才會取消選取；否則不動作。
3. 停用時不接受點擊，透明度降為 38%。

來源：1. [Material/Radio.vue][]

### 外觀

外圈為 2px 框線；選取時內部圓點由中心放大到框內寬度的 62.5%，框線與圓點都用色彩角色，未選取時框線為外框線色。

來源：1. [Material/Radio.vue][]

## 相關頁面

- [Radio](./Radio.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Material/Radio.vue | [app/components/Camelot/Material/Radio.vue](../../../../app/components/Camelot/Material/Radio.vue) |

[Material/Radio.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

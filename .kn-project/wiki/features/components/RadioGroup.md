# RadioGroup

## Summary

`CamelotRadioGroup` 依選項清單渲染一組 [Radio](./Radio.md)，以單一值雙向綁定目前選取的選項，可水平或垂直排列、整組或逐項停用，並可加上群組標題與必填標記。開啟 `deselectable` 時可點擊已選項取消選取，值變回 undefined。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `options` | `CamelotGroupOption[]` | — | 選項清單（必填） |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | 排列方向；水平時可換行 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色 |
| `disabled` | `boolean` | `false` | 整組停用；逐選項停用請用選項的 `disabled` |
| `deselectable` | `boolean` | `false` | 點擊已選取項可取消選取，取消時 `modelValue` 為 `undefined` |
| `label` | `string` | `''` | 群組標題文字 |
| `required` | `boolean` | `false` | 是否顯示必填標記 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `change` | `option: CamelotGroupOption \| undefined` | 選取變動時觸發；取消選取時為 `undefined` |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `string \| number \| undefined` | 目前選取選項的值 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `label` | `{ label: string }` | 自訂群組標題，預設渲染 `CamelotFieldLabel` |

## 運作方式

### 選取

1. 每個選項渲染成一個 Radio，選項的值等於綁定值時為選取狀態。
2. 點未選取的選項：值改為該選項，並以該選項發出 change。
3. 點已選取的選項：`deselectable` 為真時值改為 undefined 並發出 change；否則不動作。
4. 整組停用或該選項停用時，點擊不作用。

來源：1. [RadioGroup.vue][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| RadioGroup.vue | [app/components/Camelot/RadioGroup.vue](../../../../app/components/Camelot/RadioGroup.vue) |

[RadioGroup.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

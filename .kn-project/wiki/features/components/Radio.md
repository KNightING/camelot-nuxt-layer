# Radio

## Summary

`CamelotRadio` 是單一的單選圓鈕加可點擊標籤，依目前主題渲染 Sci-Fi、Cupertino、Aqua 或 Material 風格的圓鈕，並提供色彩角色。預設只能選取、不能點擊取消，需要可取消時開啟 `deselectable`。一組選項請改用 [RadioGroup](./RadioGroup.md)。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `label` | `string` | `''` | 標籤文字 |
| `disabled` | `boolean` | `false` | 是否停用 |
| `deselectable` | `boolean` | `false` | 點擊已選取項可取消選取（非必填情境） |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色 |
| `isContainer` | `boolean` | `false` | 是否使用 container 色階 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `change` | `checked: boolean` | 選取狀態切換時觸發 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `boolean`（預設 `false`） | 是否為選取狀態 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `label` | `{ label: string }` | 自訂標籤內容，預設渲染 `CamelotFieldLabel` |

## 運作方式

### 主題分派

| 主題 | 使用的圓鈕 |
| :--- | :--- |
| scifi | Sci-Fi Radio |
| cupertino | Cupertino Radio |
| aqua | Aqua Radio |
| 其他（含 material） | [Material Radio](./Material-Radio.md) |

來源：1. [Radio.vue][]

### 點擊

1. 點圓鈕或點標籤的行為相同。
2. 未選取時點擊：改為選取並發出 `change`。
3. 已選取時點擊：只有 `deselectable` 為真才會取消選取。
4. 停用時不接受點擊，標籤半透明並顯示禁止游標。
5. 沒有 `label` 也沒有 label slot 時，不渲染標籤區。

來源：1. [Radio.vue][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Radio.vue | [app/components/Camelot/Radio.vue](../../../../app/components/Camelot/Radio.vue) |

[Radio.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

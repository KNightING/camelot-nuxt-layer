# 🔘 單選與選項群組

## Summary

選項群組系統由單選鈕 `CamelotRadio`、單選群組 `CamelotRadioGroup` 與複選群組 `CamelotCheckboxGroup` 組成。Radio 與 Checkbox 同樣是「外層 wrapper＋四主題 variant」的結構，群組層負責選項排列方向、整組與逐選項停用、群組標題與必填標示，選項型別共用 `CamelotGroupOption`。

## 運作方式

### Radio

外層 wrapper 依目前主題選用 Material、Cupertino、Aqua 或 Scifi 的 variant，label 則由 wrapper 統一用 FieldLabel 渲染。

| 主題 | 外觀 | 尺寸 |
| :--- | :--- | :--- |
| Material | 2px 外圈，選中時色彩角色圓點放大 | 20px |
| Cupertino | 選中時整圈填滿色彩角色，中間淺色小點 | 22px |
| Aqua | 未選為玻璃軌道，選中為漸層填滿加淺色圓點 | 20px |
| Scifi | 髮絲圓框，選中時邊框與圓點帶光暈 | 18px |

1. 點圓鈕或 label 都能選取；停用時 label 呈半透明且不可點。
2. 已選取時再點一次不會取消，除非開啟 `deselectable`，適合非必填情境。
3. 圓點以滿版尺寸再用 transform 縮小繪製，以中心對稱取樣，避免 Windows 125%、150% 這類非整數縮放下的半像素偏移。
4. label 可用 `#label` slot 替換，預設以 `leading-none` 做光學置中。

| Prop | 預設 | 說明 |
| :--- | :--- | :--- |
| `v-model` | `false` | 是否選取 |
| `label` | `''` | 標籤文字 |
| `disabled` | `false` | 停用 |
| `deselectable` | `false` | 點已選取項可取消 |
| `color` | `'primary'` | 色彩角色 |
| `isContainer` | `false` | 使用 container 系列色 |

選取狀態改變時 emit `change`，帶新的布林值。

來源：1. [Radio.vue][]　2. [Material/Radio.vue][]　3. [Cupertino/Radio.vue][]　4. [Aqua/Radio.vue][]　5. [Scifi/Radio.vue][]

### RadioGroup 與 CheckboxGroup

```vue
<CamelotRadioGroup v-model="val" :options="options" direction="vertical" deselectable label="付款方式" />
<CamelotCheckboxGroup v-model="vals" :options="options" label="通知管道" />
```

| Prop | RadioGroup | CheckboxGroup |
| :--- | :--- | :--- |
| `v-model` | `string \| number \| undefined` | `(string \| number)[]`，預設空陣列 |
| `options` | `CamelotGroupOption[]`，欄位為 `label`、`value`、`disabled` | 同左 |
| `direction` | `'horizontal'`（預設）或 `'vertical'` | 同左 |
| `color` | `'primary'` | 同左 |
| `disabled` | 整組停用；與 `option.disabled` 任一為真即停用該項 | 同左 |
| `deselectable` | 點已選項取消，model 變成 `undefined` | 無，複選本來就能取消 |
| `label`、`required` | 群組標題與必填標示，可用 `#label` slot 替換 | 同左 |
| `change` emit | 選中的 option；取消時為 `undefined` | 勾選後的值陣列 |

1. 選項間距固定為橫向 24px、縱向 8px，四主題一致。
2. 水平排列時選項會自動換行。
3. 群組標題用 FieldLabel，左側內縮 4px 與選項對齊。

來源：1. [RadioGroup.vue][]　2. [CheckboxGroup.vue][]　3. [camelot.ts][]

## 相關頁面

- [Radio](./components/Radio.md)
- [RadioGroup](./components/RadioGroup.md)
- [CheckboxGroup](./components/CheckboxGroup.md)
- [FieldLabel](./components/FieldLabel.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Radio.vue | [app/components/Camelot/Radio.vue](../../../app/components/Camelot/Radio.vue) |
| Material/Radio.vue | [app/components/Camelot/Material/Radio.vue](../../../app/components/Camelot/Material/Radio.vue) |
| Cupertino/Radio.vue | [app/components/Camelot/Cupertino/Radio.vue](../../../app/components/Camelot/Cupertino/Radio.vue) |
| Aqua/Radio.vue | [app/components/Camelot/Aqua/Radio.vue](../../../app/components/Camelot/Aqua/Radio.vue) |
| Scifi/Radio.vue | [app/components/Camelot/Scifi/Radio.vue](../../../app/components/Camelot/Scifi/Radio.vue) |
| RadioGroup.vue | [app/components/Camelot/RadioGroup.vue](../../../app/components/Camelot/RadioGroup.vue) |
| CheckboxGroup.vue | [app/components/Camelot/CheckboxGroup.vue](../../../app/components/Camelot/CheckboxGroup.vue) |
| camelot.ts | [shared/types/camelot.ts](../../../shared/types/camelot.ts) |

[Radio.vue]: #references
[Material/Radio.vue]: #references
[Cupertino/Radio.vue]: #references
[Aqua/Radio.vue]: #references
[Scifi/Radio.vue]: #references
[RadioGroup.vue]: #references
[CheckboxGroup.vue]: #references
[camelot.ts]: #references

---
[⚙️ Env](../environment.md) | [🏠 Wiki](../index.md)

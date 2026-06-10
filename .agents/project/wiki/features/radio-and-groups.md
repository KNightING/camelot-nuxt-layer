# 🔘 Radio 與選項群組（RadioGroup / CheckboxGroup）

> 來源計畫：[2606101633-radio-groups-and-timeline-fix](../../archive/2606101633-radio-groups-and-timeline-fix.md)（2026-06-10）
> 相關：[FieldLabel 表單元件](field-label-and-form-controls.md)

## CamelotRadio

與 Checkbox 同模式的 wrapper + 4 主題 variant：

| 主題 | 外觀 | 尺寸 |
| :--- | :--- | :--- |
| Material | border-2 外圈、current-color 圓點縮放 | 20px |
| Cupertino | 選中填滿 current-color + 白點 | 22px |
| Aqua | aqua-track / aqua-fill + 白點（10px） | 20px |
| Scifi | current-color 髮絲圓框 + glow 圓點 | 18px |

- Props：`label`、`disabled`、`deselectable`、`color`、`isContainer`；`v-model: boolean`、`change` emit。
- label 由 wrapper 統一（FieldLabel + `#label` slot、點擊切換、`leading-none` 光學置中）。
- **防半像素偏移**：圓點以「滿版尺寸 + `transform scale` 縮小」渲染——合成階段以中心對稱取樣，避免固定 px 圓點在非整數 DPR（Windows 125%/150%）下的偏移感。
- **deselectable**（預設 false）：點擊已選取項取消選取，用於非必填情境。

## RadioGroup / CheckboxGroup

```vue
<CamelotRadioGroup v-model="val" :options="options" direction="vertical" deselectable label="付款方式" />
<CamelotCheckboxGroup v-model="vals" :options="options" label="通知管道" />
```

| Prop | RadioGroup | CheckboxGroup |
| :--- | :--- | :--- |
| `v-model` | `string \| number \| undefined` | `(string \| number)[]` |
| `options` | `CamelotGroupOption[]`（`{ label, value, disabled? }`，shared/types） | 同左 |
| `direction` | `horizontal`（預設）/ `vertical` | 同左 |
| `disabled` | 整組停用；**逐選項**用 `option.disabled`（取 OR） | 同左 |
| `deselectable` | 點已選項取消（model→undefined、change emit undefined） | —（checkbox 本可取消） |
| `label`/`required` | 群組標題（FieldLabel + `#label` slot） | 同左 |
| `change` emit | 選中 option（取消時 undefined） | 勾選值陣列 |

間距規格：選項間 `gap-x-6 gap-y-2`（橫 24px / 縱 8px），四主題一致（Scifi Checkbox 已移除 label-in-variant 時代的整列 padding 殘留）。

## References
- Playground：`.playground/app/pages/index.vue`「Radio & Checkbox Groups」卡（水平/垂直/deselectable/逐選項 disabled）。

---
[🏷️ FieldLabel 表單元件](field-label-and-form-controls.md) | [🕒 Timeline](timeline.md) | [🏠 Wiki](../index.md)

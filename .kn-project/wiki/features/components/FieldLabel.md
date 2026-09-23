# FieldLabel

## Summary

FieldLabel（匯入名稱 `CamelotFieldLabel`）是表單欄位的標題文字，可在文字後加紅色必填星號，字體樣式依主題調整；標題為空時整個元件不渲染。Input、DateV2 等表單元件的欄位標題一律由它渲染，讓各元件的標題外觀一致。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `label` | `string` | `''` | 標題文字，為空時不渲染任何內容 |
| `required` | `boolean` | `false` | 為 true 時於文字後方顯示紅色星號 |

## 運作方式

### 主題字體

| 主題 | 字體 |
| :--- | :--- |
| Sci-Fi | 小字、全大寫、加寬字距 |
| 其他主題 | 小字、中等字重 |

FieldLabel 本身不帶內距，左側留白由使用端的 class 決定。

來源：1. [FieldLabel.vue][]

### 表單元件的 label slot

表單元件把 FieldLabel 包在 label slot 的預設內容裡，消費端可以整段替換；slot 會帶出目前的標題文字。

| 元件 | 標題位置 |
| :--- | :--- |
| Input、Textarea、SelectV2、NumberCounter | 欄位上方，可用 slot 替換 |
| Switch、Checkbox、Radio | 控制項右側，點標題可切換或選取；停用時不可點，可用 slot 替換 |
| RadioGroup、CheckboxGroup | 群組上方，可用 slot 替換 |
| DateV2、DateRangeV2、TimeV2 | 欄位上方，不開放 slot |

Material 主題的 Input 在 labelMode 為 floating 時，標題改由框內的浮動 label 呈現，不渲染 FieldLabel；預設的 outside 與其他主題相同。

來源：1. [FieldLabel.vue][]　2. [Input.vue][]　3. [Switch.vue][]　4. [Radio.vue][]

### 自訂標題

```vue
<CamelotInput label="Custom">
  <template #label="{ label }">
    <span class="pl-1 text-sm font-bold">★ {{ label }}</span>
  </template>
</CamelotInput>
```

## 相關頁面

- [Input](./Input.md)
- [DateV2](./DateV2.md)
- [DateRangeV2](./DateRangeV2.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| FieldLabel.vue | [app/components/Camelot/FieldLabel.vue](../../../../app/components/Camelot/FieldLabel.vue) |
| Input.vue | [app/components/Camelot/Input.vue](../../../../app/components/Camelot/Input.vue) |
| Switch.vue | [app/components/Camelot/Switch.vue](../../../../app/components/Camelot/Switch.vue) |
| Radio.vue | [app/components/Camelot/Radio.vue](../../../../app/components/Camelot/Radio.vue) |

[FieldLabel.vue]: #references
[Input.vue]: #references
[Switch.vue]: #references
[Radio.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

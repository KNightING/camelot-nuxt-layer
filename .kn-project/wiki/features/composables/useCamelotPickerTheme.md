# 選擇器主題

## Summary

`useCamelotPickerTheme()` 集中 DateV2、DateRangeV2、TimeV2 與內部日曆的四主題樣式，回傳 `themeMode`、`triggerClass`、`triggerOpenClass`、`panelClass`、`selectedSurfaceClass`。觸發欄位與同主題的 Input 同一套外觀，最低高度 42px（Sci-Fi 內容區 40px，加上 HUD 外框共 42px）；展開時套上對應 Input 聚焦效果的樣式。

## 運作方式

1. 從 useCamelotTheme 讀取目前主題風格，原樣回傳為 themeMode。
2. 依風格回傳四個 computed class 字串；未列出的風格一律走 material 分支。
3. 日期與時間元件把觸發欄位 class 綁在觸發 label 上，展開時再加上展開 class。
4. 內部日曆只取選中態表面 class，用在選中的日、月、年。
5. Sci-Fi 的觸發欄位外框由 FieldFrame 內部元件負責，這裡只給最低高度。

來源：1. [useCamelotPickerTheme.ts][]　2. [DateV2.vue][]　3. [DateRangeV2.vue][]　4. [TimeV2.vue][]　5. [Calendar.vue][]　6. [FieldFrame.vue][]

### 觸發欄位

| 主題 | 觸發欄位 | 展開或聚焦 |
| --- | --- | --- |
| aqua | 最低 42px，aqua-track 軌道底，Aqua 控制項圓角，背景模糊 | aqua-glow 光暈 |
| scifi | 內容區最低 40px，加上 FieldFrame 提供的 HUD 外框共 42px | 無額外 class |
| cupertino | 最低 42px，10px 圓角，透明邊框，surface-container-highest 底 | 改 surface 底，加 1px 當前色內框線 |
| material | 最低 42px，上緣 4px 圓角，底線 outline 色，surface-container-highest 底 | 底線與 1px 內陰影改當前色 |

來源：1. [useCamelotPickerTheme.ts][]

### 面板與選中態

| 主題 | 面板 | 選中態表面 |
| --- | --- | --- |
| aqua | aqua-glass 玻璃，Aqua 面板圓角 | aqua-fill 填色，文字當前前景色 |
| scifi | 直角，主色 40% 邊框，主色 15% 光暈 | 當前色 85% 底，發光陰影 |
| cupertino | surface 底，2xl 圓角 | 當前色實心底 |
| material | surface 底，xl 圓角 | 當前色實心底，加小陰影 |

選中態在 aqua 以外的主題，沒有注入當前色時退回主色與主色前景色。

來源：1. [useCamelotPickerTheme.ts][]

## 用法

```ts
const { themeMode, triggerClass, triggerOpenClass, panelClass } = useCamelotPickerTheme()
```

```vue
<label :class="[triggerClass, open ? triggerOpenClass : '']">…</label>
```

## 簽章

```ts
useCamelotPickerTheme(): {
  themeMode: Ref<CamelotThemeMode>
  triggerClass: ComputedRef<string>
  triggerOpenClass: ComputedRef<string>
  panelClass: ComputedRef<string>
  selectedSurfaceClass: ComputedRef<string>
}
```

## 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `themeMode` | `Ref<CamelotThemeMode>` | 目前主題風格，與 useCamelotTheme 共用同一個 ref |
| `triggerClass` | `ComputedRef<string>` | 觸發欄位外框樣式，與同主題 Input 一致 |
| `triggerOpenClass` | `ComputedRef<string>` | 觸發欄位展開或聚焦時追加的樣式 |
| `panelClass` | `ComputedRef<string>` | 日曆浮層或對話框容器的表面樣式 |
| `selectedSurfaceClass` | `ComputedRef<string>` | 選中的日、月、年的表面樣式 |

## 相關頁面

- [DateV2](../components/DateV2.md)
- [DateRangeV2](../components/DateRangeV2.md)
- [TimeV2](../components/TimeV2.md)
- [Internal Calendar](../components/Internal-Calendar.md)
- [useCamelotTheme](./useCamelotTheme.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useCamelotPickerTheme.ts | [app/composables/useCamelotPickerTheme.ts](../../../../app/composables/useCamelotPickerTheme.ts) |
| DateV2.vue | [app/components/Camelot/DateV2.vue](../../../../app/components/Camelot/DateV2.vue) |
| DateRangeV2.vue | [app/components/Camelot/DateRangeV2.vue](../../../../app/components/Camelot/DateRangeV2.vue) |
| TimeV2.vue | [app/components/Camelot/TimeV2.vue](../../../../app/components/Camelot/TimeV2.vue) |
| Calendar.vue | [app/components/Camelot/Internal/Calendar.vue](../../../../app/components/Camelot/Internal/Calendar.vue) |
| FieldFrame.vue | [app/components/Camelot/Internal/FieldFrame.vue](../../../../app/components/Camelot/Internal/FieldFrame.vue) |

[useCamelotPickerTheme.ts]: #references
[DateV2.vue]: #references
[DateRangeV2.vue]: #references
[TimeV2.vue]: #references
[Calendar.vue]: #references
[FieldFrame.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

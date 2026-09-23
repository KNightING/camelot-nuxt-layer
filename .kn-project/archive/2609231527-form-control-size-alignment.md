# 2609231527 - form-control-size-alignment

- Created: 2026-09-23 15:27 / Archived: 2026-09-23
- Issue: KNightING/camelot-nuxt-layer#43
- Milestone: N/A / Base Branch: main

## Summary
DatePicker / Input / Select / NumberCounter / Button 在四個主題皆以 42px 為底線等高，字級改變時高度自動擴高且彼此仍等高，並統一各主題的欄位外觀。
起因是使用者反映 Counter 與 Input/Select 並排時高度、字級不一致；經 playground 並排檢查後，基準由「各主題 Input」改為「DatePicker（42px）」，Button 一併納入，並要求外部 CSS 改字級時高度能隨之變高。
作法：各元件根節點設 `text-base`（1rem），內部輸入框繼承；控制框 `min-h-10.5` + 行高 1.5em + 上下 padding 1rem + 上下框線 2px 撐高，不新增自訂 token（使用者要求外部直接以 CSS 覆蓋）。實測 16px → 皆 42px、20px → 皆 48px。
影響 Input（四主題子元件）、SelectV2、NumberCounter、DateV2 / DateRangeV2 / TimeV2、Button（四主題子元件）、`useCamelotPickerTheme`，新增 `Internal/FieldFrame.vue`。

## Cross-Repo Scope
無（單一 repo）

## Key Decisions
- **[Q0]** 不指定 milestone，Base Branch = `main` — 小幅 UI 調整。
- **[迭代 2]** 對齊基準改為 DatePicker（42px），Button 一併對齊 — 使用者看過並排區塊後指示；取代原「以各主題 Input 高度為基準」與 Material Counter 保留膠囊（Q1）的決議。
- **[迭代 2]** 不新增自訂高度 token；`min-h-10.5` + padding／行高撐高，字級設於根節點可被外部 CSS 覆蓋，要固定高度由外部覆蓋 `height`／`min-height` — 使用者：「外部通常直接用 CSS 覆蓋高度，自己加屬性不正常」。
- **[Q4]** Material Input 預設 label 在框外（同其他主題，42px），新增 `labelMode: 'outside' | 'floating'`，`floating` 保留浮動 label（56px） — 使用者選擇。
- **[Q5]** Button 字級統一 1rem、可被外部 CSS 改變，高度 42px 起跳並隨字級擴高。
- **[風格]** Material 的 DatePicker / Counter / Select 改 Filled 與 Input 一致；Cupertino 的 DatePicker / Select / Counter 改用 Cupertino Input 樣式（無可見框線、聚焦亮底＋inset 主色框）；Sci-Fi 的 DatePicker / DateRange / Time / Counter 包 HUD 外框 — 使用者指示。
- **[實作]** 新增 `Internal/FieldFrame.vue`（Sci-Fi 時包 `CamelotScifiFrame`，其他主題直接渲染），Counter 與三個日期元件共用。
- **[實作]** 高度公式一致化：無框線主題補 `border-transparent`；Material 聚焦改「下框線換色＋1px 內陰影」取代 `border-b-2`，不推擠版面；Counter ± 按鈕 `h-[calc(1.5em+0.5rem)]` 搭配容器 `py-1`；Material Button 根節點改 `block` 消除基線留白。
- **[實作]** DatePicker 系列 label 改用 `CamelotFieldLabel`；觸發欄位聚焦樣式集中到 `useCamelotPickerTheme().triggerOpenClass`。
- **[範圍]** SelectV2 的預設（無主題）分支不在對齊範圍內。
- **[歸檔]** 略過 wiki 更新 — 使用者指示；wiki 既有 1032 項 lint 硬閘違規（頁面未入索引、舊格式），另案處理。

## Deviations
- 範圍兩度擴大（迭代 2：基準改 DatePicker、Button 納入、高度隨字級、Material/Cupertino/Sci-Fi 風格統一；迭代 3：Cupertino Select/Counter），皆經使用者指示。
- 第一個 commit（`bcb278c`，以 Input 為基準的固定高度）已被第二個 commit 取代，保留在歷史中。
- 未更新 wiki；`features/theme-system.md`、`features/field-label-and-form-controls.md`、`features/components/NumberCounter.md` 對表單控制項高度與 Counter / DatePicker 外觀的描述已過時，待 wiki 整理計畫一併修正。

## Impact Files
- `app/components/Camelot/Input.vue` — 各主題根節點 `text-base`；Material 分支加框外 `CamelotFieldLabel`；新增 `labelMode` prop
- `app/components/Camelot/{Aqua,Cupertino,Scifi}/Input.vue` — 控制框 `min-h-10.5`（Sci-Fi 內容區 `min-h-10`），input `py-2`、字級繼承；Cupertino 補 `border-transparent`
- `app/components/Camelot/Material/Input.vue` — `label` 有值走浮動（`min-h-14`），否則 `min-h-10.5`；聚焦改內陰影
- `app/components/Camelot/SelectV2.vue` — 根節點 `text-base`；觸發器 `min-h-10.5 py-2`（Sci-Fi `min-h-10`）；Material Filled、Cupertino 無框線；`openBorderClass`
- `app/components/Camelot/NumberCounter.vue` — 根節點 `text-base`；`CamelotInternalFieldFrame` 包裝；各主題 `containerThemeClass`；± 按鈕 em 高度
- `app/components/Camelot/{DateV2,DateRangeV2,TimeV2}.vue` — label 改 `CamelotFieldLabel`；觸發欄位包 `CamelotInternalFieldFrame`、套 `triggerOpenClass`；icon `size-[1.25em]`
- `app/composables/useCamelotPickerTheme.ts:9` — `triggerClass` 各主題對齊 Input 樣式，新增 `triggerOpenClass`
- `app/components/Camelot/Internal/FieldFrame.vue` (new) — Sci-Fi 外框共用包裝
- `app/components/Camelot/Button.vue`、`{Aqua,Cupertino,Material,Scifi}/Button.vue` — 根節點 `text-base`；`min-h-10.5` + `py-2` + `border-transparent`（Sci-Fi `min-h-10`）；Material 根節點 `block`
- `.playground/app/pages/index.vue` — Form Alignment 並排區塊（16px 與 20px 兩列）、Floating Label 範例

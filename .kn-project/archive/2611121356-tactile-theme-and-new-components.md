# 2611121356 - tactile-theme-and-new-components

- Created: 2026-11-12 13:56 / Archived: 2026-11-12
- Issue: KNightING/camelot-nuxt-layer#76
- Milestone: 4.6.4.2 / Base Branch: 4.6.4.2

## Summary
新增第五種主題風格 `tactile`（實心表面、灰階軌道、墨色選中態、彈簧動態），涵蓋全部可主題化元件，並新增 Button 的 loading 狀態與七個新元件。
起因是使用者想依一份元件展示頁的風格美化 Aqua 元件，討論後改為新增獨立風格，Aqua 與其他三種風格維持不變，預設主題仍是 `aqua`。
`tailwind.css` 新增 tactile 的緩動、圓角 token 與六個 utility；五個 router 元件加 `Tactile/` 子元件，三十多個元件與兩個主題 composable 加 tactile 分支。
新元件為 Accordion、AccordionItem、Avatar、AvatarGroup、ChatBubble、Waveform、LevelMeter，五種風格都實作；playground 加入 Tactile 選項與新元件展示。

## Cross-Repo Scope
無（單一 repo）

## Key Decisions
- **[Milestone]** 掛 `4.6.4.2`（使用者選定，自 tag `4.6.4.1` 第四段加 1），已建立 milestone #6；版本分支同名 `4.6.4.2`，尚不存在，核准後自 `main` 切出。
- **[版本]** milestone 標題為四段非標準格式，未做版本檔檢查與同步。
- **[整合主幹]** 遠端只有 `main`，無 dev 類候選，採 `origin/HEAD` = `main`，不記錄。
- **[方向]** 不改動 Aqua，改為新增獨立風格 — 使用者提出；Aqua 無回歸風險，消費端可自行選用。
- **[命名]** 新風格命名 `tactile` — 使用者選定；名稱指按壓回彈的手感，子元件資料夾 `Tactile/`。
- **[範圍]** `tactile` 須涵蓋全部可主題化元件；Tape Room 有而 Camelot 無的元件一併新增 — 使用者要求。
- **[拆分]** 不拆成多份計畫 — 元件分支與新元件都相依於主題核心（型別與 utility），不符合獨立條件，以 Phase 循序執行。
- **[Q1]** 新增 Accordion、Avatar＋AvatarGroup、ChatBubble、Waveform＋LevelMeter 四組 — 使用者全選。
- **[Q2]** Button 加入 `loading` prop，五個風格都實作 — 使用者選定；`loading` 預設 false，既有用法不受影響。
- **[執行中]** 補列 Steps、FileChip、FileDropzone、ImageDropzone — 它們以 scoped CSS 分主題，Phase 0 以 `'aqua'` 字面量掃描未命中；使用者核准補列並實作。
- **[執行中]** 選單與下拉的 tactile 選中態文字用 `on-surface` 而非角色色 — 淺色角色色（如 playground 的青色）疊在灰階底上對比不足。
- **[執行中]** Breadcrumb、CarouselIndicator、FieldLabel、Timeline、FieldFrame 不加 tactile 分支 — 這五個只有 scifi 走特例，其餘風格共用同一外觀，tactile 沿用即可。
- **[執行中]** AccordionItem 不重用 `Expanded` — `Expanded` 只在 header 的 pointerup 切換，鍵盤無法操作；改用同樣的 grid-rows 過場並以 button 的 click 觸發。
- **[執行中]** Button loading 的轉圈做成 `tailwind.css` 的 `cml-button-spinner` utility — 五個風格共用同一個樣式，不另開元件檔。
- **[執行中]** loading 時按鈕文字以透明保留佔位，轉圈疊在中央 — 按鈕寬度不跳動；為此各風格 Button 的 slot 外多包一層同樣 flex 與 gap 的 span。
- **[執行中]** Waveform、LevelMeter 的進度與分段數換算沿用 `number` 運算 — 與既有 `ProgressBar.vue` 的百分比算法一致，結果只用於畫面顯示；未引入 decimal.js。
- **[驗證]** `pnpm lint`、`pnpm typecheck` 通過；`pnpm test` 40 個測試全過，另有 `useDrawerCollapsed.test.ts`、`useFileToDataURL.test.ts` 兩個檔在 Windows 上因 `vi.mock` 路徑的反斜線被吃掉而載入失敗，本計畫未動 `tests/` 與 `vitest.config.ts`，屬既有問題。
- **[完成後]** commit + 開 PR（使用者於核准閘選定）。
- **[預設主題]** 維持 `aqua` — 不改變既有消費端的外觀。

## Deviations
- 執行中補列 Steps、FileChip、FileDropzone、ImageDropzone 四個以 scoped CSS 分主題的元件（原計畫漏列，經使用者核准）。
- 計畫原訂 AccordionItem 重用 `Expanded`，實作改為自帶收合過場（`Expanded` 無法以鍵盤操作）。
- ProgressCircle、ProgressStage 只調整軌道顏色；進度弧線沿用預設分支的角色色。
- 歸檔時 wiki 整份仍是舊格式，lint 無法通過；先以 wikification 內建腳本把 168 頁轉成行內來源與歸檔 Changelog（獨立一個 commit），再寫本計畫的 wiki 內容。
- 各元件 wiki 頁內的逐主題對照表只更新了 Button、Input、Switch、Checkbox、Radio 與兩個主題 composable；其餘元件的 tactile 外觀集中記在主題系統頁，未逐頁補列。
- 新元件在 cupertino 主題下只確認可渲染，未逐一目視檢查；tactile、aqua、scifi、material 已在 playground 檢視。

## Impact Files
### 主題核心
- `app/composables/useCamelotTheme.ts:1` (`CamelotThemeMode`) — union 加入 `'tactile'`
- `app/assets/css/tailwind.css:103` (`@theme` 緩動與圓角 token)、`:251` (Aqua utility 區段之後) — 新增 tactile 的緩動、圓角 token 與六個 utility
- `app/composables/useCamelotPickerTheme.ts:11` — 日期／時間選擇器的 tactile 觸發欄位、面板、選中 class
- `app/composables/useCamelotMenuItemTheme.ts:15` — 選單項目的 tactile class

### Router 元件與 Tactile 子元件
- `app/components/Camelot/Button.vue:23`、`Input.vue:227`、`Switch.vue:21`、`Checkbox.vue:24`、`Radio.vue:23` — 各加 tactile 分支
- `app/components/Camelot/Tactile/Button.vue` (new)、`Tactile/Input.vue` (new)、`Tactile/Switch.vue` (new)、`Tactile/Checkbox.vue` (new)、`Tactile/Radio.vue` (new) — tactile 版子元件，介面比照 `Aqua/` 同名檔

### 元件內分支（每個都已有 `'aqua'` 分支，錨點為該分支所在行）
- `app/components/Camelot/BaseBottomSheetV2.vue:52`
- `app/components/Camelot/BaseDialogV2.vue:41`
- `app/components/Camelot/Carousel.vue:396`
- `app/components/Camelot/DateRangeV2.vue:366`
- `app/components/Camelot/DateV2.vue:272`
- `app/components/Camelot/Drawer.vue:100`
- `app/components/Camelot/Internal/CascadeMenuPanel.vue:316`
- `app/components/Camelot/Internal/MenuItem.vue:65`
- `app/components/Camelot/Internal/SheetHandle.vue:27`
- `app/components/Camelot/Loading.vue:17`
- `app/components/Camelot/NumberCounter.vue:114`
- `app/components/Camelot/Pagination.vue:184`
- `app/components/Camelot/ProgressBar.vue:77`
- `app/components/Camelot/ProgressCircle.vue:14`
- `app/components/Camelot/ProgressStage.vue:13`
- `app/components/Camelot/RichTextEditor.vue:677`
- `app/components/Camelot/SelectV2.vue:105`
- `app/components/Camelot/Skeleton.vue:5`
- `app/components/Camelot/Slider.vue:262`
- `app/components/Camelot/Table.vue:360`
- `app/components/Camelot/Tabs.vue:8`
- `app/components/Camelot/Tag.vue:50`
- `app/components/Camelot/TagGroup.vue:118`
- `app/components/Camelot/Textarea.vue:100`
- `app/components/Camelot/TimeV2.vue:213`
- `app/components/Camelot/Toast.vue:120`
- `app/components/Camelot/Tooltip.vue:101`

### 以 scoped CSS 依主題分支的元件（執行中補列，使用者已核准）
- `app/components/Camelot/Steps.vue:278` (`.container.aqua` 樣式區段) — 新增 `.container.tactile` 樣式
- `app/components/Camelot/FileChip.vue:125`、`FileDropzone.vue:119`、`ImageDropzone.vue:199` (`[data-cml-theme="aqua"]` 樣式) — 新增 tactile 的圓角樣式

### 只有 scifi 分支、其餘風格共用預設外觀的元件（逐一檢視，tactile 下外觀不協調才加分支）
- `app/components/Camelot/Breadcrumb.vue`、`CarouselIndicator.vue`、`FieldLabel.vue`、`Timeline.vue`、`Internal/FieldFrame.vue`

### Playground
- `.playground/app/pages/index.vue:2794` (主題選項陣列)、`:3140` (外觀選單) — 加入 Tactile 選項；另加新元件的展示區塊

### 新元件（五種風格皆實作）
- `app/components/Camelot/Accordion.vue` (new)、`AccordionItem.vue` (new) — 可收合群組；項目內部重用既有 `Expanded.vue:1` 的收合機制
- `app/components/Camelot/Avatar.vue` (new)、`AvatarGroup.vue` (new) — 頭像與重疊堆疊
- `app/components/Camelot/ChatBubble.vue` (new) — 訊息泡泡
- `app/components/Camelot/Waveform.vue` (new)、`LevelMeter.vue` (new) — 音訊波形與分段音量表
- `shared/types/camelot.ts` — 新元件對外的資料型別（例如 Accordion 項目、頭像資料）集中於此

### Button `loading`（Q2）
- `app/components/Camelot/Button.vue:23` (`defineProps`) — 新增 `loading` prop 並傳給各風格子元件；loading 時不發出 `click`
- `app/components/Camelot/Material/Button.vue`、`Cupertino/Button.vue`、`Scifi/Button.vue`、`Aqua/Button.vue` (各自的 `defineProps`) — 實作處理中的外觀
- `app/components/Camelot/Tactile/Button.vue` (new，已列於上) — 同時實作 loading
- `app/components/Camelot/Tactile/Button.vue`、`Input.vue`、`Switch.vue`、`Checkbox.vue`、`Radio.vue` (new)
- `.playground/app/components.d.ts` — 自動產生的元件型別宣告，隨新元件更新
- `README.md`、`.kn-project/project.md` — 主題數量與清單由四種改為五種

## Wiki Changes

| 頁面 | 日期 | 版本 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| `platform/theme-system.md` | 2026-11-12 | 4.6.4.2 | 新增第五種主題風格 tactile、Button loading 與七個新元件 | [#76](https://github.com/KNightING/camelot-nuxt-layer/issues/76) | [PR #77](https://github.com/KNightING/camelot-nuxt-layer/pull/77) |
| `platform/architecture.md` | 2026-11-12 | 4.6.4.2 | 新增第五種主題風格 tactile、Button loading 與七個新元件 | [#76](https://github.com/KNightING/camelot-nuxt-layer/issues/76) | [PR #77](https://github.com/KNightING/camelot-nuxt-layer/pull/77) |
| `features/components.md` | 2026-11-12 | 4.6.4.2 | 新增第五種主題風格 tactile、Button loading 與七個新元件 | [#76](https://github.com/KNightING/camelot-nuxt-layer/issues/76) | [PR #77](https://github.com/KNightING/camelot-nuxt-layer/pull/77) |
| `features/radio-and-groups.md` | 2026-11-12 | 4.6.4.2 | 新增第五種主題風格 tactile、Button loading 與七個新元件 | [#76](https://github.com/KNightING/camelot-nuxt-layer/issues/76) | [PR #77](https://github.com/KNightING/camelot-nuxt-layer/pull/77) |
| `features/time-picker.md` | 2026-11-12 | 4.6.4.2 | 新增第五種主題風格 tactile、Button loading 與七個新元件 | [#76](https://github.com/KNightING/camelot-nuxt-layer/issues/76) | [PR #77](https://github.com/KNightING/camelot-nuxt-layer/pull/77) |
| `features/composables/useCamelotTheme.md` | 2026-11-12 | 4.6.4.2 | 新增第五種主題風格 tactile、Button loading 與七個新元件 | [#76](https://github.com/KNightING/camelot-nuxt-layer/issues/76) | [PR #77](https://github.com/KNightING/camelot-nuxt-layer/pull/77) |
| `features/composables/useCamelotPickerTheme.md` | 2026-11-12 | 4.6.4.2 | 新增第五種主題風格 tactile、Button loading 與七個新元件 | [#76](https://github.com/KNightING/camelot-nuxt-layer/issues/76) | [PR #77](https://github.com/KNightING/camelot-nuxt-layer/pull/77) |
| `features/composables/useCamelotMenuItemTheme.md` | 2026-11-12 | 4.6.4.2 | 新增第五種主題風格 tactile、Button loading 與七個新元件 | [#76](https://github.com/KNightING/camelot-nuxt-layer/issues/76) | [PR #77](https://github.com/KNightING/camelot-nuxt-layer/pull/77) |
| `features/components/Button.md` | 2026-11-12 | 4.6.4.2 | 新增第五種主題風格 tactile、Button loading 與七個新元件 | [#76](https://github.com/KNightING/camelot-nuxt-layer/issues/76) | [PR #77](https://github.com/KNightING/camelot-nuxt-layer/pull/77) |
| `features/components/Switch.md` | 2026-11-12 | 4.6.4.2 | 新增第五種主題風格 tactile、Button loading 與七個新元件 | [#76](https://github.com/KNightING/camelot-nuxt-layer/issues/76) | [PR #77](https://github.com/KNightING/camelot-nuxt-layer/pull/77) |
| `features/components/Checkbox.md` | 2026-11-12 | 4.6.4.2 | 新增第五種主題風格 tactile、Button loading 與七個新元件 | [#76](https://github.com/KNightING/camelot-nuxt-layer/issues/76) | [PR #77](https://github.com/KNightING/camelot-nuxt-layer/pull/77) |
| `features/components/Radio.md` | 2026-11-12 | 4.6.4.2 | 新增第五種主題風格 tactile、Button loading 與七個新元件 | [#76](https://github.com/KNightING/camelot-nuxt-layer/issues/76) | [PR #77](https://github.com/KNightING/camelot-nuxt-layer/pull/77) |
| `features/components/Input.md` | 2026-11-12 | 4.6.4.2 | 新增第五種主題風格 tactile、Button loading 與七個新元件 | [#76](https://github.com/KNightING/camelot-nuxt-layer/issues/76) | [PR #77](https://github.com/KNightING/camelot-nuxt-layer/pull/77) |
| `features/components/ConfirmDialog.md` | 2026-11-12 | 4.6.4.2 | 新增第五種主題風格 tactile、Button loading 與七個新元件 | [#76](https://github.com/KNightING/camelot-nuxt-layer/issues/76) | [PR #77](https://github.com/KNightING/camelot-nuxt-layer/pull/77) |
| `features/components/Tree.md` | 2026-11-12 | 4.6.4.2 | 新增第五種主題風格 tactile、Button loading 與七個新元件 | [#76](https://github.com/KNightING/camelot-nuxt-layer/issues/76) | [PR #77](https://github.com/KNightING/camelot-nuxt-layer/pull/77) |
| `features/components/Accordion.md` | 2026-11-12 | 4.6.4.2 | 新增第五種主題風格 tactile、Button loading 與七個新元件 | [#76](https://github.com/KNightING/camelot-nuxt-layer/issues/76) | [PR #77](https://github.com/KNightING/camelot-nuxt-layer/pull/77) |
| `features/components/AccordionItem.md` | 2026-11-12 | 4.6.4.2 | 新增第五種主題風格 tactile、Button loading 與七個新元件 | [#76](https://github.com/KNightING/camelot-nuxt-layer/issues/76) | [PR #77](https://github.com/KNightING/camelot-nuxt-layer/pull/77) |
| `features/components/Avatar.md` | 2026-11-12 | 4.6.4.2 | 新增第五種主題風格 tactile、Button loading 與七個新元件 | [#76](https://github.com/KNightING/camelot-nuxt-layer/issues/76) | [PR #77](https://github.com/KNightING/camelot-nuxt-layer/pull/77) |
| `features/components/AvatarGroup.md` | 2026-11-12 | 4.6.4.2 | 新增第五種主題風格 tactile、Button loading 與七個新元件 | [#76](https://github.com/KNightING/camelot-nuxt-layer/issues/76) | [PR #77](https://github.com/KNightING/camelot-nuxt-layer/pull/77) |
| `features/components/ChatBubble.md` | 2026-11-12 | 4.6.4.2 | 新增第五種主題風格 tactile、Button loading 與七個新元件 | [#76](https://github.com/KNightING/camelot-nuxt-layer/issues/76) | [PR #77](https://github.com/KNightING/camelot-nuxt-layer/pull/77) |
| `features/components/Waveform.md` | 2026-11-12 | 4.6.4.2 | 新增第五種主題風格 tactile、Button loading 與七個新元件 | [#76](https://github.com/KNightING/camelot-nuxt-layer/issues/76) | [PR #77](https://github.com/KNightING/camelot-nuxt-layer/pull/77) |
| `features/components/LevelMeter.md` | 2026-11-12 | 4.6.4.2 | 新增第五種主題風格 tactile、Button loading 與七個新元件 | [#76](https://github.com/KNightING/camelot-nuxt-layer/issues/76) | [PR #77](https://github.com/KNightING/camelot-nuxt-layer/pull/77) |
| `features/components/Tactile-Button.md` | 2026-11-12 | 4.6.4.2 | 新增第五種主題風格 tactile、Button loading 與七個新元件 | [#76](https://github.com/KNightING/camelot-nuxt-layer/issues/76) | [PR #77](https://github.com/KNightING/camelot-nuxt-layer/pull/77) |
| `features/components/Tactile-Input.md` | 2026-11-12 | 4.6.4.2 | 新增第五種主題風格 tactile、Button loading 與七個新元件 | [#76](https://github.com/KNightING/camelot-nuxt-layer/issues/76) | [PR #77](https://github.com/KNightING/camelot-nuxt-layer/pull/77) |
| `features/components/Tactile-Switch.md` | 2026-11-12 | 4.6.4.2 | 新增第五種主題風格 tactile、Button loading 與七個新元件 | [#76](https://github.com/KNightING/camelot-nuxt-layer/issues/76) | [PR #77](https://github.com/KNightING/camelot-nuxt-layer/pull/77) |
| `features/components/Tactile-Checkbox.md` | 2026-11-12 | 4.6.4.2 | 新增第五種主題風格 tactile、Button loading 與七個新元件 | [#76](https://github.com/KNightING/camelot-nuxt-layer/issues/76) | [PR #77](https://github.com/KNightING/camelot-nuxt-layer/pull/77) |
| `features/components/Tactile-Radio.md` | 2026-11-12 | 4.6.4.2 | 新增第五種主題風格 tactile、Button loading 與七個新元件 | [#76](https://github.com/KNightING/camelot-nuxt-layer/issues/76) | [PR #77](https://github.com/KNightING/camelot-nuxt-layer/pull/77) |

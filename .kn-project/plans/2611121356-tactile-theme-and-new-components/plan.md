<!-- REMINDER: Relative Paths Only! No file:///c:/... -->
# Plan: 2611121356 - tactile-theme-and-new-components
- Created: 2026-11-12
- Branch: feature/2611121356-tactile-theme-and-new-components
- Issue: KNightING/camelot-nuxt-layer#76
- Milestone: 4.6.4.2
- Base Branch: 4.6.4.2
- Status: In Progress
- Completed: [Wait for Finish]

## Goals
1. 新增第五種主題風格 `tactile`（與 `material`、`cupertino`、`scifi`、`aqua` 並列），視覺語言取自本次對話產出的「Tape Room 元件」展示頁：實心表面、帶色調的灰階軌道、墨色選中態、彈簧動態、按壓回饋。
2. `tactile` 必須涵蓋目前所有可主題化的元件，切到 `tactile` 時不得有任何元件掉回其他風格的外觀而顯得突兀。
3. Tape Room 展示頁有、Camelot 尚無的元件，新增為 Camelot 元件，並實作全部五種風格。
4. 預設主題維持 `aqua`；既有四種風格的外觀與行為不變。
5. 實作符合 `kn-project-code-style`（通用鐵則、TypeScript、Nuxt／Vue 三層）。

## Architecture

### 主題接入點
- `CamelotThemeMode` union 加入 `'tactile'`（`app/composables/useCamelotTheme.ts:1`）。全域 watcher 已會把值寫進 `data-camelot-theme-mode`，不需改動。
- Router 元件（Button、Input、Switch、Checkbox、Radio）各加一個 `v-else-if="themeMode === 'tactile'"` 分支，渲染 `app/components/Camelot/Tactile/` 下的對應子元件；props 與 emits 與 Aqua 版一致。
- 其餘元件沿用既有做法，在元件內依 `themeMode` 分支加入 `tactile` 的 class 組。

### Tactile 視覺語言（`app/assets/css/tailwind.css`）
色彩一律取自既有 M3 token（`--color-surface-container-*`、`--color-on-surface`、`--cml-color-current-color`），不另立色票，因此色系切換與深淺色自動生效。

| 新增項目 | 內容 | 用途 |
| :--- | :--- | :--- |
| `--ease-tactile` | `linear()` 彈簧曲線，前置 `cubic-bezier(.34,1.56,.64,1)` 作為不支援時的回退 | 所有 tactile 動態 |
| `--radius-tactile-control` | 0.875rem | 按鈕、輸入框、選擇器觸發器等控制項 |
| `--radius-tactile-panel` | 1.375rem | 浮層、卡片、對話框面板 |
| `@utility tactile-surface` | 實心 `surface-container-lowest` 底、頂部 1px 內高光、柔和落影 | 面板、卡片、浮層 |
| `@utility tactile-well` | `surface-container` 實心底、無邊框 | 軌道、輸入底、未選態 |
| `@utility tactile-fill` | 角色色平塗（無漸層）＋同色柔影 | 主要按鈕、開關開啟、勾選 |
| `@utility tactile-ink` | `on-surface` 底配 `surface` 字 | 日曆選中日、分段控制外的強調選中態 |
| `@utility tactile-thumb` | 實心白拇指＋雙層落影 | switch、slider、分段控制滑塊 |
| `@utility tactile-ring` | 2px 角色色焦點環（`focus-visible`） | 鍵盤焦點 |

互動規則：可按的東西按下時 `scale` 縮小並以彈簧回彈；switch 拇指按住時橫向拉伸；checkbox 勾選以描線動畫出現；所有動態在 `prefers-reduced-motion` 下關閉。

### 新元件
Accordion（含 AccordionItem）、Avatar、AvatarGroup、ChatBubble、Waveform、LevelMeter。每個新元件依本專案慣例支援五種風格，檔案放 `app/components/Camelot/`，展示加進 `.playground/app/pages/index.vue`。

## Cross-Repo Scope
無（單一 repo）

## Contract / 介面契約
無（單一 repo）

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

## Open Questions / 待確認事項

### Q1. 要新增哪些元件？— 影響範圍：`app/components/Camelot/` 新檔與 playground
- [x] Accordion
- [x] Avatar 與 AvatarGroup
- [x] ChatBubble
- [x] Waveform 與 LevelMeter
- **決議**：四組全部新增　狀態：✅ 已確認

### Q2. Button 是否加入 `loading` 狀態？— 影響範圍：`Button.vue` 與五個風格的 Button 子元件
- [ ] 不加
- [x] 加入 `loading` prop，五個風格都實作
- **決議**：加入　狀態：✅ 已確認

## Manual Follow-ups / 人工收尾事項
無

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
- **[預設主題]** 維持 `aqua` — 不改變既有消費端的外觀。

## Git Completion Policy
- PR 一律以 `--base 4.6.4.2` 顯式指定 base。
- Issue 綁定後，每個 commit 訊息與 PR body 都含 `Closes #76`。
- commit 一律自動；完成後動作依核准閘決議。
- PR/archive order: Archive automatically triggered on PR request

## References
- 視覺參考：本次對話產出的「Tape Room 元件」展示頁（https://claude.ai/artifact/6fkv1H2z3fpZQ6weDxKNT8）
- `.kn-project/wiki/platform/theme-system.md` — 既有主題系統說明
- `.kn-project/archive/2609161457-aqua-control-radius.md` — Aqua 圓角 token 的先例

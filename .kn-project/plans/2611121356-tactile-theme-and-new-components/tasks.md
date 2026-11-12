# Tasks for 2611121356

## Phase 1 — 主題核心與五個控制項
- [x] `CamelotThemeMode` 加入 `tactile`
- [x] `tailwind.css` 新增 tactile 緩動、圓角 token 與 utility
- [x] 新增 `Tactile/` 的 Button、Input、Switch、Checkbox、Radio
- [x] 五個 router 元件加 tactile 分支
- [x] Playground 主題選項加入 Tactile
- [x] lint、typecheck、在 playground 實際檢視五個控制項（淺色與深色）

## Phase 2 — 表單與選擇類元件
- [x] Textarea、NumberCounter、Slider、SelectV2、Tag、TagGroup、Tabs
- [x] `useCamelotPickerTheme`、DateV2、DateRangeV2、TimeV2
- [x] `useCamelotMenuItemTheme`、MenuItem、CascadeMenuPanel
- [x] lint、typecheck、playground 檢視

## Phase 3 — 浮層、回饋與資料類元件
- [x] BaseDialogV2、BaseBottomSheetV2、SheetHandle、Drawer、Tooltip、Toast
- [x] Loading、Skeleton、ProgressBar、ProgressCircle、ProgressStage
- [x] Table、Pagination、Carousel、RichTextEditor
- [x] Steps、FileChip、FileDropzone、ImageDropzone（scoped CSS）
- [x] 檢視只有 scifi 分支的五個元件，必要時加 tactile 分支
- [x] lint、typecheck、playground 檢視

## Phase 4 — Button loading 與新元件
- [ ] Button 新增 `loading` prop，五個風格的 Button 子元件實作
- [ ] Accordion、AccordionItem
- [ ] Avatar、AvatarGroup
- [ ] ChatBubble
- [ ] Waveform、LevelMeter
- [ ] 新元件型別集中到 `shared/types/camelot.ts`
- [ ] Playground 加入 loading 與新元件展示
- [ ] lint、typecheck、playground 檢視

## Phase 5 — 驗證
- [ ] `pnpm lint`、`pnpm typecheck`、`pnpm test`
- [ ] Playground 逐一切換五種風格，確認既有四種風格無變化、tactile 無遺漏

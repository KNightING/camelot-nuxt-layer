# Tasks for 2609161544

## Phase 1 — Scroll lock 保留捲軸空間
- [x] tailwind.css `html { scrollbar-gutter: stable }`
- [x] 驗證 Dialog / Sheet / Drawer 開啟時 `clientWidth` 不變

## Phase 2 — Sheet 手勢關閉
- [x] 新增 `Internal/SheetHandle.vue`
- [x] `BaseBottomSheetV2` 四主題換把手、拖曳位移、門檻／速度判定、彈回
- [x] `BaseDialogV2` `::backdrop` 依 `--cml-sheet-drag` 漸變

## Phase 3 — Tooltip
- [x] 新增 `Tooltip.vue`（hover / 長壓 / focus，四主題外觀，a11y）
- [x] playground 範例

## Phase 4 — Marquee
- [x] 新增 `Marquee.vue`（雙份內容、ResizeObserver 算 duration、reduced-motion）
- [x] playground 範例

## Phase 5 — 驗證
- [x] 瀏覽器實測（含 mobile 模擬觸控）、`pnpm lint`、`pnpm typecheck`

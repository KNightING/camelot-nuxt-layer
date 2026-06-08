# Tasks for 2606081005

## Phase A — Tailwind 基礎
- [x] 盤點 aqua 與各風格共用之 keyframes/animation，於 `app/assets/css/tailwind.css` 以 `@theme --animate-*` / `@utility` 集中定義（ease-spring/ease-ios、scifi-scan、aqua-fill/aqua-track/aqua-glow）

## Phase B — 核心四元件（Aqua + 四風格 Tailwind 化）
- [x] `Aqua/Button.vue` 新增 + `Button.vue` router 加 aqua 分支
- [x] `Aqua/Switch.vue` 新增 + `Switch.vue` router 加 aqua 分支
- [x] `Aqua/Checkbox.vue` 新增 + `Checkbox.vue` router 加 aqua 分支
- [x] `Aqua/Input.vue` 新增 + `Input.vue` router 加 aqua 分支 + scoped CSS Tailwind 化
- [x] router 元件 `computed` style 改為 `useCamelotRoleColorClass` 組合式（移除 `:style`）+ 共用 `CamelotColorRole` 型別
- [x] `Material/*`、`Cupertino/*`、`Scifi/*` 葉元件 scoped CSS Tailwind 化（10/12 轉換；Scifi/Switch、Scifi/Checkbox 因 `:deep()` 子元件 + keyframe 偽元素，保留精簡 scoped CSS）

## 設計方向變更（使用者回饋）
- [x] Aqua 視覺語言改為 **Frosted Glass 玻璃擬態**（否決 pill/glossy），邊框收細為 hairline；新增 `aqua-glass` / `aqua-thumb` utility，調細 `aqua-track`/`aqua-glow`
- [x] 重做 `Aqua/Switch.vue`（玻璃軌道 + 光澤 thumb）；修正 input 邊框過粗（aqua-track 變淡 + glow 收為 3px）

## Phase C — Inline 主題元件（Aqua + Tailwind 化）
- [x] `BaseDialogV2.vue` 加 aqua（frosted glass 面板 + 玻璃 backdrop）
- [x] `Steps.vue` 加 aqua（玻璃 dot + 漸層完成線）+ 移除死碼 cyber
- [x] `SelectV2.vue` 加 aqua（玻璃 trigger + 毛玻璃選項面板）+ 移除死碼 cyber
- [x] `Tabs.vue` 全面 Tailwind 化（移除整個 scoped style；aqua pill 指示器改用 aqua-fill，動態幾何保留 :style）
- [x] `BaseBottomSheetV2.vue` 加 aqua（frosted glass sheet）
- [x] `Skeleton.vue` 加 aqua（玻璃 shimmer）+ 移除死碼 cyber
- [x] `Toast.vue` 加 aqua（玻璃面板）+ 移除死碼 cyber
- [x] `Loading.vue` 加 aqua（玻璃環形 spinner）+ 移除死碼 cyber
- [x] 全專案移除 cyber 死碼（grep app/ shared/ 已無 cyber）
- [x] 再次調細 input 聚焦外框（aqua-glow ring 3px → 2px 並淡化）

## Phase D — 工具元件 Tailwind 化（第二優先，18 個）
- [x] Gpu（translate3d / -webkit-overflow-scrolling 改 arbitrary class）、Expanded（grid 1fr/0fr 展開改 Tailwind）轉換
- [x] 移除空 `<style scoped>` 區塊：ImageV2、PopupV2、DropImage、Material3Provider、ColorSchemeProvider、CustomColorSchemeProvider、Breakpoints、IdxForm
- [x] Container 本來就無 style
- [~] 保留 scoped CSS（合理：keyframes / ::-webkit-scrollbar / `<transition-group>` / :deep，Tailwind 非良好載體）：Scrollbar、RippleEffect、RippleTabs、NumberCounter、RevealImage、RevealText、SlideTransitionGroup

## 設計修正 Round 2（使用者回饋）
- [x] Tabs：初次進入 pill 寬度不符 → 改 ref + 重算（fonts.ready / resize / 選取變更）
- [x] Select：aqua 選項套用玻璃樣式（圓角、半透明 hover/selected）
- [x] Select：預設選單寬度與觸發器同寬（popupWidthMode 預設改 same-target）
- [x] Steps：圓圈文字未置中 → `.step-dot` 補 align-items: center
- [x] Material Switch：On 圓點過右 → 修正 left（26px→20px，貼合 48px 內軌）
- [x] Material Select：移除預留 label 的上內距（搜尋輸入 pt-4/pb-1）
- [x] Select：開啟選單時 placeholder 顯示已選項 label（selectedLabel）

## 設計修正 Round 3（使用者回饋）
- [x] Select 下拉未選文字看不到 → 改語意 token（未選 text-on-surface / 已選 text-primary / 空狀態 on-surface-variant）
- [x] Material Tabs 重設計：M3 圓角上緣底線 + 文字色 + hover，保留滑動動畫與 ripple
- [x] Sci-Fi Tabs 重設計：純文字 HUD（等寬/大寫/光暈）+ 底部發光掃描線滑動指示器
- [x] DatePicker 補齊四風格（DateV2 / DateRangeV2 / Internal Calendar）：新增 `useCamelotPickerTheme`（triggerClass/panelClass/selectedSurfaceClass）；觸發欄位、浮層/對話框容器、選中日月年表面隨主題切換；Sci-Fi 用 surface token 維持可讀性

## 設計修正 Round 4（使用者回饋）
- [x] Tabs：Material 分頁間距過窄 → gap-1 → gap-6
- [x] Tabs：可捲動時溢出視窗 → aqua/cupertino 容器加 max-w-full + 移除 overflow-visible，改水平捲動
- [x] Tabs：捲動後指示器位置偏移 → left 加回 scrollLeft 換算內容座標
- [x] Aqua DatePicker/Select：開啟動畫過程玻璃模糊未出現 → 移除 Expanded 收合的 opacity-0（opacity<1 會抑制 backdrop-filter）
- [x] Aqua Select 選單背景與 DatePicker 對齊（rounded-3xl + 同 aqua-glass）

## Phase E — 驗證
- [x] `pnpm lint`（eslint --fix）全綠
- [x] `pnpm build` 全程通過
- [ ] dev server 視覺檢查四風格（待使用者確認）

## 保留 scoped CSS 之清單（皆為真正需要 CSS 的情形）
- BaseDialogV2 / BaseBottomSheetV2（`::backdrop`、zoom/slide keyframe）
- Loading / Skeleton / Steps（keyframe 動畫、per-theme override）
- Toast / SlideTransitionGroup（Vue transition class）
- Scrollbar（`::-webkit-scrollbar`）、RippleEffect / RippleTabs / NumberCounter / RevealImage / RevealText（keyframe）
- SelectV2（scifi option `:deep`）、Scifi/Switch、Scifi/Checkbox、Scifi/Frame、Scifi/Reticle、Internal/Calendar

## Phase E — 驗證
- [ ] `pnpm typecheck`（或對應指令）通過
- [ ] `pnpm build` 通過
- [ ] dev server 視覺檢查四風格（material/cupertino/scifi/aqua）切換正常

# Plan: 2610301742 - popup-anchor-positioning
- Created: 2026-10-30
- Branch: feature/2610301742-popup-anchor-positioning
- Issue: KNightING/camelot-nuxt-layer#68
- Milestone: 4.6.3.1
- Base Branch: 4.6.3.1
- Status: In Progress
- Completed: [Wait for Finish]

## Goals
浮層「會跟隨 target 但有延遲」:現行 JS 每幀量測 target 再寫入 fixed 座標,在合成器先捲動時浮層會晚一到數幀才跟上(使用者回報 SelectV2、DateV2、TimeV2、DateRangeV2)。目標:
1. 改用 CSS Anchor Positioning,由瀏覽器原生同步定位,根除延遲;不支援的瀏覽器退回 JS 路徑,且降低該路徑的延遲與開銷。
2. 一併處理同類元件:Tooltip(同樣 fixed + 每幀輪詢)、CascadeMenu(位置只量一次即凍結,完全不跟隨)。
3. 順帶修正:target 捲出容器可視範圍時,浮層目前仍浮在原位(anchor 的 `position-visibility: anchors-visible` 可隱藏)。

## Architecture
- 新增 composable `useCamelotAnchor`:偵測支援(`CSS.supports('anchor-name', '--a')`,SSR 回傳不支援)、以 `useId` 產生每個實例唯一的 `--camelot-anchor-*` 名稱、提供 target 端與浮層端的 style。其餘元件共用,不各自實作。
- **PopupV2**:現有外層 `CamelotGpu`(fixed、尺寸=target 矩形)改為 `position-anchor` + `top/left: anchor()`、`width/height: anchor-size()`,內層既有的 `top-full/bottom-full/left-0/right-0` 與寬度模式 class 不動。target 根節點加 `anchor-name`。支援時不再跑每幀 rAF,`isBottom`/`isRight`(翻轉判斷)改在 scroll/resize/ResizeObserver 觸發時更新。不支援時維持現行 `useElementBounding` + rAF 路徑,但移除重複的更新來源以降低延遲。`visualViewport` 偏移、`teleport`、dialog 判定、`data-camelot-popup` 維持不變。
- **Tooltip**:定位改以 anchor + `position-area`/`position-try-fallbacks`(top→bottom 翻轉、夾進視窗);不支援時維持現行 rAF 計算。
- **CascadeMenu**:根面板以觸發器為 anchor;子面板以被 hover 的列為 anchor(該列加唯一 anchor-name);保留既有翻轉(右側不足翻左、下方不足上移)與首幀隱藏避免閃爍;不支援時維持現行「量一次」路徑,並補上 target 位移/內層捲動時重算。
- 程式碼遵循 `kn-project-code-style`(Nuxt/Vue、TypeScript;註解密度與命名比照既有檔案)。

## Cross-Repo Scope
無（單一 repo）

## Contract / 介面契約
無（單一 repo）。對外 props 與 slots 不變;`PopupV2` 的 `verticalPosition`、`popupWidthMode`、`disabledAutoSpace`、`disabledCloseWhenScrolling` 語意維持。

## Impact Files
- `app/composables/useCamelotAnchor.ts` (new) — 支援偵測、唯一名稱與 style 產生,供三類元件共用
- `tests/composables/useCamelotAnchor.test.ts` (new) — 偵測與命名的單元測試(既有 `tests/composables/` 慣例)
- `app/components/Camelot/PopupV2.vue:135-149,198-223,255-260` (`useElementBounding`、rAF `trackTargetBounding`、scroll 監聽) — 改為 anchor 定位,保留退回路徑;`:16-27` 外層定位 style
- `app/components/Camelot/Tooltip.vue:108-176` (`updatePosition`、`startTracking`) 與 `:30-44` 浮層 style — anchor 定位,保留退回路徑
- `app/components/Camelot/Internal/CascadeMenuPanel.vue:177-254` (`computePosition`、`panelStyle`、resize 監聽) 與 `:16-23` 面板根節點 — anchor 定位,保留退回路徑
- `app/components/Camelot/CascadeMenu.vue:113-115` — 視窗捲動即關閉的行為是否保留見 Open Questions
- `.kn-project/wiki/features/components/PopupV2.md`、`CascadeMenu.md`、`Internal-CascadeMenuPanel.md`、`SelectV2.md` — Phase 5 由 wikification 修剪同步(定位機制描述)
- 不動:`SelectV2.vue`、`DateV2.vue`、`TimeV2.vue`、`DateRangeV2.vue`(皆透過 PopupV2 受益,`PopupV2` 對外介面不變)

## App-Flow Screens
（`project.md` 已記錄 `appFlow: false`,不適用）

## Open Questions / 待確認事項
### Q1. CascadeMenu 視窗捲動時目前會整個關閉(`CascadeMenu.vue:113`),改為跟隨後是否維持? — 影響範圍:CascadeMenu.vue
- [x] 維持捲動即關閉　(建議,理由:行為不變、風險低;跟隨只用於內層容器捲動與位移)
- [ ] 改為不關閉、完全跟隨(與 Select 的預設一致)
- **決議**:維持捲動即關閉　狀態:✅ 已確認

## Manual Follow-ups / 人工收尾事項
- **[合併後]** 在真實觸控裝置(iOS Safari、Android Chrome)手動滑動確認浮層跟隨無延遲 — 開啟 playground,於捲動容器內開 Select / Date / Tooltip / CascadeMenu 後手指滑動 — agent 無實體裝置,headless 無法量到合成器捲動
- **[合併後]** 使用此 layer 的下游應用更新依賴並重建部署 — 各應用 `pnpm update camelot-nuxt3-layer` 後重建映像 — 下游 repo 不在本流程範圍

## Key Decisions
- **[Q1]** CascadeMenu 維持視窗捲動即關閉 — 理由:行為不變、風險低;跟隨只用於內層容器捲動與位移。
- **[範圍]** 使用者選「兩個都做」:CSS Anchor Positioning + 降低 JS 退回路徑延遲;並納入 Tooltip 與 CascadeMenu。
- **[Milestone]** 使用者手動輸入 `4.6.3.1`(沿用尚未併回主幹的版本分支 `4.6.3.1`,已含 #67 的套件升級與 dedupe);milestone 仍為 open,分支已存在於遠端,不需建立。
- **[Rule 24]** 非標準格式,跳過版本檔同步。
- **[整合主幹]** 遠端僅有 `main`。
- **[完成後]** 預設:commit + 開 PR(base 4.6.3.1)。

## Git Completion Policy
- PR 一律以 `--base 4.6.3.1` 顯式指定。
- 每個 commit 與 PR body 含 `Closes #${N}`。
- 完成時 `git fetch` 後 `git rebase origin/4.6.3.1` 並 `git push --force-with-lease --force-if-includes`。
- Archive automatically triggered on PR request。

## References
- 使用者回報:Select/Date/Time/DateRange 浮層會跟隨但有延遲(2026-10-30)
- 實測:headless Chromium 程式捲動、位移、寬度變動皆一幀內跟上;合成器捲動延遲無法程式量測

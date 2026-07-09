<!-- REMINDER: Relative Paths Only! -->
# Plan: 2607081704 - 自訂 overlay 捲軸元件化(H/V 皆可)+ Table 兩軸替換

- Created: 2026-07-08
- Branch: main(經使用者核准直接於 main 修改)
- Status: Archived
- Completed: 2026-07-09 15:01

## 已定案決定
1. 元件名 = **`CamelotOverlayScrollbar`**。
2. 垂直 hover 放大**往右長**（`transform: scaleX`、`transform-origin: center left`）。
3. **Table 底部保留水平軸空間**（≈未 hover 高度）——scroll 容器加 `padding-bottom`，讓 docked 水平軸落在保留區、不覆蓋最後一列。
4. 既有 `CamelotScrollbar`（包裝式）**維持不動**（預設，使用者未反對）。

## Goals

1. 把這次做的水平 overlay 捲軸(docking/浮動、可拖曳、scaleY 放大、淡邊、色彩角色)**元件化**,並支援**垂直**版本,以 prop 切換方向。
2. Table 的**垂直捲軸也改用此自訂捲軸**(取代原生),兩軸一致。
3. 順勢移除先前 `overflow-x:hidden` + wheel handler 的 workaround。

## Architecture

### 1. 一般化 composable → `useCamelotOverlayScrollbar`

將 `useCamelotFloatingScrollbar` 改為方向感知(`orientation: 'horizontal' | 'vertical'`),把「主軸(main)/交叉軸(cross)」抽象化:
- 水平:main = X(scrollLeft/scrollWidth/clientWidth/width),cross = 高度。
- 垂直:main = Y(scrollTop/scrollHeight/clientHeight/height),cross = 寬度。
- 幾何計算(thumbSize/thumbOffset/maxThumbOffset)沿用,只是取用的維度依 orientation 切換。
- 拖曳:水平用 `clientX`+scrollLeft,垂直用 `clientY`+scrollTop。
- **docking/浮動**:僅水平需要(貼表格底 / 浮動視窗底);垂直恆為 docked(容器內右側),不浮動。以 `floatingEnabled` + orientation 控制。
- 保留 hover/拖曳 scaleY 放大(垂直改 scaleX)、淡邊、色彩角色(inline `thumbColor`)。

### 2. 新元件 `CamelotOverlayScrollbar`(app/components/Camelot/OverlayScrollbar.vue)

- Props:`container`(目標捲動容器 HTMLElement）、`orientation`、`floating?`、`color?`、`inset?`。
- 內部呼叫 `useCamelotOverlayScrollbar`,渲染 track + thumb + bar（含 `<Teleport :disabled>` 於浮動態）。
- 純呈現/互動,不自建捲動容器(附著呼叫端傳入的容器）→ 適合 Table 這種已有捲動容器 + 虛擬滾動的情境。
- 註:既有 `CamelotScrollbar` 是**包裝式**(自建容器、slot），與本元件定位不同;本計畫**不改動** `CamelotScrollbar`(其消費端 Container/playground 不受影響），日後可另議整併。

### 3. Table 改造(兩軸皆自訂 overlay)

- 捲動容器改回 `overflow: auto`(保留原生滾輪/觸控/鍵盤捲動),隱藏**兩軸**原生捲軸
  (`scrollbar-width: none` + `::-webkit-scrollbar { display: none }` — 兩軸一起隱藏是可靠做法)。
- **移除** `overflow-x:hidden` 與 `onWheelHorizontal` workaround(原生捲動已恢復)。
- 疊兩個 `CamelotOverlayScrollbar`:水平(floating 由 `floatingScrollbar` prop 控制)、垂直(恆 docked、右側內縮)。
- 兩軸皆吃 `color` 角色;垂直捲軸的淡邊/放大同水平。

## Impact Files

| 檔案 | 動作 |
| :--- | :--- |
| `app/composables/useCamelotFloatingScrollbar.ts` | 一般化為 `useCamelotOverlayScrollbar`(方向感知);保留舊名 re-export 或更新引用 |
| `app/components/Camelot/OverlayScrollbar.vue` | 新增呈現元件 |
| `app/components/Camelot/Table.vue` | 改用兩個 OverlayScrollbar;容器改 overflow:auto + 隱藏雙軸原生;移除 wheel workaround |
| `.playground/app/pages/index.vue` | demo 視需要展示垂直捲軸 |
| `.agents/project/wiki/features/layout-data-components.md` | Phase 5 補元件說明 |

## Open Decisions（請確認）

1. **元件命名**:`CamelotOverlayScrollbar`?(或 `CamelotVirtualScrollbar` / 沿用 `CamelotScrollbar` v2）
2. **是否整併既有 `CamelotScrollbar`**:本計畫預設**不動它**(降低風險);若要統一為單一捲軸元件再另開計畫。
3. **垂直捲軸 hover 放大方向**:垂直改用 `scaleX`(往左長)合理嗎?

## Verification

- Playground 實測:水平(docking/浮動、拖曳、色彩)、垂直(容器內右側、拖曳捲動、色彩、放大動畫)、
  原生滾輪/觸控/鍵盤捲動仍可用、無雙重捲軸、hover 固定欄位不重疊、無 console 錯誤。

## Code Style

遵循 `kn:project:code-style`(Composition API、composable 抽離、prop 純型別、去魔法值、VueUse 監聽自動清理)。

## Git Completion Policy

- After user-approved commits, completion will run `git rebase main` and `git push --force-with-lease`(若於分支)。
- PR/archive order: Archive automatically triggered on PR request.

## References

- 前置:計畫 `2607081506`(水平 overlay 捲軸、docking/浮動、color prop)
- 既有:`app/components/Camelot/Scrollbar.vue`(包裝式自訂捲軸)、`VirtualScroll.vue` / `useCamelotVirtual.ts`(虛擬滾動)

## Tasks (完成)

# Tasks for 2607081704

- [x] 調查現有捲軸/虛擬滾動元件(CamelotScrollbar 包裝式、VirtualScroll、useCamelotVirtual)
- [x] 一般化 → 方向感知 `useCamelotOverlayScrollbar`(main/cross 軸抽象;垂直 scaleX 往右、水平 scaleY 往上);刪除舊 `useCamelotFloatingScrollbar`
- [x] 新增 `CamelotOverlayScrollbar.vue`(container + orientation + floatingEnabled + color prop;Teleport :disabled 切 docked/floating)
- [x] Table 改用兩個 OverlayScrollbar;容器改 overflow:auto + 隱藏雙軸原生;移除 overflow-x:hidden + wheel workaround;scroll 容器加 padding-bottom 12px 保留水平軸空間
- [ ] playground demo 展示垂直捲軸(demo 表 5 列無垂直溢出;可考慮加一個垂直溢出的展示)
- [x] 驗證:H docked+拖曳、V 右側 docked+拖曳、overflow auto(原生捲動恢復)、原生軸隱藏、padding 保留使最後列不被覆蓋、hover 不透明、無錯誤
- [x] 修正(依使用者):垂直改「靠右、往左長」(transform-origin center right);加 `startInset` prop,垂直傳 headerOffset → 從表頭下方開始不覆蓋 header;scroll 容器加 padding-right 12px 提供垂直軸固定空間
- [x] 驗證:垂直 startsBelowHeader、barOrigin center right + idle scaleX(0.5)、右側 docked、垂直拖曳、padding-right/bottom 各 12px、無錯誤
- [x] 修正(依使用者):(1) gutter 漏內容 → 保留空間由 padding 改**透明 border 16px**(overflow 裁切在 padding box,內容不進 border 區,可視 bar 落在乾淨 gutter);(2) 垂直 startInset 由 headerOffset 改 **headerHeight**(只避開 header、覆蓋固定列)
- [x] 驗證:可視 bar 在 border gutter 內(H/V idleBarInGutter true、無內容在後)、垂直覆蓋固定列(bar 頂 200 ≤ 固定列底 233)且不蓋 header、水平不蓋最後列、無錯誤
- [x] 調整(依使用者):(1) 垂直軸改覆蓋 header(startInset 0);(2) Table 新增 `reserveVerticalScrollbar`/`reserveHorizontalScrollbar` 開關(關→無 border gutter、捲軸直接覆蓋)+ demo 兩個 switch;(3) bar 縮小 idle 4/hover 8、命中區 10、gutter 12、CROSS_INSET 3/MAIN_INSET 6
- [x] 驗證:bar idle 4/命中 10/gutter 12、垂直覆蓋 header、開關關閉→border 0(覆蓋)開啟→12、無錯誤
- [x] 修 bug:換頁/資料變動時容器 box 不變、內容(scrollHeight)改變 → 原本需捲動才重算捲軸。加 `useResizeObserver(contentEl)` 觀察內容元素(容器 firstElementChild),內容變高即重算。實測換 20/頁不滾動即出現垂直軸

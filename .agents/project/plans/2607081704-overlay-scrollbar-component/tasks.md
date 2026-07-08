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

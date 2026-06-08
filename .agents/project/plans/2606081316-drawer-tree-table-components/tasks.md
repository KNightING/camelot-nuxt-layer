# Tasks for 2606081316

## Phase 1 — Drawer ✅
- [x] `Drawer.vue`：floating（Teleport + scrim + slide）+ Esc/遮罩關閉 + body 捲動鎖
- [x] `Drawer.vue`：fixed（行內常駐，寬度展開/收合）
- [x] left / right 雙向
- [x] 四風格樣式（material/cupertino/scifi/aqua）+ spring 動畫 + reduced-motion
- [x] lint / build

## Phase 2 — Tree ✅
- [x] `shared/types/tree.ts`（CamelotTreeNode + Context）
- [x] `Internal/TreeNode.vue`（遞迴節點 + 節點 slot 遞迴轉發）
- [x] `Tree.vue`：多階層 + 展開/收合（CamelotExpanded 動畫）+ v-model:checked/expanded + defaultExpandAll
- [x] 勾選：CamelotCheckbox + 父子連動 + indeterminate（順帶為 Checkbox 全主題新增 indeterminate）
- [x] 主題：勾選沿用四風格 Checkbox；hover/縮排/箭頭
- [x] lint / build

## Phase 3 — Table ✅
- [x] `shared/types/table.ts`（CamelotTableColumn + accessor）
- [x] `Table.vue`：泛型 `<T>` 渲染 + rowKey + `head-${key}`/`cell-${key}`/empty slot
- [x] fixed header（sticky top + maxHeight 捲動）
- [x] fixed columns（左/右 sticky + 累積偏移計算 + 邊緣陰影）
- [x] pinned rows（置頂固定列，sticky top = 量測表頭高度）
- [x] 雙色斑馬列 + hover（不透明 hover 底以免固定欄穿透）
- [x] 四風格樣式（表頭/容器/分隔線/斑馬/hover/固定欄陰影）
- [x] lint / build

## 設計修正 Round 13（使用者回饋）
- [x] Aqua 選中柔光太遠：`aqua-fill` box-shadow 由 `0 6px 16px -4px/42%` 收緊為 `0 2px 8px -3px/45%`，glow 更貼合元件（共用 utility，套用於 button/switch/checkbox/tabs/menu 等所有 aqua 填滿元件）。

## 設計修正 Round 12（使用者回饋）
- [x] Menu 選中陰影太靠外：縮小 nested ul 內距（pr-1.5 pb-2 pt-1.5），pill 更貼齊、陰影不外擴。
- [x] Menu 導引線在最後子項加 L 形轉角：新增 `after:` 水平 pseudo（bottom-[27px]、w-2.5）與垂直線交會成 └，指向最後一個子項中線（實測對齊 27px）。

## 設計修正 Round 11（使用者回饋）
- [x] Menu 導引線改為「止於最後一個子項中線」：border-l 改為 `before:` 絕對定位 pseudo line（top-2 → bottom-[31px]，實測最後子項中心距 ul 底 31px 對齊）。更易辨識層級、不再有跨層連接感。
- [x] Menu 選中項陰影被裁切：nested `<ul>` 加內距（pt-2 pr-3 pb-3 pl-3），讓選中 pill 的陰影不被 CamelotExpanded 的 overflow-hidden 切掉。

## 設計修正 Round 9（使用者回饋）
- [x] Menu 階層導引線更明顯：由 faint 實線改為虛線（後續因「連接感」再調整，見 Round 10）。
- [x] Round 10：取消虛線（改回實線 `border-outline-variant`），並加大層級縮排（ml-[22px] pl-3）讓各層導引線分得更開、不再有「連接到別層」的擁擠感。

## 設計修正 Round 8（使用者回饋）
- [x] Menu：選中子項時，父（祖先）節點文字也變主色（text-primary）但「不上選中底色」。新增 context `isActiveAncestor`（Menu 端遞迴判斷選中值是否在該節點子孫內），MenuItem 分三態：選中=activeClass（含底色）、祖先=text-primary 無底色、其餘=一般。實測：今日選中→待處理/訂單管理 變主色且 bg 透明。

## 設計修正 Round 7（使用者回饋）
- [x] Menu 視覺層級區隔：巢狀層級加左側導引線（border-l 縮排 rail）；頂層 font-medium 滿色、深層淡化（text-on-surface/75）；確認支援無限階層（遞迴）、選取以 defineModel 雙向綁定。

## 設計修正 Round 6（使用者回饋）
- [x] Aqua Select 選單有黑色不透明底（DatePicker 為透明模糊）：根因為選項捲動容器的 `bg-inherit` 把面板的半透明深色「再畫一層」疊在模糊背景之上 → 兩層半透明深色疊成近乎全黑、且蓋住 backdrop blur。修法：內層 `bg-inherit` → `bg-transparent`，只保留面板單層 aqua-glass。實測：面板 0.72 半透明 + blur(20px)、內層透明 → 與 DatePicker 一致。

## 設計修正 Round 5（使用者回饋）
- [x] Aqua Select 選單與 DatePicker 選單設計不一致：實測發現 (1) Select 的 PopupV2 wrapper 用 shadow-lg/rounded-md 而 DatePicker 用 shadow-xl/rounded-xl；(2) options-container 基底 `rounded-md` 因 Tailwind 樣式表順序「贏過」aqua 的 `rounded-3xl`，導致面板圓角 6px（DatePicker 為 24px）。修法：Select wrapper 改 shadow-xl/rounded-xl；移除基底 rounded-md、改各主題在 :class 指定圓角。實測：兩者皆 radius 24px、blur(20px)、同底色。

## 設計修正 Round 4（使用者回饋）
- [x] Tree 預設改由 `CamelotCheckbox` 的 `label` 渲染節點文字（同一元件、完全一致），仍保留 `#node` slot 自訂：以 Tree 端 `useSlots().node` 偵測消費端是否提供 slot，透過 context `hasNodeSlot` 傳遞給遞迴 TreeNode 決定走「checkbox label」或「label-less checkbox + slot」。實測：label 在 checkbox 內、點 label 可勾選。

## 設計修正 Round 3（使用者回饋）
- [x] Tree 文字與 Checkbox 文字一致性：釐清「非同一元件」（Tree 自渲染 label span、Checkbox 在 Tree 內無 label）。統一為 text-sm 14px、checkbox→label 間距 8px、垂直置中；並修掉 Material/Cupertino checkbox 在無 label 時 box `mr-2` 的懸空間距（改 root `gap-2`）。實測：standalone 與 tree 的 gap 皆 8px、字級皆 14px。

## 設計修正 Round 2（使用者回饋）
- [x] Checkbox 勾選/未勾選時位置位移（根因，連帶影響 Tree）：以 dev server 實測確認 box 尺寸穩定，但勾記號用 `v-if` 增減「in-flow flex item」會改變 inline-flex 基線 → 行高跳 ~1.5px。改為勾記號/半選記號 **絕對定位 + opacity 切換**（box 內無流內容、基線恆定）。Material/Cupertino/Aqua 三葉皆修；實測切換位移 = 0。

## 設計修正 Round 1（使用者回饋）
- [x] Table：捲動條溢出圓角 / 縮小時詭異空隙 → 拆「外層 rounded+overflow-hidden / 內層 overflow-auto」+ table min-w-max
- [x] Tree：勾選後列高變動造成畫面位移 → 列固定 min-h-[40px]；首頁 Checked 文字改 truncate
- [x] Drawer：移除所有風格邊框（aqua 改無邊框玻璃、scifi 去邊留光暈）
- [x] 新增 `CamelotMenu`（+ `Internal/MenuItem` 遞迴、`shared/types/menu.ts`）：多階層導覽選單、四風格 active 樣式；首頁左側 Drawer 展示三階層範例

## Phase 4 — 驗證 ✅
- [x] `pnpm lint` 全綠
- [x] `pnpm build` 通過
- [ ] （可選）dev 視覺檢查四風格（待使用者確認）

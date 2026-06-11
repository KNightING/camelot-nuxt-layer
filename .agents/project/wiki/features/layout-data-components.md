# 🧱 Drawer / Tree / Table / Menu / CascadeMenu

> 版面與資料導覽元件，皆支援四種主題（material / cupertino / scifi / aqua）。

## 🗄️ Drawer（`Drawer.vue`）

側邊抽屜，左右皆可、兩種模式。

| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :--- | :--- |
| `open` (v-model) | boolean | false | 開關 |
| `position` | `'left' \| 'right'` | `'left'` | 滑出方向 |
| `variant` | `'floating' \| 'fixed'` | `'floating'` | 浮動（Teleport + 遮罩 + 滑入）/ 固定（行內常駐、寬度展開收合） |
| `width` | string | `'320px'` | 面板寬度 |
| `closeByMask` | boolean | true | 點遮罩 / Esc 關閉（floating） |
| `zIndex` | number | 50 | — |

- floating：遮罩 scrim + spring 滑入、`Esc`/遮罩關閉、開啟時鎖 body 捲動。**面板無邊框**（aqua 為無邊框玻璃）。

## 🌳 Tree（`Tree.vue` + `Internal/TreeNode.vue`）

多階層、可勾選（父子連動 + 半選 indeterminate）。

| Prop / Model | 說明 |
| :--- | :--- |
| `nodes: CamelotTreeNode[]` | 樹狀資料（`label`/`value`/`children?`/`disabled?`/`data?`） |
| `checkable` | 顯示勾選框 |
| `v-model:checked` | 已勾選的**葉節點**值；父節點勾選/半選由葉節點推導 |
| `v-model:expanded` / `defaultExpandAll` | 展開狀態 |
| `#node` slot | 自訂節點渲染（`{ node, level, isChecked, isExpanded }`） |
| `@nodeClick` | 點擊節點事件 |

- 勾選沿用 `CamelotCheckbox`（四風格 + indeterminate）。**預設**節點文字由 Checkbox 的 `label` 渲染（與獨立 Checkbox 完全一致）；提供 `#node` slot 時改為 label-less checkbox + slot（以 `useSlots()` 在 Tree 端偵測）。
- 列固定 `min-h` 避免勾選造成位移。

## 📊 Table（`Table.vue`，泛型 `<T>`）

| Prop | 說明 |
| :--- | :--- |
| `columns: CamelotTableColumn<T>[]` | `key`/`title`/`width?`/`align?`/`fixed?: 'left'\|'right'`/`accessor?` |
| `data: T[]` / `rowKey` | 列資料（任意 object 型別）/ 列 key |
| `stripe` / `hover` | 雙色斑馬列 / hover 高亮（不透明，固定欄不穿透） |
| `maxHeight` | 啟用 fixed header 捲動 |
| `pinnedTopRows: T[]` | 置頂固定列（sticky，top = 量測表頭高度） |
| `#head-${key}` / `#cell-${key}` / `#empty` | 自訂表頭 / 儲存格 / 空狀態 |

- 以 `position: sticky` 實作 fixed header / fixed columns（左右，累積偏移 + 邊緣陰影）/ pinned rows。
- 外層 `rounded + overflow-hidden`、內層 `overflow-auto`，避免捲動條溢出圓角。

## 🧭 Menu（`Menu.vue` + `Internal/MenuItem.vue`）

多階層導覽選單（遞迴、無限階層）。

| Prop / Model | 說明 |
| :--- | :--- |
| `items: CamelotMenuItem[]` | 巢狀項目（`label`/`value`/`children?`/`disabled?`） |
| `v-model`（active） | 目前選取項（單一 id 值） |
| `v-model:expanded` / `defaultExpandAll` | 展開狀態 |
| `@select` | 選取葉節點事件（帶 item） |

- 視覺層級：左側實線導引線（止於最後一個子項中線、轉 `└` L 形轉角）+ 漸進縮排 + 頂層粗/深層淡。
- **祖先變色**：選中子項時，其父/祖先節點文字變主色但**不上選中底色**（`isActiveAncestor`）。
- 各風格 active 樣式（aqua 玻璃 pill / scifi 發光 / material·cupertino primary tint）。

## 🪄 CascadeMenu（`CascadeMenu.vue` + `Internal/CascadeMenuPanel.vue`）

點擊觸發、子選單**向側邊飛出**的多階層彈出選單（無限階層）。與 `Menu` 的差異：`Menu` 是行內手風琴（子層往下縮排），`CascadeMenu` 是浮層飛出（Teleport + fixed，子層往右側展開）。

| Prop / Model / Slot / Emit | 預設 | 說明 |
| :--- | :--- | :--- |
| `items: CamelotCascadeMenuItem[]` | — | 巢狀資料（`label`/`value`/`children?`/`disabled?`/`divider?`/`data?`） |
| `color: CamelotColorRole` | `primary` | 色彩角色（注入 CurrentColor） |
| `submenuTrigger: 'hover' \| 'click'` | `hover` | 子選單展開方式（根面板一律由觸發器點擊開啟） |
| `openDelay` / `closeDelay` | `80` / `160` | hover 展開／收合延遲 (ms) |
| `zIndex` | `50` | 浮層基底（實際 = base + level，逐層遞增） |
| `disabled` / `closeOnSelect` | `false` / `true` | 停用觸發器／點葉節點後關閉整棵 |
| `v-model:open` | `false` | 根面板開關（可手動控制） |
| `#default` slot | — | 觸發器內容（如「設定」按鈕） |
| `@select [item]` | — | 點選葉節點事件 |

- **定位凍結**：面板於 `onMounted`（繪製前）同步量測 anchor 與自身尺寸算好位置並凍結，僅在視窗 `resize` 重算；定位前 `visibility:hidden` 佔位 → 消除開啟首幀 (0,0) 抖動。
- **翻轉**：根面板貼觸發器下緣左對齊（下/右不足翻上/右對齊）；子面板於該列右側頂端對齊（右不足翻左、下不足上移、夾邊 8px）。
- **子面板 `:key="openItem.value"`**：兄弟切換時重建乾淨實例，避免舊面板殘留並在淡出時飛到角落。
- **hover 點擊**：hover 模式點含子項父項不收合、不關閉選單（展開交給滑入）；葉節點才 `select`。click 模式父項可點擊 toggle。
- **CurrentColor（Teleport-safe）**：每層面板 Teleport 至 body 會中斷 CSS 變數繼承，故由 context 提供 `roleColorClass()` 並**逐面板套用**；四風格 active/hover/`aqua-fill` 全消費 `--cml-color-current-color`。
- **四風格 surface**：aqua=`aqua-glass` 圓角玻璃；scifi=無圓角＋等寬字＋current/30% 邊＋內發光；cupertino=blur(24px) 半透明圓角；material=實色 surface＋陰影。

## 📌 References
- 歸檔計畫：[2606081316-drawer-tree-table-components](../../archive/2606081316-drawer-tree-table-components.md)、[2606111326-cascade-popup-menu](../../archive/2606111326-cascade-popup-menu.md)
- 型別：`shared/types/tree.ts`、`shared/types/table.ts`、`shared/types/menu.ts`、`shared/types/cascadeMenu.ts`
- 主題系統：[Theme System](./theme-system.md)

---

[🎨 主題系統](./theme-system.md) | [🗓️ Calendar](./calendar.md) | [⚙️ 環境變數](../environment.md) | [🏠 Wiki](../index.md)

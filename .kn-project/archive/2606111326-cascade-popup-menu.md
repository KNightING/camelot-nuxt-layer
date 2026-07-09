<!-- REMINDER: Relative Paths Only! No file:///c:/... -->
# Plan: 2606111326 - Cascade Popup Menu（多階層彈出選單）

- Created: 2026-06-11
- Branch: feature/2606111326-cascade-popup-menu
- Status: Archived
- Completed: 2026-06-11

## Goals

新增「點擊觸發 → 彈出選單 → 子選單向側邊持續飛出（flyout cascade）」的多階層選單元件，與既有元件區隔：

- 既有 `Menu`：行內手風琴式（accordion）導覽樹，子層往下方縮排展開。
- 本元件 `CascadeMenu`：浮層式（Teleport + fixed），點擊觸發器開啟根面板，含子項的列以 hover/點擊向**右側（空間不足自動翻轉至左側／上方）飛出子面板**，可無限階層持續展開。

需求重點：無限階層、四風格（material/cupertino/scifi/aqua 隨 themeMode 切換）、善用 CurrentColor 系統。

## 最終實作

### 新增檔案
| 檔案 | 角色 |
| :--- | :--- |
| `shared/types/cascadeMenu.ts` | `CamelotCascadeMenuItem`（label/value/children?/disabled?/divider?/data?）、`CamelotCascadeMenuContext`、`CAMELOT_CASCADE_MENU_KEY` |
| `app/components/Camelot/CascadeMenu.vue` | 根元件：trigger slot + open 狀態 + provide context + 注入 CurrentColor；click-outside / Esc / 捲動關閉 |
| `app/components/Camelot/Internal/CascadeMenuPanel.vue` | 遞迴飛出面板：Teleport+fixed、掛載時量測一次並凍結定位、自動翻轉、四風格外觀、開場動畫 |

### 元件 API（`CascadeMenu.vue`）
| Prop / Model / Slot / Emit | 預設 | 說明 |
| :--- | :--- | :--- |
| `items: CamelotCascadeMenuItem[]` | — | 巢狀選單資料 |
| `color: CamelotColorRole` | `primary` | 色彩角色（注入 CurrentColor） |
| `submenuTrigger: 'hover' \| 'click'` | `hover` | 子選單展開方式（根面板一律由觸發器點擊開啟） |
| `openDelay` / `closeDelay` | `80` / `160` | hover 展開／收合延遲 (ms) |
| `zIndex` | `50` | 浮層基底（實際 = base + level） |
| `disabled` / `closeOnSelect` | `false` / `true` | 停用觸發器／點葉節點後關閉整棵 |
| `v-model:open` | `false` | 根面板開關（可手動控制） |
| `#default` slot | — | 觸發器內容 |
| `@select [item]` | — | 點選葉節點事件 |

### 關鍵設計與修正
- **定位凍結**：面板於 `onMounted`（繪製前）以 `anchor.getBoundingClientRect()` + 面板 `offsetWidth/Height` 同步算好 `top/left` 並凍結，僅在視窗 `resize` 重算；定位前以 `visibility:hidden` 佔位 → 消除開啟首幀 (0,0) 抖動。
- **子面板 `:key="openItem.value"`**：兄弟子選單切換時重建乾淨實例，避免舊面板殘留並在淡出時飛到畫面左上角。
- **翻轉**：根面板貼觸發器下緣左對齊（下/右不足翻上/右對齊）；子面板出現在列右側頂端對齊（右不足翻左、下不足上移、夾邊 8px）。
- **hover 點擊行為**：hover 模式點擊含子項父項時 `return`（不收合、不關閉選單）；葉節點才 `select`。click 模式父項仍可點擊 toggle。
- **CurrentColor（Teleport-safe）**：因每層面板皆 Teleport 至 body 會中斷 CSS 變數繼承，故 context 提供 `roleColorClass()` literal class 由**每層面板各自套用**；四風格 active/hover/aqua-fill 全數消費 `--cml-color-current-color`。
- **四風格 surface**：aqua=`aqua-glass` 圓角玻璃；scifi=無圓角＋等寬字＋current/30% 邊＋內發光；cupertino=blur(24px) 半透明圓角；material=實色 surface＋陰影。

## 驗證（瀏覽器實測，1440×900）
- 4 層飛出正確定位（root 在觸發器下、子面板向右 top-align、z-index 逐層遞增 50→53）。
- 每層 Teleport 面板皆正確注入 `--cml-color-current-color`（#d0bcff），四主題 surface/active 各異。
- 開啟無 (0,0) 抖動；外觀>主題深層切到帳號設定無殘留面板飛到角落（`cornerStuck: []`）。
- hover 父項點擊不關閉（面板 2→2）；葉節點點擊選取並關閉（→0）；click 模式父項 toggle（1→2→1）；disabled opacity .4/pointer-events none；divider 1px；closeOnSelect 關閉整棵；eslint 通過、無 console error。

## Tasks（最終狀態）
- [x] 型別 `shared/types/cascadeMenu.ts`
- [x] `CascadeMenu.vue`（root、context、CurrentColor、關閉機制）
- [x] `CascadeMenuPanel.vue`（Teleport+fixed 凍結定位、翻轉、遞迴、hover 開合、四風格、動畫）
- [x] 四風格 surface + 列 hover/active 套色、chevron/disabled/divider
- [x] `.playground` 展示卡（hover + click 兩種觸發、4 層）
- [x] preview 驗證 + eslint + 兩個定位 bug 修正 + hover 點擊不關閉
- [x] code-style 自檢（defineModel / useTemplateRef / tuple emits / 具名型別 / 無手動 import）
- [x] wiki 功能矩陣 + layout-data-components 節點

## References
- 主題系統：`.agents/project/wiki/features/theme-system.md`
- 版面/資料元件：`.agents/project/wiki/features/layout-data-components.md`
- 定位/浮層既有實作參考：`app/components/Camelot/PopupV2.vue`
- CurrentColor：`app/composables/useCamelotRoleColorClass.ts`、`app/assets/css/tailwind.css`（`aqua-*` utility）
- 既有 Menu：`app/components/Camelot/Menu.vue`、`app/components/Camelot/Internal/MenuItem.vue`、`shared/types/menu.ts`

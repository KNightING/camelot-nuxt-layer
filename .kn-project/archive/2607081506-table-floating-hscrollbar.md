<!-- REMINDER: Relative Paths Only! -->
# Plan: 2607081506 - CamelotTable 浮動水平捲軸(floating horizontal scrollbar)

- Created: 2026-07-08
- Branch: main(經使用者核准直接於 main 修改)
- Status: Archived
- Completed: 2026-07-09 15:01

## Goals

寬表格需要水平捲動、但表格底部(原生水平捲軸所在)落在視窗外時,於**視窗底部**浮現一條自訂水平捲軸,與表格雙向同步,讓使用者不必捲到表格底就能水平捲動。

## Architecture

### 新增 Composable:`app/composables/useCamelotFloatingScrollbar.ts`

將浮動捲軸的量測、可見性判斷、雙向同步邏輯抽出(SRP;Table.vue 已約 360 行)。

```ts
export const useCamelotFloatingScrollbar = (
  container: Readonly<ShallowRef<HTMLElement | null>>, // 表格捲動容器
  proxy: Readonly<ShallowRef<HTMLElement | null>>,     // 浮動代理元素
  enabled: () => boolean,                              // 對應 floatingScrollbar prop
) => { /* ... */ return { visible, spacerWidth, proxyStyle, syncFromProxy } }
```

- **量測**:`container.scrollWidth` / `clientWidth` / `getBoundingClientRect()`(left/top/bottom)。
- **可見性**(三者皆成立才顯示):
  1. 有水平溢出 `scrollWidth > clientWidth`
  2. 容器底在視窗外 `rect.bottom > window.innerHeight`(原生水平捲軸看不到)
  3. 容器仍在視窗內 `rect.top < window.innerHeight`
- **代理定位**:`proxyStyle` = `position: fixed; bottom: 0; left: rect.left; width: clientWidth`。
- **雙向同步**:`container` scroll → 更新 `proxy.scrollLeft`;`proxy` scroll(`syncFromProxy`)→ 更新 `container.scrollLeft`。
- **監聽**:`useEventListener(container,'scroll')`、`window` scroll/resize、`useResizeObserver(container)` 重新量測;`enabled()` 為 false 時一律 `visible=false`(向後相容)。

### `app/components/Camelot/Table.vue`

1. 新增 prop:`floatingScrollbar?: boolean`(預設 **`true`**,元件預設開啟浮空軸)。
2. 模板加入 **Teleport 到 `body`** 的代理捲軸(必須 teleport:外層 `aqua-glass` 的 `backdrop-filter` 會使 fixed 以外層為基準,加上外層 `overflow-hidden` 會裁切):
   ```html
   <Teleport to="body">
     <div v-if="floatingScrollbar && floating.visible.value"
          ref="floatingProxyRef"
          class="cml-floating-scrollbar"
          :style="floating.proxyStyle.value"
          @scroll="floating.syncFromProxy">
       <div :style="{ width: `${floating.spacerWidth.value}px`, height: '1px' }" />
     </div>
   </Teleport>
   ```
3. `<style scoped>`:`.cml-floating-scrollbar` 設 `overflow-x: auto; overflow-y: hidden`,自訂較粗(約 10px)、走主題色(`--cml-color-...`)的 `::-webkit-scrollbar`,覆寫全域 2px。

### `.playground/app/pages/index.vue`(Table demo)

- 既有欄位加寬並補 address/email/hours/manager/note,使表格寬約 2010px(桌機寬螢幕也會水平溢出,浮空軸才有東西可捲)。
- **沿用原本的固定高度表格**(不另建卡片),加上 `CamelotSwitch`「浮動水平捲軸」開關(`v-model=tableFloatingScrollbar`,預設 `true`),
  綁定 `:floating-scrollbar="tableFloatingScrollbar"` 示範開/關。

### 元件預設值

- `floatingScrollbar` 預設由 `false` 改為 **`true`**(依使用者要求,元件預設開啟浮空軸)。

### 橫向一律用自訂軸 + docking(依使用者)

- **隱藏原生橫軸**:`.cml-table-scroll::-webkit-scrollbar:horizontal { height: 0 }`(垂直軸仍 12px)。
- **自訂軸永遠負責橫向**:可見條件放寬為「有水平溢出 && 表格在視窗內」(不再要求表格底出視窗)。
- **docking 定位**:捲軸底緣 y = `min(表格底緣 - 2, 視窗底 - 6)` → 平常貼表格底緣(像表格自己的捲軸),
  表格底被捲出視窗下緣時改貼視窗底浮動。軌道由 `bottom` 錨改為 inline `top` 驅動。

### color prop：跟色彩角色配色(依使用者)

- `CamelotTable` 新增 `color?: CamelotColorRole`(預設 `primary`,比照其他元件)。
- root 套 `useCamelotRoleColorClass(() => props.color)` 注入 `--cml-color-current-color` 供內部繼承。
- **染色三處**:
  - 捲軸 thumb:composable barStyle 以 inline `var(--color-{role})` 上色(Teleport 至 body 拿不到 current-color 變數)。
  - 表頭底線:`headCellStyle` 以 inline `borderBottomColor: var(--color-{role})`(Tailwind `border-[color:var(...)]` arbitrary 在此設定未生成 → 改 inline)。
  - 列 hover:scoped CSS `.cml-table-scroll tbody tr:hover td.cml-row-hover { background: color-mix(... var(--cml-color-current-color) 12% ...) }`(Tailwind color-mix arbitrary 未生成 → 改 scoped CSS + 繼承變數)。
- demo 綁 `:color="currentColorRole"` 展示。

### docked/floating 雙態 + 開關語意調整(依使用者)

- **開關語意改為只控制浮動**:`floatingScrollbar` 從「是否顯示捲軸」改為「表格底出視窗時是否浮動到視窗底」。
  docked 捲軸永遠顯示(有水平溢出時),修正「關閉開關後水平捲軸消失」。
- **同一元素雙態(`<Teleport :disabled>`)**:
  - **docked**(預設 / 開關關 / 表格底在視窗內):`position: absolute` 保留在容器內,被外層 `overflow:hidden` + 圓角裁切;左右內縮 `H_INSET=8`、底內縮 `DOCK_BOTTOM=4`,不貼邊。
  - **floating**(開關開 + 表格底出視窗):`<Teleport to="body">` + `position: fixed` 於視窗底(`VIEWPORT_GAP=6`),同樣左右內縮。
  - 兩態共用同一 bar → 高度天然一致(idle scaleY(0.5)=6px)。
- composable 回傳新增 `floating`;`enabled` 參數更名 `floatingEnabled`(只影響浮動)。

### 樣式一致化 + 放大動畫(依使用者)

- **表格原生捲軸**:`.cml-table-scroll` 的 `::-webkit-scrollbar` 加粗至 12px、圓角、`on-surface-variant` 色、
  `border: 3px transparent + background-clip: padding-box` 做成浮動膠囊,與浮動軸風格一致(覆寫全域 2px 細軸)。
- **浮動軸放大動畫**:thumb 拆為父(命中區+定位 translateX)/子(視覺 bar)兩層。
  bar 固定 12px,以 `transform: scaleY(0.5↔1)` + `transition` 做放大動畫(不用 height——height transition
  在此環境的合成器量測會卡住;transform 為 compositor 友善)。淡邊 box-shadow 隨 scaleY 一起放大。
  *註:平滑過場需真實瀏覽器;預覽瀏覽器以合成器驅動 transition 時不 tick,故僅能驗證 inline 值正確翻轉。*

## Iteration(2026-07-08)— 改為自訂可拖曳 thumb

依使用者要求,浮空軸不再用原生 `::-webkit-scrollbar`(置底、無法 hover/drag 變粗),改為自訂 thumb:
- **離底部留間距**:track `position: fixed; bottom: 6px`(不貼齊視窗底,依使用者降低位置)。
- **淡邊包覆**:thumb 以 `box-shadow` 環狀淡邊包覆(隨圓角),idle `0 0 0 2px`(on-surface 10%)、
  active `0 0 0 4px`(16%)——淡邊隨 thumb 變粗一起放大。
- **自訂 thumb**:寬度 = `clientWidth/scrollWidth × trackWidth`(下限 40px),位置 = `scrollLeft` 比例;`pointer-events` 僅 thumb 可互動、track 不攔截。
- **可 hover + 拖動**:thumb `@pointerdown` 起始拖曳(setPointerCapture)、`@pointermove` 依位移換算設 `container.scrollLeft`、`@pointerup/cancel` 結束。
- **變粗**:hover(`hovered` ref via pointerenter/leave)或拖曳(`dragging`)時 `active` 為真,
  thumb 高度 `6px → 12px`、顏色加深、cursor `grab → grabbing`。
- **inline style 驅動**:height/背景/cursor 由 composable 以 inline style 給值,不依賴 scoped CSS 的
  `:hover` 或祖先 class——避免 Teleport + HMR 下 scoped 樣式 cascade 的不確定性。
- **height 不進 transition**:實測發現 height 若進 transition,拖曳期間會被持續重啟而卡在起始 6px;
  故只 `transition: background-color`,高度瞬間切換(捲軸變粗本就適合瞬變)。
- composable 回傳:`visible / trackStyle / thumbStyle / onThumbDown / onThumbMove / onThumbUp / onThumbEnter / onThumbLeave`。

## Impact Files

| 檔案 | 動作 |
| :--- | :--- |
| `app/composables/useCamelotFloatingScrollbar.ts` | 新增 composable |
| `app/components/Camelot/Table.vue` | 新增 `floatingScrollbar` prop、Teleport 代理捲軸、scoped 樣式 |
| `.playground/app/pages/index.vue` | demo 啟用 `floating-scrollbar` 示範 |
| `.kn-project/wiki/features/layout-data-components.md` | 補說明(Phase 5 歸檔) |

## Verification

- Playground 實測:表格底在視窗外且有水平溢出 → 視窗底浮現捲軸;拖動浮動軸 → 表格水平同步捲動,反之亦然;捲到表格底/表格離開視窗 → 浮動軸消失;`floatingScrollbar` 未開啟時完全不出現。
- 無 console 錯誤;元件卸載時監聽器清理(VueUse 自動解除)。

## Code Style

遵循 `kn:project:code-style`:Composition API + `ref`、prop 純型別、複雜邏輯抽 composable(SRP)、guard clause 提前回傳、去魔法值、VueUse 事件監聽自動清理。

## Git Completion Policy

- After user-approved commits, completion will run `git rebase main` and update the remote work branch with `git push --force-with-lease`.
- PR/archive order: Archive automatically triggered on PR request.

## References

- 模式別名:sticky / floating / overlay horizontal scrollbar(proxy scrollbar）
- 相關 Wiki:`.kn-project/wiki/features/layout-data-components.md`(Table)
- 前置功能:計畫 `2607081458`(Table `height` prop)

## Tasks (完成)

# Tasks for 2607081506

- [x] 研究:捲軸 utility、aqua-glass backdrop-filter 裁切問題、VueUse 可用性
- [x] 新增 `useCamelotFloatingScrollbar` composable(量測/可見性/雙向同步)
- [x] Table.vue 新增 `floatingScrollbar` prop + Teleport 代理捲軸 + scoped 樣式
- [x] playground demo 啟用示範
- [x] 驗證:浮現條件(底出視窗+有溢出)、定位對齊、雙向同步、離開視窗隱藏、無錯誤
- [x] demo 調整(依使用者):元件預設 `floatingScrollbar` 改 `true`;移除獨立長表格 demo,改回原固定高度表 + `CamelotSwitch` 開關控制;實測開關開/關切換浮空軸正確、預設開啟
- [x] iteration:浮空軸改自訂可拖曳 thumb — 離底 14px 間距、hover/拖動變粗、pointer 拖曳同步
- [x] thumb 高度/顏色/cursor 改 inline style 驅動(避開 Teleport+HMR 下 scoped CSS cascade 不確定性)
- [x] 移除 height 的 transition(避免拖曳期間持續重啟導致變粗卡在 6px);僅漸變 background
- [x] 驗證:離底 14px、idle 6px、hover/拖曳變粗 12px、拖曳同步捲動(scrollLeft 300)、放開回 6px、無錯誤
- [x] 樣式調整(依使用者):加 box-shadow 環淡邊(2px→4px 隨變粗放大)、位置離底 14px→6px;實測通過
- [x] 表格原生捲軸(`.cml-table-scroll`)加粗 12px、圓角、主題色、padding 膠囊,與浮動軸一致(覆寫全域 2px)
- [x] 放大改動畫:thumb 拆父(定位)子(視覺 bar)兩層;bar 以 `transform: scaleY(0.5→1)` + transition 放大(height transition 在預覽合成器不 tick,改 transform);淡邊隨 scaleY 一起放大
- [x] 驗證:原生捲軸 10px、離底 6px、inline transform scaleY 0.5↔1 正確翻轉、拖曳同步 300、transition 已宣告(平滑動畫需真實瀏覽器,預覽合成器不推進 transition)
- [x] iteration(依使用者):橫向一律用自訂軸;自訂軸平常貼表格底緣、表格底被捲出視窗時改浮動視窗底(docking)
- [x] 隱藏原生捲軸:依方向隱藏(`::-webkit-scrollbar:horizontal`)在此引擎無效 → 改整體隱藏(`scrollbar-width:none` + `::-webkit-scrollbar{width/height:0}`);橫向改自訂軸、縱向仍可滾輪捲動(demo 表無縱向)
- [x] 驗證:原生軸 H=0/V=0、橫向仍可捲(scrollLeft/拖曳)、貼底 trackBottom≈tableBottom、超出浮動視窗底、無錯誤
- [x] iteration(依使用者):CamelotTable 新增 `color` prop(預設 primary,比照其他元件),染色捲軸 thumb + 列 hover + 表頭底線
- [x] 實作:root 套 `useCamelotRoleColorClass`;捲軸/表頭底線用 inline `var(--color-{role})`(表頭 inline 避開 Tailwind arbitrary border-color 未生成);hover 改 scoped CSS(`.cml-row-hover`,color-mix arbitrary 不會被 Tailwind 生成);demo 綁 `:color="currentColorRole"`
- [x] 驗證:切角色時三處 inline/結構皆隨角色變(捲軸 var(--color-error/success)、表頭 border var(--color-{role})、hover scoped 規則+繼承 --cml-color-current-color);hover 為真實 scoped 規則完全可驗;表頭/捲軸 inline 值正確(實際色需真實瀏覽器,預覽對 Vue 套用的 var inline getComputedStyle 會 stale)
- [x] iteration(依使用者):開關語意改為只控制「浮動」;docked 捲軸永遠顯示(修正關閉開關後消失);同一元素以 `<Teleport :disabled>` 在 docked(容器內、圓角裁切、左右+底內縮)/floating(body fixed 視窗底)間切換
- [x] 驗證:開關 ON+底出視窗→浮動(teleport body/fixed/距底6)、開關 OFF+在視窗內→docked 仍顯示(容器內 absolute、左右內縮9/底5)、開關 OFF+底出視窗→維持 docked 不浮動;無錯誤
- [x] 修 bug:(1) hover 底色改不透明(color-mix 混 surface-container-highest,非 transparent)→ 修正固定欄位 sticky 儲存格 hover 透出底下捲動內容的重疊;(2) 垂直原生捲軸恢復——改 `overflow-x:hidden / overflow-y:auto`(只關橫向原生軸)、移除標準 `scrollbar-width/color`(現代 Chrome 會蓋掉 webkit 自訂)、保留 `::-webkit-scrollbar 12px`;加 wheel handler 補回觸控板/shift 橫向捲動
- [x] 驗證:hover 不透明、overflow-x hidden/overflow-y auto、webkit scrollbar 規則存在、wheel 橫向、自訂橫軸仍 docked+可拖曳;垂直軸實際顯示需真實瀏覽器(預覽 overlay 捲軸 reserve 0 量不到)

# Plan: 2608121429 - overlay-nested-popup-demos

- Created: 2026-08-12
- Branch: fix/2608121429-overlay-nested-popup-demos
- Issue: KNightING/camelot-nuxt-layer#21
- Status: In Progress
- Completed: [Wait for Finish]

## Goals

在主畫面的 scoped Dialog / Sheet 範例中補上 **DatePicker** 與 **原生 PopupV2** 範例，用來驗證它們在 Dialog / Sheet 內是否有與 SelectV2 相同的浮層問題（點擊誤判關閉、被面板蓋住、定位失效）。

目的**不只是加範例，而是把「浮層在 overlay 內可用」變成看得見的常駐檢查點** —— 上一輪的缺陷正是因為範例迴避了預設值（`:close-by-mask="false"`）才長期沒被發現。

## Architecture

### Phase 0 掃描結論（尚未實測，待 Phase 3 驗證）

`DateV2` / `DateRangeV2` / `TimeV2` / `SelectV2` **共用同一個浮層底層** `CamelotPopupV2`：

| 元件 | 浮層來源 | 傳給 PopupV2 的 zIndex |
| :--- | :--- | :--- |
| `SelectV2:17` | `CamelotPopupV2` | `zIndex`（無預設 → `undefined`） |
| `DateV2:22`、`DateRangeV2:22`、`TimeV2:22` | `CamelotPopupV2` | `selectZIndex`（`DateV2:193` 無預設 → `undefined`） |

因此上一輪加在 `PopupV2` 的兩項修正（`data-camelot-popup` 標記、預設層級 `var(--cml-z-popup)`）**理應已自動涵蓋日期與時間選擇器** —— `undefined` 會落到 `?? var(--cml-z-popup)`。**預期結果是三者皆正常**，但這是推論不是佐證，本計畫的重點就是把它實測出來。

### 兩個尚未被涵蓋的風險（本次要一併驗證）

**R1. DateV2 的 dialog 模式是巢狀 `<dialog>`，走的是完全不同的程式路徑**

`DateV2:343-349` 的 `showType` 預設為 `'auto'`：桌機用 `popup`、**手機改用 `dialog`**（`DateV2:57` 渲染一個內層 `CamelotBaseDialogV2`）。在已開啟的 Dialog / Sheet 內再開一個 `<dialog>` 並呼叫 `showModal()`，涉及 top layer 疊加、backdrop 疊加、以及外層 `onDialogClick` 與內層遮罩判定的互相干擾 —— 這條路徑**不受 `data-camelot-popup` 修正保護**，需獨立驗證。

**R2. `CascadeMenu` 的預設 zIndex 低於 sheet**

`CascadeMenu.vue:43` 預設 `zIndex: 50`，而 `--cml-z-sheet` 為 `60`。它不經由 PopupV2 的預設值取得層級，因此若放進 BottomSheet 內會被面板蓋住。此為掃描時發現的既有缺陷，處置見 Q2。

### 作法

範例加在 `.playground/app/components/OverlaySharedFields.vue` —— 該元件**同時被 scoped Dialog 與 scoped Sheet 引用**，一處修改即可讓兩種 overlay 都獲得相同的檢查點，不需要寫兩份。

新增三個控制項：
- `CamelotDateV2`（明確 `show-type="popup"`）—— 驗證日期浮層
- `CamelotDateV2`（明確 `show-type="dialog"`）—— 驗證 R1 的巢狀 dialog 路徑
- `CamelotPopupV2` —— 驗證未經任何包裝的原生浮層

## Cross-Repo Scope

- **本計畫所屬 repo**: `camelot-nuxt-layer`
- **共用計畫 ID**: `2608121429-overlay-nested-popup-demos`　**共用分支名**: `fix/2608121429-overlay-nested-popup-demos`
- 無（單一 repo）

## Impact Files

- `.playground/app/components/OverlaySharedFields.vue:1-30`（template 內容區）— 新增三個浮層範例；此元件同時被 scoped Dialog 與 Sheet 引用，一處即涵蓋兩者。
- `.playground/app/components/OverlaySharedFields.vue:33-42`（script）— 新增日期值的 `defineModel` 或本地 ref。
- `.playground/app/pages/index.vue:1740` 附近（`overlaySharedCount` / `overlaySharedOption` 宣告處）— 若日期值要納入共通值展示，於此新增 ref 並傳入。
- `app/components/Camelot/CascadeMenu.vue:43`（`zIndex: 50`）— 依 Q2 決定是否改為引用疊層刻度。

> 本計畫預期**不修改**任何 overlay 元件，除非驗證真的測出問題（見 Q3）。

## Open Questions / 待確認事項

### Q1. DateV2 要展示哪些 `showType` — 影響範圍：`.playground/app/components/OverlaySharedFields.vue`
`auto` 在桌機等同 `popup`，測不到巢狀 dialog 路徑（R1）。

- [x] 選項 A：同時放 `show-type="popup"` 與 `show-type="dialog"` 兩顆　(建議，理由：R1 的巢狀 dialog 是唯一不受既有修正保護的路徑，不明確指定就永遠測不到)
- [ ] 選項 B：只放一顆 `auto`，貼近實際使用
- [ ] 選項 C：其他，請補充
- **決議**：選項 A　狀態：✅ 已確認

### Q2. `CascadeMenu` 的 `zIndex: 50` 是否本次一併修 — 影響範圍：`app/components/Camelot/CascadeMenu.vue:43`
它低於 `--cml-z-sheet: 60`，放進 Sheet 內會被面板蓋住。屬掃描時順帶發現，非使用者回報。

- [x] 選項 A：一併改為引用疊層刻度，並在範例中加入 CascadeMenu 以驗證　(建議，理由：與本次「檢查浮層在 overlay 內是否可用」是同一件事，且修法與上一輪一致、風險低)
- [ ] 選項 B：本次只驗證 DatePicker 與 Popup，CascadeMenu 另開計畫
- [ ] 選項 C：其他，請補充
- **決議**：選項 A　狀態：✅ 已確認

### Q4. 兩個違反「以 PopupV2 為基底」原則的元件如何處置 — 影響範圍：`app/components/Camelot/Internal/TimeField.vue`、`Internal/CascadeMenuPanel.vue`
掃描發現（詳見 Key Decisions）。改用 PopupV2 為基底屬結構性重構，與「補範例驗證」不同量級。

- [x] 選項 A：本計畫只用範例把問題測出來並記錄，重構另開計畫　(建議，理由：重構會改動兩個元件的定位與生命週期，混進展示頁的變更會讓 diff 與驗證失焦)
- [ ] 選項 B：本計畫一併重構
- [ ] 選項 C：僅先修 `CascadeMenuPanel` 的層級（低風險），`TimeField` 的重構另開
- **決議**：選項 A（採建議值；使用者核准的計畫已將該兩元件排除於 Impact Files 外）　狀態：✅ 已確認

### Q3. 若驗證測出問題，是否授權在本計畫內一併修正 — 影響範圍：`app/components/Camelot/` overlay 群
比照上一輪的處理方式。

- [x] 選項 A：授權一併修，但修正一律做在元件預設行為上，且動工前先向我說明成因與修法　(建議，理由：測出問題卻只留一個壞掉的範例，等於把缺陷寫進展示頁)
- [ ] 選項 B：只回報不修，另開計畫
- [ ] 選項 C：其他，請補充
- **決議**：選項 A　狀態：✅ 已確認

### 驗證結果（Dialog 內實測，viewport 1280×800）

| 浮層 | 結果 | 佐證 |
| :--- | :--- | :--- |
| `SelectV2` | ✅ 正常 | teleport 進 dialog、`z: 70`、選取後 dialog 不關 |
| `DateV2`（popup 模式） | ✅ 正常 | 日曆 `inDialog: true`、`z: 70`、點日期後 dialog 不關 |
| 原生 `PopupV2` | ✅ 正常 | `inDialog: true`、`z: 70` |
| `TimeV2` 外層 popup | ✅ 正常 | `inDialog: true`、`z: 70` |
| **`TimeV2` 內層時分秒清單** | ❌ **不可見/不可點** | `Internal/TimeField.vue` `Teleport to="body"`；實測 `parentIsBody: true`、`inDialog: false`、`z: 1000`，hit-test 命中對話框內容而非清單 |
| **`CascadeMenu`** | ❌ **不可見/不可點** | `Internal/CascadeMenuPanel.vue:2` `Teleport to="body"`；實測 `parentIsBody: true`、`z: 50`，hit-test 命中對話框內的 `<p>` |
| **`DateV2`（dialog 模式・巢狀）** | ❌ **選日期會關掉外層 Dialog** | 巢狀 dialog 本身可見可點（`insideInner: true`），但選取後 `openCount: 2 → 1`、`outerStillOpen: false` |

**Q2 的前提被推翻**：`CascadeMenu` 的問題**不是** z-index 太低，而是 `Teleport to="body"` 讓面板落在 `<dialog>` top layer **之下** —— 把 `50` 改成 `70` 不會有任何效果，那會是個看起來有修、實際沒修的假修正。因此**不執行 Q2 原訂的 z-index 改動**。

**R1 的推測成因**：巢狀 dialog 以 `v-if="open"` 渲染，選取日期後內層 `<dialog>` 立即從 DOM 移除；外層 `onDialogClick`（`@pointerup`）稍後執行時，事件 target 已是脫離文件的節點，`contentBox.contains(target)` 回傳 `false` → 被判定為「點在內容之外」→ 關閉外層。`data-camelot-popup` 標記保護不到這條路徑，因為標記在 PopupV2 的容器上，巢狀 dialog 沒有。

### 處置（使用者裁示）

- **本計畫只修 R1**（巢狀 dialog 選取後關掉外層）—— 小修，在 `onDialogClick` 加上「target 已脫離文件就不視為點遮罩」的判斷。
- **保留五個浮層範例作為常駐檢查點**，讓 TimeField / CascadeMenu 的問題在展示頁上是看得見的。
- `CascadeMenuPanel` 與 `TimeField` 改以 PopupV2 為基底、以及 PopupV2 的 teleport 目標改為「最近的 scope root」，**各自另開計畫**。

## Key Decisions

- **[Q1]** DateV2 同時展示 `show-type="popup"` 與 `show-type="dialog"` — 理由：`auto` 在桌機等同 popup，不明確指定就測不到 R1 的巢狀 dialog 路徑。
- **[Q2]** `CascadeMenu` 的 `zIndex: 50` 一併改為引用疊層刻度並加入範例驗證 — 理由：與本次「檢查浮層在 overlay 內是否可用」是同一件事，修法與上一輪一致、風險低。
- **[Q4]** 兩個違反原則的元件本計畫不重構，僅以範例把問題測出來並記錄 — 理由：重構會改動定位與生命週期，混進展示頁變更會讓 diff 與驗證失焦。
- **[Q3]** 授權於本計畫內一併修正驗證測出的問題，但修正一律做在元件預設行為上，且動工前先向使用者說明成因與修法。
- **[使用者提出／架構原則]** **popup 概念的 UI 一律應以 `PopupV2` 為基底。** 掃描確認兩個元件違反：
    - `Internal/TimeField.vue:19-23` 以 `Teleport to="body"` + `fixed z-[1000]` 自行實作。**這正是 PopupV2 存在的理由所要避開的反模式** —— `<dialog>` 的 top layer 在 body 之上，z-index 再高也蓋不過，故 TimeV2 / DateV2(enableTime) 的內層時分秒選單在 Dialog 內很可能完全不可見。
    - `Internal/CascadeMenuPanel.vue:183-199` 自算 `top`/`left` 與 `zIndex: baseZIndex + level`（base 50，低於 `--cml-z-sheet: 60`）。
    - 其餘含 `fixed`/`z-index` 的元件不屬 popup 概念（Drawer 側邊面板、Toast 通知堆疊、Loading 全螢幕遮罩、Carousel 內部層序、BaseBottomSheetV2 面板本身、ResizableImageView 編輯器控制點），不在此原則範圍。
    - **改用 PopupV2 為基底屬結構性重構，超出本計畫範圍**；本計畫先以範例把問題實測出來，重構另行請示（見 Q4）。

## Git Completion Policy

- PR body 必須含 `Closes #${N}`（取自上方 `- Issue:`），歸檔後於該 issue 張貼由 archive 蒸餾的結案留言 (Rule 20)。
- 經核准的 Commit 後，完成階段會執行 `git rebase main` 與 `git push --force-with-lease --force-if-includes`（`main` 由 `refs/remotes/origin/HEAD` 判定）。
- PR/archive order: Archive automatically triggered on PR request
- 無（單一 repo），本 repo 自行開 PR。

## References

- `.kn-project/archive/2608121105-overlay-demos-into-index.md` — 上一輪的兩個浮層缺陷與修法
- `.kn-project/wiki/features/layering.md` — 疊層刻度與「為何 popup 必須高於 sheet」
- `.kn-project/wiki/components/PopupV2.md`、`BaseDialogV2.md`、`BaseBottomSheetV2.md`、`DateV2.md`

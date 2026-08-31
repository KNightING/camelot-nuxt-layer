# Plan: 2608311144 - shared-types-dom-decoupling
- Created: 2026-08-31
- Branch: fix/2608311144-shared-types-dom-decoupling
- Issue: KNightING/camelot-nuxt-layer#35
- Status: In Progress
- Completed: [Wait for Finish]

## Goals
1. 讓 `shared/` 內的型別完全不依賴 DOM lib，消除消費端專案 type check 出現 `Cannot find name 'HTMLElement'` 的根因。
2. 為本 layer 補上 `typecheck` script，讓型別回歸能在本 repo 被 lint/CI 擋下。
3.（Q3 改判後追加）將 `nuxt typecheck` 的 43 個錯誤與 `eslint` 的 24 個問題全數清零，使兩者皆可作為 CI 門檻。

## Architecture

### 問題本質
Nuxt 4 為 `shared/` 產生獨立的 TS project（`.playground/.nuxt/tsconfig.shared.json`），其 `compilerOptions` 為
`target: ESNext`、`types: []`、**未指定 `lib`** — 這是刻意設計，因為 `shared/` 同時被 client 與 Nitro server 匯入，不應假設有 DOM。
該 project 的 `include` 同時涵蓋 `../../shared/**/*`，也就是**本 layer 的 `shared/` 會被消費端的 shared project 一起編譯**，
因此錯誤在消費端而非本 repo 浮現。

### 反直覺的既有事實（Code Evidence）
本 repo 目前執行 `vue-tsc -p .playground/.nuxt/tsconfig.shared.json` **不會報錯**。
以 `tsc --listFiles` 驗證，`lib.dom.d.ts` 是被相依套件的 `/// <reference lib="dom" />` **間接拉進來**的（非本專案設定）。
換言之本 repo 是「碰巧通過」，消費端的相依圖不同就會失敗。
**推論**：本次修正屬於結構性解耦，新增的 `typecheck` script **無法**證明此特定回歸已消失（修正前後都會通過）；
它的價值在於擋下一般型別回歸，而非這一條。此事實已於下方 `### Q5. 第三方型別契約不合（tiptap `NodeViewProps`、undici `Dispatcher`）如何處理？ — 影響範圍：`app/components/Camelot/Internal/editor/`、`app/composables/useBaseApi.ts`
- [x] 選項 A：先逐條追查是否為版本落差或用法錯誤，能真修就真修；確定是上游型別缺陷才加 `as` 斷言，並依 code-style 於上一行註明理由與出處　(建議)
- [ ] 選項 B：一律以附註解的斷言帶過
- [ ] 選項 C：優先升級套件版本
- **決議**：選項 A　狀態：✅ 已確認

### Q6. 全綠的範圍是否含 `.playground/`？ — 影響範圍：`.playground/app/`
`.playground/` 是 layer 的示範消費端，`eslint .` 與 `nuxt typecheck` 皆已涵蓋它（24 個 lint 問題中有 16 個在此）。
- [x] 選項 A：一併修到全綠　(建議，理由：兩個指令的預設範圍就含它，留紅等於門檻無法啟用)
- **決議**：選項 A　狀態：✅ 已確認

### Q7. `CamelotCascadeMenu` 的 `closeDelay` 從未被實作，如何處理？ — 影響範圍：`app/components/Camelot/Internal/CascadeMenuPanel.vue`
Phase 4 追查 `no-unassigned-vars` 時發現：`closeTimer` 宣告後從未賦值，`ctx.closeDelay` 全 repo 零讀取，
panel 只有 `@mouseenter` 而無任何 `mouseleave` — 公開 prop `closeDelay`（預設 160ms）實際上完全無作用。
- [x] 選項 A：實作 hover 收合延遲（補 `mouseleave`，以 `closeTimer` + `ctx.closeDelay` 延遲收合，滑回子選單則取消）　(使用者決議)
- [ ] 選項 B：移除死碼、保留 prop 並標註「尚未實作」
- [ ] 選項 C：移除死碼並拿掉 prop（breaking change）
- [ ] 選項 D：另開計畫
- **決議**：選項 A　狀態：✅ 已確認

## Key Decisions` 留存。

### 解法（方法 1：依執行環境歸位）
- `CamelotCascadeMenuItem` — 純資料契約，client/server 皆可用 → **留在 `shared/`**。
- `CamelotCascadeMenuContext` — provide/inject 的浮層控制上下文，帶 `HTMLElement`，本質 client-only → **移至 `app/types/`**。
- `CAMELOT_CASCADE_MENU_KEY` — 僅供上述 context 的 inject key 使用 → 隨 context 一併移動（見 Q1）。

### 自動匯入可行性（已驗證）
`nuxt.config.ts` 的 `imports.dirs` 含 `join(currentDir, '/app/**')`，且 `.playground/.nuxt/imports.d.ts` 證實
`app/composables/*` 匯出的**型別**（如 `AnchorLinkOptions`、`CamelotToastOptions`）確實被自動匯入，
故 `app/types/` 內的型別預期同樣可被自動匯入，元件不需新增 import 敘述。
執行時仍須以 `nuxt prepare` 重新產生 `imports.d.ts` 實測確認；若未被掃描，再於 `imports.dirs` 補 `join(currentDir, '/app/types/**')`。

## Cross-Repo Scope
- **本計畫所屬 repo**: `camelot-nuxt-layer`
- 無（單一 repo）。

## Impact Files
- `shared/types/cascadeMenu.ts:41` (`registerPanel`)、`:43` (`unregisterPanel`) — 全 `shared/` 僅此兩行使用 DOM 型別 `HTMLElement`（已以 Grep 掃過 `shared/` 全域確認）；需將所屬的 `CamelotCascadeMenuContext` 介面移出。
- `shared/types/cascadeMenu.ts:46` (`CAMELOT_CASCADE_MENU_KEY`) — inject key，依 Q1 決議決定是否隨 context 移動。
- `app/types/cascadeMenu.ts` (new) — 承接 client-only 的 `CamelotCascadeMenuContext`（與 Q1 決議的 key）。
- `app/components/Camelot/CascadeMenu.vue:81` (`provide<CamelotCascadeMenuContext>`) — 驗證自動匯入仍解析得到型別；預期無需改動原始碼。
- `app/components/Camelot/Internal/CascadeMenuPanel.vue:75` (`inject<CamelotCascadeMenuContext>`) — 同上。
- `package.json` (`scripts`) — 新增 `typecheck`；`vue-tsc@^3.3.9` 與 `typescript@6.0.3` 已在 devDependencies，無需新增相依。
- `app/middleware/00.replacePath.ts` → `app/middleware/$00.replacePath.ts` — 依 Q4 決議一併帶入；工作區既有的未提交更名，已比對兩者內容完全相同（純檔名變更，無邏輯差異），將以獨立 commit 提交以免混淆本計畫的主體 diff。
- `nuxt.config.ts:66` (`imports.dirs`) — **條件性**：僅在實測發現 `app/types/` 未被自動匯入掃描時才補一條路徑。

### 迭代追加：全綠所需檔案（依實際錯誤輸出，非推測）
**TypeScript（43）**
- `i18n/i18n.config.ts:5-12` 與 `.playground` 對應複本（10）— locale 字面值 `'zh'`/`'en'` 不在 `@nuxtjs/i18n` 產生的 locale 聯集內
- `app/composables/useColor.ts:25,30,59,72,95-97`（9）— `noUncheckedIndexedAccess` 下的索引存取未收窄
- `app/composables/useValueValidation.ts:73,81,83,111,112`（5）— 同上家族
- `app/components/Camelot/Internal/editor/ResizableImageView.vue:18,19,259-262,268`（7）+ `resizable-image.ts:67`（1）+ `RichTextEditor.vue:328`（1）— tiptap `Node.attrs` / `NodeViewProps` / `SetImageOptions` 契約不合（依 Q5 處理）
- `app/composables/useBaseApi.ts:353,361`（2）— undici `Dispatcher`、`RequestCache` 與 `ComputedOptions` 不相容（依 Q5 處理）
- `app/composables/useCustomColorScheme.ts:142`（1）— 泛型 `Partial<T>` 指派不成立
- `app/composables/useCamelotOverlayScrollbar.ts:22`（1）— `ShallowRef` 名稱未解析
- `app/components/Camelot/Internal/TreeNode.vue:68`（1）— `scope` 循環推導 `any`
- `app/components/Camelot/ConfirmDialog.vue:109`（1）— `CamelotConfirmAction` 未對 overload 收窄
- `app/components/Camelot/Input.vue:462`（1）— template ref 型別缺 `input`
- `.playground/app/pages/index.vue`（3）

**ESLint（24；17 項 `--fix` 可自動修）**
- 格式類（`object-property-newline` 13、`object-curly-newline` 4、`vue/max-attributes-per-line` 1）— `.playground/app/pages/index.vue`、`page/[code].vue`、`page/end.vue`、`Header.vue`、`app/composables/useInfinitePage.ts:19`、`app/router.options.ts:24,28`
- `app/components/Camelot/Internal/CascadeMenuPanel.vue:99`（`closeTimer`）、`:39`（`@mouseenter`）、`:118`（`onRowEnter`）— `no-unassigned-vars` 追查證實 `closeDelay` 從未實作（`ctx.closeDelay` 零讀取、無 `mouseleave`），依 Q7 補實作
- `app/composables/useScrollOnBottom.ts:33-35` — `no-useless-assignment`×3，同樣需確認是否為漏用變數的缺陷
- `app/components/Camelot/RichTextEditor.vue:446` — `preserve-caught-error`：重拋時未帶 `cause`
- `.playground/app/layouts/defualt.vue:2` — `vue/no-multiple-template-root`

## Open Questions / 待確認事項

### Q1. `CAMELOT_CASCADE_MENU_KEY` 是否隨 context 一併移到 `app/types/`？ — 影響範圍：`shared/types/cascadeMenu.ts`、`app/types/cascadeMenu.ts`
- [x] 選項 A：key 與 context 一起移到 `app/types/`，`shared/` 只留純資料型別 `CamelotCascadeMenuItem`　(建議，理由：key 的唯一用途就是注入該 context，兩者同進退語意才一致；且能讓 `shared/` 的職責收斂成「跨環境資料契約」)
- [ ] 選項 B：只移 context，key 留在 `shared/`　(理由：改動面最小，但 key 與其型別分居兩處，語意割裂)
- **決議**：選項 A　狀態：✅ 已確認

### Q2. `typecheck` script 的形態？ — 影響範圍：`package.json`
- [x] 選項 A：`"typecheck": "nuxt typecheck .playground"`　(建議，理由：Nuxt 官方入口，會涵蓋 app／server／shared 全部 TS project，與 `dev`/`build` 的 `.playground` 慣例一致)
- [ ] 選項 B：直接呼叫 `vue-tsc --noEmit -p .playground/.nuxt/tsconfig.shared.json`（只驗 shared）　(理由：快，但只涵蓋一小塊，其餘回歸擋不住)
- **決議**：選項 A　狀態：✅ 已確認

### Q3. 若 `nuxt typecheck` 在既有程式碼上就先報出一批 pre-existing 錯誤，如何處理？ — 影響範圍：全 repo
- [ ] 選項 A：本計畫只負責「加入 script + 修好本次的 shared/DOM 解耦」，pre-existing 錯誤清單如實回報，另開計畫處理　(建議，理由：避免單一計畫無界擴張；也讓使用者能自行決定投入)
- [x] 選項 B：本計畫一併修到全綠　(理由：CI 可立刻啟用，但範圍不可預估)
- **決議**：**改判為選項 B**（2026-08-31 迭代）　狀態：✅ 已確認

### Q4. 工作區目前不乾淨（與本計畫無關），如何處置？ — 影響範圍：`app/middleware/`
現況：`app/middleware/00.replacePath.ts` 被刪除、`app/middleware/$00.replacePath.ts` 為未追蹤新檔，
已比對兩者**內容完全相同**，屬於一次未提交的純檔名更名。依 Rule 9 禁止自動 stash／commit／強制切換分支。
- [ ] 選項 A：先 `git stash -u` 保留，本計畫完成後再取回　(建議，理由：讓 fix 分支的 diff 純淨，這次更名與本計畫無任何關聯)
- [x] 選項 B：把這次更名一併帶進本計畫的分支並隨附提交
- [ ] 選項 C：使用者自行處理後再通知繼續
- **決議**：選項 B　狀態：✅ 已確認

### Q5. 第三方型別契約不合（tiptap `NodeViewProps`、undici `Dispatcher`）如何處理？ — 影響範圍：`app/components/Camelot/Internal/editor/`、`app/composables/useBaseApi.ts`
- [x] 選項 A：先逐條追查是否為版本落差或用法錯誤，能真修就真修；確定是上游型別缺陷才加 `as` 斷言，並依 code-style 於上一行註明理由與出處　(建議)
- [ ] 選項 B：一律以附註解的斷言帶過
- [ ] 選項 C：優先升級套件版本
- **決議**：選項 A　狀態：✅ 已確認

### Q6. 全綠的範圍是否含 `.playground/`？ — 影響範圍：`.playground/app/`
`.playground/` 是 layer 的示範消費端，`eslint .` 與 `nuxt typecheck` 皆已涵蓋它（24 個 lint 問題中有 16 個在此）。
- [x] 選項 A：一併修到全綠　(建議，理由：兩個指令的預設範圍就含它，留紅等於門檻無法啟用)
- **決議**：選項 A　狀態：✅ 已確認

### Q7. `CamelotCascadeMenu` 的 `closeDelay` 從未被實作，如何處理？ — 影響範圍：`app/components/Camelot/Internal/CascadeMenuPanel.vue`
Phase 4 追查 `no-unassigned-vars` 時發現：`closeTimer` 宣告後從未賦值，`ctx.closeDelay` 全 repo 零讀取，
panel 只有 `@mouseenter` 而無任何 `mouseleave` — 公開 prop `closeDelay`（預設 160ms）實際上完全無作用。
- [x] 選項 A：實作 hover 收合延遲（補 `mouseleave`，以 `closeTimer` + `ctx.closeDelay` 延遲收合，滑回子選單則取消）　(使用者決議)
- [ ] 選項 B：移除死碼、保留 prop 並標註「尚未實作」
- [ ] 選項 C：移除死碼並拿掉 prop（breaking change）
- [ ] 選項 D：另開計畫
- **決議**：選項 A　狀態：✅ 已確認

## Key Decisions
- **[Q1]** `CAMELOT_CASCADE_MENU_KEY` 隨 `CamelotCascadeMenuContext` 一併移至 `app/types/cascadeMenu.ts` — 理由：key 的唯一用途是注入該 context，同進退才語意一致；`shared/` 職責收斂為「跨環境資料契約」。
- **[Q2]** `typecheck` script 採用 `nuxt typecheck .playground` — 理由：Nuxt 官方入口，涵蓋 app／server／shared 全部 TS project，與既有 `dev`/`build` 的 `.playground` 慣例一致。
- **[Q3]** 本計畫僅負責 shared/DOM 解耦與加入 script；`nuxt typecheck` 若揭露 pre-existing 錯誤只如實回報、另開計畫 — 理由：避免單一計畫無界擴張，投入與否交由使用者決定。
- **[Q4]** 既有未提交的 middleware 更名一併帶入本計畫分支並隨附提交 — 理由：使用者決議；該更名內容經比對與原檔完全相同，屬純檔名變更。
- **[執行中]** 型別新家採 `app/types/`，未採 code-style 技能建議的 `app/models/` — 理由：本 repo 既有慣例一律是 `types/`（`shared/types/`、根目錄 `types/`），全 repo 無任何 `models/` 目錄；通用鐵則第 1 條「貼合既有風格」在此優先。
- **[執行中]** `app/types/` 的型別確認可被自動匯入，`nuxt.config.ts` 未更動 — 理由：`imports.dirs` 既有的 `app/**` 已涵蓋；`nuxt prepare` 後 `imports.d.ts:106` 實測收錄 `CAMELOT_CASCADE_MENU_KEY` 與 `CamelotCascadeMenuContext`，故 Impact Files 中該條件性項目不成立。
- **[執行中]** `nuxt typecheck` 揭露 43 個 pre-existing 錯誤，依 Q3 決議不在本計畫處理 — 理由：零筆與 CascadeMenu 相關，證明本次搬移未引入新錯誤；清單另開計畫。此狀態下 `typecheck` 尚不可直接接入 CI 門檻。
- **[Q7]** 實作 CascadeMenu 的 hover 收合延遲，而非刪除死碼 — 理由：`closeDelay` 是已對外公開的 prop（預設 160ms）且有文件註解，刪死碼等於把「功能沒做」固化成不生效的 API；一併修正「滑出選單不會收合」的行為缺口。由 Phase 4 的 `no-unassigned-vars` 追查而來。
- **[Q3 改判]** 使用者要求 `nuxt typecheck` 與 `eslint` 全綠，Q3 由選項 A 改判為 B，以 Iteration 併入本計畫（同分支、同 issue、同 PR）— 理由：使用者明示；同時記錄此改判使本計畫範圍由 5 個檔案擴大到 20+ 個檔案。
- **[Q5]** 第三方型別衝突先追真因，確定是上游缺陷才加附理由的 `as` 斷言 — 理由：直接斷言會掩蓋真正的用法錯誤，違背 code-style「收窄優先於斷言」。
- **[Q6]** 全綠範圍含 `.playground/` — 理由：`eslint .` 與 `nuxt typecheck .playground` 的預設範圍本就涵蓋它，留紅則 CI 門檻無法啟用。
- **[Phase 0 佐證]** 本 repo 現行 shared type check 會通過，`lib.dom.d.ts` 是經相依套件的 `/// <reference lib="dom" />` 間接載入 — 理由：以 `tsc --listFiles -p .playground/.nuxt/tsconfig.shared.json` 實測確認；因此新增的 `typecheck` script 無法覆蓋本次這條特定回歸，記於此避免日後誤以為已有防護。

## Git Completion Policy
- PR body 必須含 `Closes #${N}`（`${N}` 取自上方 `- Issue:`），歸檔後於該 issue 張貼由 archive 蒸餾的結案留言 (Rule 20)。
- 經核准的 Commit 後，完成前會執行 `git rebase main` 與 `git push --force-with-lease --force-if-includes`（`main` 由 `refs/remotes/origin/HEAD` 判定）。
- PR/archive order: Archive automatically triggered on PR request。
- 單一 repo，無跨 repo PR。

## References
- `.kn-project/archive/2606111326-cascade-popup-menu.md` — CascadeMenu 元件的原始建置計畫。
- `.kn-project/wiki/features/layering.md` — `--cml-z-popup` 疊層刻度，`CamelotCascadeMenuContext.baseZIndex` 的註解引用來源。

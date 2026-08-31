# 2608311144 - shared-types-dom-decoupling

- Created: 2026-08-31 11:44 / Archived: 2026-08-31 14:40
- Issue: KNightING/camelot-nuxt-layer#35

## Summary
把 `shared/` 內僅供瀏覽器端使用的 CascadeMenu 型別移到 `app/`，消除消費端專案 type check 的 `Cannot find name 'HTMLElement'`，並讓 `nuxt typecheck` 與 `eslint` 兩道門檻由 43／24 個錯誤降到全綠。
起因是 Nuxt 4 為 `shared/` 產生的 TS project 刻意不載入 DOM lib（該目錄同時供 Nitro server 使用），而其 `include` 涵蓋 layer 的 `shared/`，因此錯誤只在消費端浮現。
沿著 lint 與型別錯誤追查時，另外發現三個**已公開但實際無作用**的 API：CascadeMenu 的 `closeDelay`、`CamelotInput` 的 `inputEl`、以及指向未註冊語系的 i18n fallback 鏈；三者皆一併修復並於瀏覽器實測。
影響範圍涵蓋 `shared/types/`、`app/types/`、CascadeMenu／Input／VirtualScroll／TreeNode／RichTextEditor 等元件、`useColor` 等六個 composable，以及兩份 i18n config。

## Cross-Repo Scope
無（單一 repo）。

## Key Decisions
- **[Q1]** `CAMELOT_CASCADE_MENU_KEY` 隨 `CamelotCascadeMenuContext` 一併移至 `app/types/cascadeMenu.ts` — 理由：key 的唯一用途是注入該 context，同進退才語意一致；`shared/` 職責收斂為「跨環境資料契約」。
- **[Q2]** `typecheck` script 採用 `nuxt typecheck .playground` — 理由：涵蓋 app／server／shared 全部 TS project，與既有 `dev`/`build` 慣例一致。
- **[Q3 改判]** 原訂只加 script、pre-existing 錯誤另開計畫，經使用者要求改為本計畫一併修到全綠 — 理由：使用者明示；此改判使範圍由 5 個檔案擴大到 20+ 個檔案。
- **[Q4]** 工作區既有的未提交 middleware 更名一併帶入本分支，以獨立 commit 提交 — 理由：使用者決議；內容經比對與原檔完全相同。
- **[Q5]** 第三方型別衝突先追真因，確定是上游缺陷才加附理由的 `as` 斷言 — 理由：直接斷言會掩蓋真正的用法錯誤，違背「收窄優先於斷言」。實際成效：43 項中 41 項追出可真修的根因，僅 2 處使用斷言。
- **[Q6]** 全綠範圍含 `.playground/` — 理由：兩個指令的預設範圍本就涵蓋它，留紅則 CI 門檻無法啟用。
- **[Q7]** 實作 CascadeMenu 的 hover 收合延遲，而非刪除死碼 — 理由：`closeDelay` 是已對外公開的 prop（預設 160ms）且有文件註解，刪死碼等於把「功能沒做」固化成不生效的 API。
- **[Q8]** 移除指向未註冊語系（`zh`／`en`）的 fallback 目標，而非補註冊 — 理由：layer 宣告 `locales: []`，本就不該替消費端決定 fallback 落點。layer 的 `zh.json`／`en.json` 保留：以 `zh`／`en` 為 locale code 的消費端仍會取用。
- **[Q9]** 接通 `CamelotInput.inputEl` 而非刪除 — 理由：它是該元件唯一對外暴露項，刪除等於拿掉整個 imperative API。與 Q7 同一判準。
- **[執行中]** 型別新家採 `app/types/` 而非 code-style 建議的 `app/models/` — 理由：本 repo 既有慣例一律是 `types/`（`shared/types/`、根目錄 `types/`），全 repo 無任何 `models/` 目錄。
- **[執行中]** `app/types/` 的型別確認可被自動匯入，`nuxt.config.ts` 未更動 — 理由：`imports.dirs` 既有的 `app/**` 已涵蓋，`nuxt prepare` 後 `imports.d.ts` 實測收錄。
- **[Phase 0 佐證]** 本 repo 的 shared type check 修改前即通過，`lib.dom.d.ts` 是經相依套件的 `/// <reference lib="dom" />` 間接載入 — 理由：`tsc --listFiles` 實測確認。**因此新增的 `typecheck` script 無法覆蓋本次這條特定回歸**，記此避免日後誤以為已有防護。

## Deviations
- Q3 中途改判（另開計畫 → 併入本計畫），使計畫由 3 個 Phase 擴增為 7 個。
- 計畫階段未預期的三個真缺陷（Q7 `closeDelay`、Q8 i18n fallback、Q9 `inputEl`）皆由 lint／型別錯誤追查衍生，經使用者逐項拍板後納入。
- `.playground/app/layouts/defualt.vue` 檔名拼錯（`defualt`）已發現但**未處理**：更名會影響 layout 解析，超出本計畫範圍，留待另開。

## Impact Files
- `shared/types/cascadeMenu.ts` — 移除 `CamelotCascadeMenuContext` 與 `CAMELOT_CASCADE_MENU_KEY`，僅保留純資料契約 `CamelotCascadeMenuItem`（原 `:41`／`:43` 的 `HTMLElement` 是全 `shared/` 唯一的 DOM 型別引用）。
- `app/types/cascadeMenu.ts` (new) — 承接上述 client-only 型別，另新增 `CamelotCascadeMenuPanelParent` 供逐層收合控制。
- `app/components/Camelot/Internal/CascadeMenuPanel.vue:99` — 實作 hover 收合延遲：面板補 `@mouseenter`/`@mouseleave`，逐層 provide/inject 讓子面板反向取消祖先鏈的待收合（子面板 Teleport 至 body，DOM 上並非父面板後代）。
- `app/components/Camelot/Input.vue:462` — `inputEl` 改由當前主題子元件轉接。
- `app/components/Camelot/{Material,Aqua,Cupertino,Scifi}/Input.vue` — 各自 `defineExpose({ inputEl })`。
- `app/components/Camelot/VirtualScroll.vue:19` — slot 改綁型別守衛過濾後的 index/item 配對，避免消費端的 `item` 帶 undefined。
- `app/components/Camelot/Internal/TreeNode.vue:68` — 補 `defineSlots`，解遞迴轉傳造成的循環推導。
- `app/components/Camelot/ConfirmDialog.vue:109` — 聯集逐一收窄成字面值後才能分派給 `defineEmits` 的多載簽章。
- `app/components/Camelot/Internal/editor/ResizableImageView.vue:249` — 改用 tiptap 的 `NodeViewProps`；原本的 `node` 誤取自 `@tiptap/core` 的 `Node`（Extension 定義類別，非 ProseMirror 文件節點），且 props 為手寫、缺 `decorations`／`view`／`getPos` 等 6 個屬性。此一改動同時解掉 9 項錯誤。
- `app/components/Camelot/Internal/editor/resizable-image.ts:66` — 明寫 `addNodeView(): NodeViewRenderer`，解 NodeView 與 schema 的循環推導。
- `app/components/Camelot/RichTextEditor.vue:328` — `setImage` 改為 `insertContent({type:'image', attrs})`（上游 `setImage` 的實作即此），使擴充屬性 `pending` 有正確型別；`:446` 重拋錯誤補 `cause`。
- `app/composables/useColor.ts` — 索引存取改為 `substring` 取位，移除兩處 `match(...)!` 非空斷言；新增 `CamelotRgbaTuple`。
- `app/composables/useValueValidation.ts` — 改用 `charAt` 與 `weights.entries()`；格式已由前置 regex 保證。
- `app/composables/useBaseApi.ts:353,361` — `ApiFetchOptions` 衍生自 useFetch 型別卻餵給 `$fetch`，於邊界收斂 `cache`（useFetch 專有的 `false` 無 `$fetch` 對應）與 `dispatcher`（深層 computed 包裝，附理由斷言）。
- `app/composables/useCustomColorScheme.ts:127,136` — `Partial<T>` 在 `T` 未受約束時無法由字面值滿足，加附理由斷言；純型別標註，執行期行為未變，泛型擴充能力經正反向測試確認未受影響。
- `app/composables/useCamelotOverlayScrollbar.ts:1` — `ShallowRef` 不在 Nuxt 自動匯入清單內，補 `import type`。
- `app/composables/useScrollOnBottom.ts:33-35` — 移除多餘初始值（兩分支皆必然賦值）。
- `i18n/i18n.config.ts`、`.playground/i18n/i18n.config.ts` — 移除指向未註冊語系的 fallback 目標。
- `package.json` — 新增 `"typecheck": "nuxt typecheck .playground"`。
- `app/middleware/00.replacePath.ts` → `app/middleware/$00.replacePath.ts` — Q4 帶入的既有更名，內容未變。

## Details
執行期驗證（playground，瀏覽器實測）：CascadeMenu 收合延遲以 DOM 事件驅動確認四種情境（延遲生效、滑入子面板取消、三層鏈全收、click 模式不受影響）；編輯器插入圖片保留 `pending="1"` 且 NodeView 正常包覆；虛擬滾動渲染正常；`CamelotInput.inputEl` 可取得原生 `HTMLInputElement`；i18n 切到空字典的 `zh-Hant` 仍經 `default` 回退解析出「登入」。

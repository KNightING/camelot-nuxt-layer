# Tasks for 2608311144

## Phase 1 — 型別歸位
- [x] 建立 `app/types/cascadeMenu.ts`，承接 `CamelotCascadeMenuContext`（與 Q1 決議的 `CAMELOT_CASCADE_MENU_KEY`）
- [x] 從 `shared/types/cascadeMenu.ts` 移除已搬走的宣告，僅保留 `CamelotCascadeMenuItem`
- [x] 執行 `nuxt prepare .playground`，確認 `imports.d.ts` 已自 `app/types/` 收錄型別；未收錄則補 `nuxt.config.ts` 的 `imports.dirs`
- [x] 確認 `shared/` 全域已無任何 DOM 型別引用

## Phase 2 — typecheck script
- [x] 於 `package.json` 依 Q2 決議新增 `typecheck` script
- [x] 執行一次，記錄 pre-existing 錯誤清單（依 Q3 決議處置）

## Phase 3 — 驗證
- [x] `vue-tsc -p .playground/.nuxt/tsconfig.shared.json` 通過
- [x] `eslint` 對本次改動的檔案零錯誤（全 repo 另有 23 個 pre-existing 錯誤，依 Q3 同一原則不在本計畫處理）
- [x] CascadeMenu 於 playground 實際渲染／子選單展開正常（Browser 驗證）

## Phase 4 — ESLint 全綠（先做：範圍明確、可先排除格式雜訊）
- [ ] `eslint . --fix` 清掉 17 項格式問題，逐檔確認 diff 僅為排版
- [ ] `CascadeMenuPanel.vue:99` `closeTimer` 未賦值：追查 hover 收合延遲的實際行為，判定是缺陷或死碼後修正
- [ ] `useScrollOnBottom.ts:33-35` 三個未使用的賦值：確認是否漏用變數
- [ ] `RichTextEditor.vue:446` 重拋錯誤補上 `cause`
- [ ] `.playground/app/layouts/defualt.vue:2` template root 含 `<slot>`
- [ ] `eslint .` 零錯誤零警告

## Phase 5 — TypeScript 全綠
- [ ] i18n locale 字面值（10）：對齊 `@nuxtjs/i18n` 產生的 locale 聯集
- [ ] `noUncheckedIndexedAccess` 家族（`useColor.ts` 9、`useValueValidation.ts` 5）：以 guard clause 收窄，不用非空斷言
- [ ] tiptap 契約（9，依 Q5）：先查版本／用法，確為上游缺陷才加附理由斷言
- [ ] undici `Dispatcher` / `RequestCache`（2，依 Q5）：同上
- [ ] 其餘單點（`useCustomColorScheme` / `useCamelotOverlayScrollbar` / `TreeNode` / `ConfirmDialog` / `Input` / playground index，共 8）
- [ ] `pnpm typecheck` 零錯誤

## Phase 6 — 最終驗證
- [ ] `pnpm typecheck` 與 `pnpm lint` 皆全綠
- [ ] playground 回歸：CascadeMenu、RichTextEditor、Tree、ConfirmDialog、無限捲動實際操作正常

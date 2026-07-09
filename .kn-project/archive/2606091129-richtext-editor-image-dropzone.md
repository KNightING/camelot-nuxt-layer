# Plan: 2606091129 - CamelotRichTextEditor（TipTap，四主題）+ ImageDropzone

- Created: 2026-06-09
- Completed: 2026-06-09 14:40
- Branch: feature/2606091129-richtext-editor-component
- Status: Archived
- Wiki: [richtext-editor-image-dropzone](../wiki/features/richtext-editor-image-dropzone.md)

## 來源
參考私有專案 `sl-digital-lwd/sld-official-website-webapp` 的 TipTap `RichTextEditor.vue` 與其 extensions，於 camelot 重建為主題化元件（使用端決策：camelot 新元件、可插拔上傳、沿用 TipTap）。

## 成果（依迭代）
1. **CamelotRichTextEditor**：TipTap（StarterKit + Link + Placeholder + 移植 extensions）；v-model(HTML)；工具列 material-symbols icons + CamelotButton 彈窗；色彩走主題 token。
2. **可插拔上傳**：`uploadHandler` + blob/pending/flush/defineExpose（去除硬編 API）。
3. **移植/主題化 extensions**（`Internal/editor/`）：resizable-image + ResizableImageView（NodeView）、paste-sanitize、tab-indent。
4. **四主題**：工具列按鈕形狀與 active/idle 態依主題識別（修正「aqua 工具列長得像 material」）；編輯區 .ProseMirror 四主題。
5. **dev 修正**：`.playground/nuxt.config.ts` 導短 TMPDIR，解 macOS vite-node unix socket EINVAL。
6. **CamelotImageDropzone**：抽出拖曳/選擇圖片區為通用元件；`stacked`（預設，現狀）與 `grid`（多格、新增格在右側、達 max 隱藏、累加）；slot 驅動觸發（預設 slot=觸發區、`#thumb` 自訂縮圖）；v-model(File[]) + select；編輯器改用之。

## 影響檔
- 新增：`app/components/Camelot/RichTextEditor.vue`、`ImageDropzone.vue`、`Internal/editor/{resizable-image.ts,ResizableImageView.vue,paste-sanitize.ts,tab-indent.ts}`
- 修改：`package.json`+`pnpm-lock.yaml`（@tiptap/*）、`.playground/nuxt.config.ts`（dev TMPDIR）、`.playground/app/pages/index.vue`（展示）

## 驗證
- `npx eslint` 全通過；`pnpm build` 通過（產出 RichTextEditor/ResizableImageView chunk）。
- Preview（修掉 dev EINVAL 後）：編輯器渲染、18 工具列鈕、四主題各異；粗體 → `<strong>` + v-model 更新；ImageDropzone grid 模式填格/達 max 隱藏新增格/移除重現、拖入更新 v-model+預覽+select；編輯器確實改用 dropzone。

## References
- 來源（私有）：https://github.com/sl-digital-lwd/sld-official-website-webapp
- TipTap v3：https://tiptap.dev

# ✍️🖼️ RichTextEditor（TipTap）與 ImageDropzone

> 參考私有專案 `sld-official-website-webapp` 的 TipTap 編輯器，於 camelot 重建為主題化的 `CamelotRichTextEditor`，並抽出可重用的 `CamelotImageDropzone`（拖曳/選擇圖片）。皆四主題（material/cupertino/scifi/aqua）。對應計畫 `2606091129`。

## ✍️ CamelotRichTextEditor
TipTap 驅動的 WYSIWYG 編輯器。

- **引擎/擴充**：`@tiptap/{vue-3,pm,core,starter-kit,extension-link,extension-image,extension-placeholder}`；移植並主題化 extensions 至 `app/components/Camelot/Internal/editor/`：
  - `resizable-image.ts` + `ResizableImageView.vue`（圖片寬度/對齊/pending/caption + NodeView 縮放手把與對齊工具列，已主題化）
  - `paste-sanitize.ts`（貼上 HTML 清洗：allowlist tag/attr、b→strong…）
  - `tab-indent.ts`（Tab/Shift-Tab：list 交 StarterKit、codeBlock 兩空白、其餘全形空白）
- **工具列**：material-symbols icons + `CamelotButton` 連結/圖片彈窗；**四主題識別度**——按鈕形狀（aqua pill / scifi 銳利 / cupertino 柔圓 / material）與 active/idle 態（aqua `aqua-fill` 漸層+柔光、scifi 霓虹 tint+role 邊框+glow、其餘實心）。色彩走主題 token（`border-border` / `on-surface` / role color）。
- **可插拔上傳**：`uploadHandler(file)=>Promise<url>` + blob 暫存 / `pending` / `flush()`；`defineExpose({ flush, hasPending })`；無 handler 時僅支援貼圖片網址。圖片彈窗改用 `CamelotImageDropzone`。
- **Props**：`v-model`(HTML string)、`color`、`uploadHandler`、`placeholder`、`disabled`、`minHeight`。

## 🖼️ CamelotImageDropzone
可重用的拖曳/點擊選擇圖片區，四主題、邊框走 `--color-border`、hover/拖入用 role color。

- **版面 `layout`**：
  - `stacked`（預設）：大區塊 + 下方縮圖預覽列（編輯器即用此）。
  - `grid`：多格——縮圖佔格、「新增」格在縮圖右側，達 `max` 張後隱藏新增格（移除後重現）；檔案累加。`columns` 控制欄數。
- **slot 驅動**：預設 slot＝新增區/格內容，其外層恆具點擊行為、整個元件為拖放目標（提供 `open()`）；`#thumb` slot 自訂縮圖（scope：`url/filename/index/remove`）。預設樣式維持原狀。
- **Props**：`color`、`accept`(預設 image/*)、`multiple`、`disabled`、`layout`、`max`、`columns`、`height`、`hint`、`gridHint`、`preview`；`v-model`(File[]) + `select` emit。`model` 為單一真相來源，previews 由其衍生。
- 與舊版 `DropImage`（v1 圖片預覽框）並存。

## ⚙️ 開發環境修正
- `.playground/nuxt.config.ts` 開頭把 dev 的 `TMPDIR` 導到短路徑：Nuxt 4.4.7 的 vite-node 在 `os.tmpdir()` 下建立 unix socket，macOS 預設 `$TMPDIR` 過長 → 超過 ~104 `sun_path` 上限 → `connect EINVAL`。僅 playground 開發用、不隨 layer 發佈。

## References
- 來源（私有）：https://github.com/sl-digital-lwd/sld-official-website-webapp — `app/components/operator/RichTextEditor.vue` 及 `editor/*`
- TipTap v3：https://tiptap.dev
- 計畫歸檔：`.kn-project/archive/2606091129-richtext-editor-image-dropzone.md`
- 相關：[主題系統](./theme-system.md)（`--color-border` token）

---

[🎨 主題系統](./theme-system.md) | [🏠 Wiki](../index.md)

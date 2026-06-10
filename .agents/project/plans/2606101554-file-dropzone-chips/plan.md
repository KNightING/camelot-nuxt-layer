<!-- REMINDER: Relative Paths Only! No file:///c:/... -->
# Plan: 2606101554 - file-dropzone-chips
- Created: 2026-06-10
- Branch: feature/2606101554-file-dropzone-chips
- Status: In Progress
- Completed: [Wait for Finish]

## Goals
新增 `app/components/Camelot/FileDropzone.vue`（`CamelotFileDropzone`）——`ImageDropzone` 的泛用檔案延伸版，預覽改為「附件晶片（chip）」展示模式（參考 Claude 附件列截圖）：

1. **拖曳/點選任意檔案**：邏輯複用 ImageDropzone（drag depth、accept 過濾、max、multiple 累加、input 重選同檔）；`accept` 預設 `*`（不限型別）、`multiple` 預設 `true`。
2. **Chip 預覽列**（取代縮圖格）：
   - 橫向 `flex flex-wrap gap-2`；每檔一張圓角卡片：左側 10×10 識別區 + 右側兩行（檔名截斷 / 型別標籤大寫）。
   - 識別區：圖片檔顯示縮圖（objectURL）；其他依副檔名分類顯示色塊 + icon——試算表（csv/xls/xlsx）綠、文件（doc/docx/txt/md）藍、pdf 紅、壓縮（zip/rar/7z）琥珀、音訊紫、影片青、預設灰。
   - 右上角 × 移除鈕（懸浮半出血、hover 提高對比），比照截圖。
3. **主題識別**：沿用 `data-cml-theme` + scoped CSS 圓角模式（aqua 較圓、scifi 直角、cupertino 中圓）；drop 區樣式同 ImageDropzone（current-color hover/dragover）。
4. **Slots**：`#default`（區塊內容，帶 dragOver/count/max/atMax/open）、`#icon`、`#chip`（帶 file/url/index/remove）。
5. **v-model**：`File[] | null`；`select` emit；objectURL 生命週期管理（watch + onBeforeUnmount revoke）。
6. **Playground**：FileDropzone 展示卡（拖任意檔 → chips；含一個自訂 #chip 範例可省略）。

## Impact Files
- 新增：`app/components/Camelot/FileDropzone.vue`
- 修改：`.playground/app/pages/index.vue`

## Iteration 2（2026-06-10）Headless 化 + 共用核心抽離
1. **`useCamelotFileDrop` composable**（`app/composables/useCamelotFileDrop.ts`）：
   - 抽出共用核心：drag depth/dragOver、accept 過濾、max/multiple 累加、objectURL 生命週期、`pick()`（動態建立 input，任意區域可觸發選檔）、`setFiles`/`removeAt`。
   - 輸入：`{ model: Ref<File[]|null>, accept?, multiple?, max?, disabled?, thumbnails?, onSelect? }`（選項支援 getter 反應式）。
   - 輸出：`dragOver`、`count`/`atMax`、`entries`（含 kind/label/sizeText/colorClass/縮圖 url 衍生資料）、`onDragOver/onDragLeave/onDrop`、`pick`、`removeAt`、`setFiles`。
   - 同檔案輸出 `camelotFileMeta` / `camelotFormatFileSize` 與型別（`CamelotFileEntry` 等）。
2. **`CamelotFileChip` 獨立元件**：單張附件晶片抽為公開元件（props：`file`、`url?`、`removable?`；emit `remove`；自帶 data-cml-theme 圓角 CSS 與 #default slot），自定義展示可直接重用。
3. **FileDropzone / ImageDropzone 重構**為消費 composable（對外 props/slots/emit 行為不變）；FileDropzone 晶片列改用 CamelotFileChip。
4. **檔案大小**（已完成）：chip 型別標籤後顯示 `· B/KB/MB/GB`。
5. **Playground**：
   - 新增 headless 自定義示範：整張卡片區域 = 拖曳區（composable 綁任意元素），檔案以自排 grid 重現 ImageDropzone grid 縮圖樣式 + FileChip 混排，證明全客製能力。
   - ImageDropzone grid 樣式展示維持（既有卡片）。

## Git Completion Policy
- After user-approved commits, completion will run `git rebase main` and update the remote work branch with `git push --force-with-lease`.
- PR/archive order: Archive automatically triggered on PR request

## References
- 來源元件：`app/components/Camelot/ImageDropzone.vue`（drag/accept/max 邏輯與主題 CSS 模式）
- 視覺參考：Claude 附件晶片（縮圖/icon 色塊 + 檔名 + 型別標籤 + 角落 ×）

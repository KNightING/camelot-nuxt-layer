# Plan: 2606101554 - file-dropzone-chips

- Created: 2026-06-10
- Completed: 2026-06-10 16:25
- Branch: feature/2606101554-file-dropzone-chips
- Status: Archived
- Wiki: [file-drop](../wiki/features/file-drop.md)

## 成果

### 三層架構（全包 → 半客製 → 全客製）
1. **`useCamelotFileDrop` composable**（`app/composables/useCamelotFileDrop.ts`）— headless 核心：
   - drag depth/dragOver、accept 過濾（`*`/`type/*`/`.ext`/mime）、max/multiple 累加、縮圖 objectURL 生命週期、`pick()`（動態建 input，任意觸發點可開選檔）、`setFiles`/`removeAt`。
   - 輸出 `entries`：`{ file, url, kind, label, sizeText, colorClass, key }`；`onDragOver/onDragLeave/onDrop` 綁任意元素即成拖曳區。
   - 匯出 `camelotFileMeta`（副檔名/mime → kind/label/色塊）與 `camelotFormatFileSize`（B/KB/MB/GB，<10 一位小數）。
2. **`CamelotFileChip`**（`app/components/Camelot/FileChip.vue`）— 獨立附件晶片：圖片縮圖或型別色塊 icon（Material Symbols：table-chart/picture-as-pdf/description/folder-zip/music-note/movie/draft）+ 檔名截斷 + `副檔名 · 大小` + 可選 × 移除鈕；自帶 data-cml-theme 圓角；未給 `url` 時圖片檔自行產生/回收縮圖；#default slot 全客製。
3. **`CamelotFileDropzone`**（新）與 **`CamelotImageDropzone`**（重構）皆消費 composable，對外 API 不變；FileDropzone 晶片列用 CamelotFileChip，保留 `#chip`/`#icon`/default slots。

### 型別色彩分類
試算表（csv/xls/xlsx）綠、PDF 紅、文件（doc/txt/md）藍、壓縮琥珀、音訊紫紅、影片青、圖片紫（無縮圖時）、未知灰。

### Switch / Checkbox label 光學置中（順帶修正）
label 行高盒（20px，Noto Sans TC leading 留白）光學偏移 → 外層 span `inline-flex items-center` + FieldLabel `leading-none`（14px 字形盒），中心與控制項完全重合。

### Playground
- 「File Dropzone」卡：內建版展示 + headless 示範（整塊自定義拖曳區；圖片自排 grid 縮圖重現 ImageDropzone grid 樣式、其他檔案 FileChip 混排）。
- ImageDropzone grid 樣式展示維持既有卡片。

## 影響檔
- 新增：`app/composables/useCamelotFileDrop.ts`、`app/components/Camelot/FileChip.vue`、`app/components/Camelot/FileDropzone.vue`
- 修改：`ImageDropzone.vue`（重構為消費 composable）、`Switch.vue`、`Checkbox.vue`（label 置中）、`.playground/app/pages/index.vue`

## 驗證
- Preview（CDP）：FileDropzone 模擬選檔——CSV 綠/PDF 紅/PNG 縮圖/未知灰、`CSV · 532 B` 大小標籤、移除同步計數。
- Headless：自定義區 drop 混合檔 → 縮圖 grid + chip、移除正常；ImageDropzone grid drop/移除回歸通過。
- Switch/Checkbox label 中心 y 與控制項完全相等（1245==1245、1290==1290）。
- eslint 全數通過。

## 使用者決策
- FieldLabel 模式延續；headless composable + FileChip 獨立元件的三層架構由使用者確認（「ImageDrop 跟 FileDrop 高度重疊→抽離」）。
- Commit 拆兩筆：feat(file-drop) e6fed84、fix(ui) 94fadd3。

## Tasks
- [x] FileDropzone（chip 預覽 + 檔案大小）
- [x] useCamelotFileDrop 抽核心；FileChip 獨立元件
- [x] FileDropzone / ImageDropzone 重構（API 不變）
- [x] Playground headless 示範（自定義區 + grid 重現）
- [x] Switch / Checkbox label 光學置中
- [x] Preview 驗證 + eslint

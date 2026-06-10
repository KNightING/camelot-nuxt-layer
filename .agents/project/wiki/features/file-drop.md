# 📎 檔案拖曳系統（FileDropzone / FileChip / useCamelotFileDrop）

> 來源計畫：[2606101554-file-dropzone-chips](../../archive/2606101554-file-dropzone-chips.md)（2026-06-10）
> 相關：[RichTextEditor 與 ImageDropzone](richtext-editor-image-dropzone.md)

三層架構——依客製程度選用：

```mermaid
graph TD
    CORE["useCamelotFileDrop<br/>（headless 核心）"]
    CORE --> IDZ["CamelotImageDropzone<br/>全包：圖片縮圖格（stacked/grid）"]
    CORE --> FDZ["CamelotFileDropzone<br/>全包：附件晶片列"]
    CORE --> CUSTOM["自定義<br/>任意元素綁 onDragOver/onDrop"]
    FDZ --> CHIP["CamelotFileChip<br/>（獨立晶片元件）"]
    CUSTOM -.可重用.-> CHIP
```

## useCamelotFileDrop（全客製）

`app/composables/useCamelotFileDrop.ts`

- 選項：`{ model: Ref<File[]|null>, accept?, multiple?, max?, disabled?, thumbnails?, onSelect? }`（支援 getter 反應式）。
- 回傳：`dragOver`、`count`/`atMax`/`maxCount`、`entries`、`setFiles`/`removeAt`、`pick()`（動態 input 開選檔）、`onDragOver/onDragLeave/onDrop`。
- `entries: CamelotFileEntry[]`＝`{ file, url(圖片縮圖), kind, label(副檔名大寫), sizeText, colorClass, key }`，objectURL 生命週期由 composable 管理。
- 任意元素加上 `@dragover.prevent` / `@dragenter.prevent` / `@dragleave.prevent` / `@drop.prevent` + `@click="pick()"` 即成拖曳區。
- 另匯出：`camelotFileMeta(file)`、`camelotFormatFileSize(bytes)`。

## CamelotFileChip（晶片元件）

Props：`file`（必填）、`url?`（外部縮圖；未給且為圖片時自行產生/回收）、`color?`、`removable?`（emit `remove`）。`#default` slot（帶 `file/url/meta`）可全換內容。

型別分類色塊（Material Symbols icon）：

| kind | 副檔名/mime | 色 |
| :--- | :--- | :--- |
| sheet | csv/xls/xlsx/ods/tsv | green-600 |
| pdf | pdf | red-600 |
| doc | doc/docx/txt/md/rtf/odt | blue-600 |
| archive | zip/rar/7z/gz/tar | amber-600 |
| audio | mp3/wav/…・`audio/*` | fuchsia-600 |
| video | mp4/mov/…・`video/*` | cyan-600 |
| image | png/jpg/…・`image/*` | 縮圖（無縮圖 purple-600） |
| file | 其他 | slate-500 |

## CamelotFileDropzone（全包）

Props 同 ImageDropzone 風格：`accept`（預設不限）、`multiple`（預設 true）、`max`、`disabled`、`height`、`hint`、`preview`、`color`。Slots：default（區塊內容）/`#icon`/`#chip`（`file/url/index/remove`）。`v-model: File[]`、`select` emit。

## ImageDropzone 重構

對外 API 完全不變（stacked/grid、columns、max、`#thumb`…），內部 drag/accept/objectURL 改由 `useCamelotFileDrop` 提供（`multiple: multiple || layout==='grid'`、`thumbnails: preview || grid`）。

## References
- Playground：`.playground/app/pages/index.vue` —「File Dropzone」卡（內建版 + headless 自定義區示範：圖片 grid 縮圖重現 ImageDropzone grid 樣式、其他檔案 FileChip 混排）。
- 圖示來源：`unplugin-icons` + `@iconify-json/material-symbols`（建置期 inline SVG）。

---
[✍️🖼️ RichTextEditor / ImageDropzone](richtext-editor-image-dropzone.md) | [🏷️ FieldLabel 表單元件](field-label-and-form-controls.md) | [🏠 Wiki](../index.md)

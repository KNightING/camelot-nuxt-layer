# 📎 檔案拖曳

## Summary

檔案拖曳分三層：headless 核心 `useCamelotFileDrop`、全包元件 `CamelotImageDropzone`（圖片縮圖格）與 `CamelotFileDropzone`（附件晶片列），以及可獨立使用的附件晶片 `CamelotFileChip`。三層共用同一套檔案過濾、上限、縮圖 objectURL 與型別分類邏輯，依客製程度選用其中一層。

## 運作方式

### 三層架構

這張圖回答：要客製到什麼程度，該選哪一層？

```json diagram id=圖1
{
  "type": "flow",
  "dir": "TD",
  "title": "檔案拖曳三層",
  "desc": "headless 核心供兩個全包元件與自定義拖曳區使用；附件晶片可在全包與自定義兩處重用",
  "nodes": [
    {"id": "CORE", "text": "拖曳核心\nheadless", "key": true},
    {"id": "IDZ", "text": "ImageDropzone\n圖片縮圖格"},
    {"id": "FDZ", "text": "FileDropzone\n附件晶片列"},
    {"id": "CUSTOM", "text": "自定義元素\n綁拖放事件"},
    {"id": "CHIP", "text": "FileChip\n附件晶片"}
  ],
  "edges": [
    {"from": "CORE", "to": "IDZ"},
    {"from": "CORE", "to": "FDZ"},
    {"from": "CORE", "to": "CUSTOM"},
    {"from": "FDZ", "to": "CHIP", "label": "預設晶片"},
    {"from": "CUSTOM", "to": "CHIP", "label": "可重用", "kind": "async"}
  ]
}
```

![檔案拖曳三層](file-drop.圖1.svg)

| 需求 | 選用 |
| :--- | :--- |
| 上傳圖片，要縮圖預覽或多格排列 | ImageDropzone |
| 上傳任意附件，以晶片列顯示 | FileDropzone |
| 拖曳區外觀完全自訂 | `useCamelotFileDrop` 綁到任意元素 |
| 只要顯示一個檔案 | FileChip |

來源：1. [useCamelotFileDrop.ts][]　2. [ImageDropzone.vue][]　3. [FileDropzone.vue][]　4. [FileChip.vue][]

### 核心 useCamelotFileDrop

1. 呼叫時傳入檔案清單的 ref 作為單一真相來源，其餘選項都可以是 ref 或 getter。
2. 拖曳區元素綁上 dragover、dragenter、dragleave、drop 四個事件（都加 `.prevent`），點擊時呼叫 `pick()`。
3. `pick()` 動態建立隱藏的檔案 input 開啟選檔視窗；停用或已達上限時不開啟。
4. 選入或拖入的檔案先依 `accept` 過濾，多選時累加到既有清單、單選時只取第一個，再依 `max` 截斷。
5. `entries` 由檔案清單衍生，外部直接改清單也會同步；縮圖 objectURL 由核心建立並在清單變動或卸載時回收。

| 選項 | 預設 | 說明 |
| :--- | :--- | :--- |
| `model` | 必填 | `Ref<File[] \| null>` |
| `accept` | 不限 | 同 input 的 accept，支援副檔名、MIME 與萬用 MIME |
| `multiple` | `true` | 多選時新檔累加 |
| `max` | `0` | 最多檔數，0 為不限 |
| `disabled` | `false` | 停用 |
| `thumbnails` | `true` | 為圖片檔產生縮圖 objectURL |
| `onSelect` | — | 清單變動（選入或移除）時回呼 |

| 回傳 | 說明 |
| :--- | :--- |
| `dragOver` | 是否有檔案拖在區域上 |
| `count`、`atMax`、`maxCount` | 目前檔數、是否已達上限、上限（不限時為無限大） |
| `entries` | 每個檔案的展示資料，見下表 |
| `setFiles`、`removeAt` | 以程式加入檔案、移除第 i 個 |
| `pick` | 開啟選檔視窗 |
| `onDragOver`、`onDragLeave`、`onDrop` | 綁到拖曳區的事件處理 |

| entry 欄位 | 說明 |
| :--- | :--- |
| `file` | 原始 File |
| `url` | 圖片縮圖 objectURL；非圖片或關閉縮圖時為空字串 |
| `kind` | 型別分類，見 FileChip 色塊表 |
| `label` | 副檔名大寫；無副檔名時為 MIME 或「檔案」 |
| `sizeText` | 人類可讀大小（B、KB、MB、GB） |
| `colorClass` | 型別色塊 class |
| `key` | 由檔名、大小、修改時間與索引組成 |

同一個模組另匯出 `camelotFileMeta` 與 `camelotFormatFileSize`，可單獨取得檔案的型別分類與大小文字。

來源：1. [useCamelotFileDrop.ts][]

### FileChip

| Prop | 預設 | 說明 |
| :--- | :--- | :--- |
| `file` | 必填 | 要顯示的 File |
| `url` | `''` | 外部縮圖；未給且為圖片時自行產生並負責回收 |
| `color` | `'primary'` | 色彩角色 |
| `removable` | `false` | 顯示右上角移除鈕，點擊 emit `remove` |

預設 slot 帶 `file`、`url`、`meta`，可整個換掉晶片內容。

| kind | 副檔名或 MIME | 色塊 |
| :--- | :--- | :--- |
| image | png、jpg、jpeg、gif、webp、svg、avif、bmp，或圖片 MIME | 縮圖；無縮圖時 purple-600 |
| sheet | csv、xls、xlsx、ods、tsv | green-600 |
| pdf | pdf | red-600 |
| doc | doc、docx、txt、md、rtf、odt | blue-600 |
| archive | zip、rar、7z、gz、tar | amber-600 |
| audio | mp3、wav、flac、aac、ogg、m4a，或音訊 MIME | fuchsia-600 |
| video | mp4、mov、avi、mkv、webm，或影片 MIME | cyan-600 |
| file | 其他 | slate-500 |

來源：1. [FileChip.vue][]　2. [useCamelotFileDrop.ts][]

### FileDropzone

| Prop | 預設 | 說明 |
| :--- | :--- | :--- |
| `v-model` | `null` | `File[] \| null` |
| `color` | `'primary'` | 色彩角色 |
| `accept` | `'*'` | 接受型別，預設不限 |
| `multiple` | `true` | 多選 |
| `max` | `0` | 最多檔數，0 為不限 |
| `disabled` | `false` | 停用 |
| `height` | `'7rem'` | 拖曳區最小高度 |
| `hint` | 「點此選擇檔案，或拖曳到此區域」 | 提示文字 |
| `preview` | `true` | 顯示附件晶片列 |

| Slot 或 Emit | 說明 |
| :--- | :--- |
| 預設 slot | 拖曳區內容，scope 為 `dragOver`、`count`、`max`、`atMax`、`open` |
| `#icon` | 替換預設上傳圖示 |
| `#chip` | 替換單一晶片，scope 為 `file`、`url`、`index`、`remove` |
| `select` | 清單變動時 emit 目前的檔案陣列 |

來源：1. [FileDropzone.vue][]

### ImageDropzone 與核心的關係

ImageDropzone 的拖曳、過濾與縮圖同樣由核心提供，只是在 grid 版面強制多選並產生縮圖。它的 Props 與 slot 見 [RichTextEditor 與 ImageDropzone](./richtext-editor-image-dropzone.md)。

| 核心選項 | ImageDropzone 傳入 |
| :--- | :--- |
| `multiple` | `multiple` 或版面為 grid |
| `thumbnails` | `preview` 或版面為 grid |

來源：1. [ImageDropzone.vue][]

## 相關頁面

- [FileDropzone](./components/FileDropzone.md)
- [FileChip](./components/FileChip.md)
- [ImageDropzone](./components/ImageDropzone.md)
- [useCamelotFileDrop](./composables/useCamelotFileDrop.md)
- [RichTextEditor 與 ImageDropzone](./richtext-editor-image-dropzone.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useCamelotFileDrop.ts | [app/composables/useCamelotFileDrop.ts](../../../app/composables/useCamelotFileDrop.ts) |
| ImageDropzone.vue | [app/components/Camelot/ImageDropzone.vue](../../../app/components/Camelot/ImageDropzone.vue) |
| FileDropzone.vue | [app/components/Camelot/FileDropzone.vue](../../../app/components/Camelot/FileDropzone.vue) |
| FileChip.vue | [app/components/Camelot/FileChip.vue](../../../app/components/Camelot/FileChip.vue) |

[useCamelotFileDrop.ts]: #references
[ImageDropzone.vue]: #references
[FileDropzone.vue]: #references
[FileChip.vue]: #references

---
[⚙️ Env](../environment.md) | [🏠 Wiki](../index.md)

# useCamelotFileDrop

## Summary

`useCamelotFileDrop(options)` 是檔案拖放與選擇的 headless 核心：以 v-model 的檔案清單為單一真相來源，衍生含型別、大小文字與縮圖的項目，並提供拖放事件處理與檔案選擇器。FileDropzone 與 ImageDropzone 共用它，也可單獨把任意元素變成拖放區。

## 運作方式

### 寫入檔案

1. 停用時忽略。
2. 以 accept 過濾檔案；過濾後沒有檔案就不變更。
3. 多選時接在既有清單後面，單選時只取第一個。
4. 有上限時截斷到上限數量。
5. 寫回 model，並以新清單呼叫 onSelect。

移除單一檔案走同樣的寫回與回呼，但不檢查停用狀態。

來源：1. [useCamelotFileDrop.ts][]

### accept 比對

| 寫法 | 比對方式 |
| --- | --- |
| 星號、星號斜線星號 | 接受全部 |
| 型別加斜線星號，如 image/* | 比對 MIME 前綴 |
| 點開頭，如 .pdf | 比對檔名結尾，不分大小寫 |
| 完整 MIME | 與檔案 MIME 完全相同 |

多個條件以逗號分隔，任一符合即接受。

來源：1. [useCamelotFileDrop.ts][]

### 項目與縮圖

1. model 或縮圖開關變動時立即重建項目清單，外部改 v-model 也會同步。
2. 重建前先釋放舊縮圖的物件網址，元件卸載前也會釋放。
3. 只有圖片類型且開啟縮圖時才建立物件網址，其餘為空字串。
4. 每項的 key 由檔名、大小、最後修改時間與索引組成。

來源：1. [useCamelotFileDrop.ts][]

### 拖放與選擇器

1. dragenter 與 dragover 都綁 onDragOver，以深度計數處理子元素進出，計數歸零才取消懸停。
2. onDrop 重設懸停狀態，停用時忽略，否則寫入拖入的檔案。
3. pick 動態建立隱藏的檔案輸入元素並點擊；停用、已達上限或非瀏覽器環境時不作用。

來源：1. [useCamelotFileDrop.ts][]

## 用法

```ts
const files = ref<File[] | null>(null)
const drop = useCamelotFileDrop({ model: files, accept: 'image/*', max: 5 })
```

```vue
<div
  @dragover.prevent="drop.onDragOver"
  @dragenter.prevent="drop.onDragOver"
  @dragleave.prevent="drop.onDragLeave"
  @drop.prevent="drop.onDrop"
  @click="drop.pick()"
>
  <img v-for="e in drop.entries.value" :key="e.key" :src="e.url">
</div>
```

## 簽章

```ts
useCamelotFileDrop(options: CamelotFileDropOptions): {
  dragOver: Ref<boolean>
  count: ComputedRef<number>
  atMax: ComputedRef<boolean>
  maxCount: ComputedRef<number>
  entries: Ref<CamelotFileEntry[]>
  setFiles: (list: File[]) => void
  removeAt: (i: number) => void
  pick: () => void
  onDragOver: () => void
  onDragLeave: () => void
  onDrop: (e: DragEvent) => void
}
```

## 參數

| 欄位 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `model` | `Ref<File[] \| null>` | — | 檔案清單 |
| `accept` | `MaybeRefOrGetter<string>` | `'*'` | 接受的檔案型別，寫法同檔案輸入元素 |
| `multiple` | `MaybeRefOrGetter<boolean>` | `true` | 多選；新檔累加到既有清單 |
| `max` | `MaybeRefOrGetter<number>` | `0` | 最多檔數，0 代表不限 |
| `disabled` | `MaybeRefOrGetter<boolean>` | `false` | 停用 |
| `thumbnails` | `MaybeRefOrGetter<boolean>` | `true` | 是否為圖片產生縮圖 |
| `onSelect` | `(files: File[]) => void` | — | 清單因選入或移除而變動時呼叫 |

## 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `dragOver` | `Ref<boolean>` | 是否正在拖曳懸停 |
| `count` | `ComputedRef<number>` | 目前檔案數 |
| `atMax` | `ComputedRef<boolean>` | 是否已達上限 |
| `maxCount` | `ComputedRef<number>` | 上限值；不限時為 `Infinity` |
| `entries` | `Ref<CamelotFileEntry[]>` | 由 model 衍生的檔案項目 |
| `setFiles` | `(list) => void` | 過濾後寫入 model |
| `removeAt` | `(i) => void` | 移除指定索引的檔案 |
| `pick` | `() => void` | 開啟檔案選擇器 |
| `onDragOver`、`onDragLeave`、`onDrop` | 事件處理函式 | 搭配 prevent 修飾子綁在拖放區 |

## 相關型別與工具

| 名稱 | 說明 |
| --- | --- |
| `CamelotFileKind` | `'image' \| 'sheet' \| 'pdf' \| 'doc' \| 'archive' \| 'audio' \| 'video' \| 'file'` |
| `CamelotFileEntry` | `file`、`url`、`kind`、`label`、`sizeText`、`colorClass`、`key` |
| `camelotFileMeta(f)` | 回傳檔案的 kind、label 與 colorClass |
| `camelotFormatFileSize(bytes)` | 轉成 B、KB、MB、GB；10 以上取整數，以下保留一位小數 |

| 類型 | 副檔名 | MIME 前綴 | 色塊 |
| --- | --- | --- | --- |
| image | png、jpg、jpeg、gif、webp、svg、avif、bmp | image | `bg-purple-600` |
| sheet | csv、xls、xlsx、ods、tsv | — | `bg-green-600` |
| pdf | pdf | — | `bg-red-600` |
| doc | doc、docx、txt、md、rtf、odt | — | `bg-blue-600` |
| archive | zip、rar、7z、gz、tar | — | `bg-amber-600` |
| audio | mp3、wav、flac、aac、ogg、m4a | audio | `bg-fuchsia-600` |
| video | mp4、mov、avi、mkv、webm | video | `bg-cyan-600` |
| file | 其他 | — | `bg-slate-500` |

標籤為大寫副檔名；沒有副檔名時用 MIME，再沒有就顯示「檔案」。

來源：1. [useCamelotFileDrop.ts][]

## 相關頁面

- [檔案拖放](../file-drop.md)
- [FileDropzone](../components/FileDropzone.md)
- [ImageDropzone](../components/ImageDropzone.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useCamelotFileDrop.ts | [app/composables/useCamelotFileDrop.ts](../../../../app/composables/useCamelotFileDrop.ts) |

[useCamelotFileDrop.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

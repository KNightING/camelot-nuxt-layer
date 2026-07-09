# useCamelotFileDrop

> 檔案拖曳／選擇的 headless 核心，管理 v-model 檔案清單、產生型別分類與縮圖，並提供拖放與檔案選擇器事件處理。

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
`options: CamelotFileDropOptions`

| 欄位 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `model` | `Ref<File[] \| null>` | — | 檔案清單（單一真相來源；外部改動會同步 `entries`）。 |
| `accept` | `MaybeRefOrGetter<string>` | `'*'` | 接受的檔案型別（同 input `accept`）。 |
| `multiple` | `MaybeRefOrGetter<boolean>` | `true` | 多選（`true` 時新檔累加既有清單）。 |
| `max` | `MaybeRefOrGetter<number>` | `0`（不限） | 最多檔數。 |
| `disabled` | `MaybeRefOrGetter<boolean>` | `false` | 是否停用。 |
| `thumbnails` | `MaybeRefOrGetter<boolean>` | `true` | 是否為圖片檔產生縮圖 objectURL。 |
| `onSelect` | `(files: File[]) => void` | — | 清單變動（選入／移除）時回呼。 |

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `dragOver` | `Ref<boolean>` | 是否正在拖曳懸停。 |
| `count` | `ComputedRef<number>` | 目前檔案數。 |
| `atMax` | `ComputedRef<boolean>` | 是否已達 `max` 上限。 |
| `maxCount` | `ComputedRef<number>` | 上限值（`0` 時為 `Infinity`）。 |
| `entries` | `Ref<CamelotFileEntry[]>` | 由 `model` 衍生的檔案項目（含縮圖、型別、大小文字等）。 |
| `setFiles` | `(list) => void` | 過濾（accept／max／multiple）後寫入 `model`。 |
| `removeAt` | `(i) => void` | 移除指定索引的檔案。 |
| `pick` | `() => void` | 動態建立 input 開啟檔案選擇器。 |
| `onDragOver` / `onDragLeave` / `onDrop` | 事件處理 | 搭配 `@dragover.prevent` 等使用。 |

## 用法
```ts
const files = ref<File[] | null>(null)
const drop = useCamelotFileDrop({ model: files })
```
```vue
<div @dragover.prevent="drop.onDragOver" @drop.prevent="drop.onDrop" @click="drop.pick()">
  ...drop.entries...
</div>
```

## 相關型別與工具
| 名稱 | 說明 |
| --- | --- |
| `CamelotFileKind` | `'image' \| 'sheet' \| 'pdf' \| 'doc' \| 'archive' \| 'audio' \| 'video' \| 'file'` |
| `CamelotFileEntry` | `file`、`url`（縮圖）、`kind`、`label`、`sizeText`、`colorClass`、`key`。 |
| `camelotFileMeta(f: File)` | 回傳檔案的 `kind` / `label`（副檔名大寫）/ `colorClass`。 |
| `camelotFormatFileSize(bytes: number)` | bytes 轉人類可讀大小（B／KB／MB／GB）。 |

## 備註
- `entries` 由 `watch([model, thumbnails])`（immediate）衍生，重建前會 `revokeObjectURL` 舊縮圖；`onBeforeUnmount` 亦會釋放。
- `pick()` 在 `disabled`、`atMax` 或非瀏覽器環境時不作用。

---
[🏠 Wiki](../index.md)

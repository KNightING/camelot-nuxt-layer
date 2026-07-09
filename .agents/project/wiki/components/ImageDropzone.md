# ImageDropzone

> 圖片拖放區，支援 stacked（大區塊＋下方預覽）與 grid（多格）兩種版面，含縮圖預覽與移除。

**匯入名稱**：`CamelotImageDropzone`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `color` | `CamelotColorRole` | `'primary'` | 角色色彩 |
| `accept` | `string` | `'image/*'` | 接受的檔案型別（同 input accept） |
| `multiple` | `boolean` | `false` | 是否可多選 |
| `disabled` | `boolean` | `false` | 是否停用 |
| `layout` | `'stacked' \| 'grid'` | `'stacked'` | 版面：stacked＝大區塊＋下方預覽；grid＝多格、新增格在縮圖右側 |
| `max` | `number` | `0` | 最多張數（0＝不限）；grid 達上限會隱藏新增格 |
| `columns` | `number` | `4` | grid 欄數 |
| `height` | `string` | `'7rem'` | stacked 區塊最小高度 |
| `hint` | `string` | `'點此選擇圖片，或拖曳到此區域'` | 提示文字 |
| `gridHint` | `string` | `'新增'` | grid 新增格提示文字 |
| `preview` | `boolean` | `true` | stacked 是否在下方顯示縮圖 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `select` | `(files: File[])` | 選取檔案時觸發 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model` | `File[] \| null` | 目前選取的圖片清單（預設 `null`） |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | `{ dragOver, count, max, atMax, open }` | 自訂拖曳/新增區內容；`open` 為開啟檔案選擇器的函式 |
| `icon` | — | 自訂拖曳區圖示 |
| `thumb` | `{ url, filename, index, remove }` | 自訂縮圖格；預設顯示圖片與移除鈕 |

## 備註
- 核心拖放/accept/max/縮圖生命週期由 `useCamelotFileDrop` 提供；grid 版面強制 multiple 與縮圖。
- 拖曳懸停時邊框與背景以角色色彩強調；停用時降低不透明度並阻擋互動。
- 圓角形狀依 `data-cml-theme`（aqua/scifi/cupertino）調整。

---
[🏠 Wiki](../index.md)

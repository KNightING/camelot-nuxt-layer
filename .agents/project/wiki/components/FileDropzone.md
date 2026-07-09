# FileDropzone

> 檔案拖放區，支援點擊選檔與拖曳上傳，並以附件晶片列預覽已選檔案。

**匯入名稱**：`CamelotFileDropzone`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `color` | `CamelotColorRole` | `'primary'` | 角色色彩 |
| `accept` | `string` | `'*'` | 接受的檔案型別（同 input accept） |
| `multiple` | `boolean` | `true` | 是否可多選 |
| `disabled` | `boolean` | `false` | 是否停用 |
| `max` | `number` | `0` | 最多檔數（0＝不限） |
| `height` | `string` | `'7rem'` | 拖曳區最小高度 |
| `hint` | `string` | `'點此選擇檔案，或拖曳到此區域'` | 提示文字 |
| `preview` | `boolean` | `true` | 是否顯示附件晶片列 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `select` | `(files: File[])` | 選取檔案時觸發 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model` | `File[] \| null` | 目前選取的檔案清單（預設 `null`） |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | `{ dragOver, count, max, atMax, open }` | 自訂拖曳區內容；`open` 為開啟檔案選擇器的函式 |
| `icon` | — | 自訂拖曳區圖示 |
| `chip` | `{ file, url, index, remove }` | 自訂附件晶片；預設渲染 `CamelotFileChip` |

## 備註
- 核心拖放/accept/max/縮圖生命週期由 `useCamelotFileDrop` 提供。
- 拖曳懸停時邊框與背景以角色色彩強調；停用時降低不透明度並阻擋互動。
- 圓角形狀依 `data-cml-theme`（aqua/scifi/cupertino）調整。

---
[🏠 Wiki](../index.md)

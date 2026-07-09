# FileChip

> 檔案晶片，顯示檔案縮圖或型別圖示、檔名、型別標籤與大小，可選附移除鈕。

**匯入名稱**：`CamelotFileChip`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `file` | `File` | — | 要顯示的檔案 |
| `url` | `string` | `''` | 圖片縮圖 objectURL；未提供且為圖片檔時自行產生並負責回收 |
| `color` | `CamelotColorRole` | `'primary'` | 角色色彩 |
| `removable` | `boolean` | `false` | 顯示右上角移除鈕（emit `remove`） |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `remove` | — | 點擊移除鈕時觸發 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | `{ file, url, meta }` | 自訂整體內容；`url` 為縮圖網址、`meta` 為檔案型別資訊 |

## 備註
- 圖示依 `camelotFileMeta` 判斷的檔案類型（sheet/pdf/doc/archive/audio/video/image 及其他）顯示。
- 大小文字由 `camelotFormatFileSize` 格式化。
- 未提供 `url` 且為圖片檔時，自行以 `URL.createObjectURL` 產生縮圖並於 `file`/`url` 變動或卸載時回收。
- 圓角形狀依 `data-cml-theme`（aqua/scifi 等）調整。

---
[🏠 Wiki](../index.md)

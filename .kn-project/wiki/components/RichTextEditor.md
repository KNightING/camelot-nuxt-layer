# RichTextEditor

> 基於 TipTap 的富文本編輯器，含工具列、連結/圖片、貼上 HTML 淨化與可插拔圖片上傳。

**匯入名稱**：`CamelotRichTextEditor`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色 |
| `placeholder` | `string` | `'開始撰寫內容…'` | 空白時的提示文字 |
| `disabled` | `boolean` | `false` | 停用編輯（唯讀、降低透明度） |
| `minHeight` | `string` | `'320px'` | 編輯區最小高度 |
| `uploadHandler` | `(file: File) => Promise<string>` | - | 可插拔上傳：回傳最終可存取的圖片 URL；未提供時僅支援貼上圖片網址 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model`（預設） | `string` | 編輯器 HTML 內容（`required`） |

## Exposed
| 名稱 | 說明 |
| :--- | :--- |
| `flush()` | `Promise<void>`；將所有待上傳（blob）圖片透過 `uploadHandler` 逐張上傳，並把內容中的 blob URL 換成最終 URL。上傳中再次呼叫會拋錯 |
| `hasPending` | `ComputedRef<boolean>`；是否還有尚未上傳的圖片 |

## 備註
- 工具列包含：標題 H1/H2/H3、段落、粗體、斜體、刪除線、行內代碼、項目清單、編號清單、引言、程式碼區塊、分隔線、連結、圖片、貼上 HTML、復原、重做。
- TipTap 擴充：`StarterKit`、`Link`（`openOnClick: false`）、`Placeholder`、自訂 `ResizableImage`、`PasteSanitize`、`TabIndent`。
- 貼上/拖曳圖片：若提供 `uploadHandler`，圖片先以 blob 暫存並標記 `data-pending="1"`（虛線外框），儲存前呼叫 `flush()` 才真正上傳。
- 貼上含 HTML 標籤的純文字時，會經 `sanitizePastedHtml` 淨化後插入。
- 「貼上 HTML」按鈕會讀取剪貼簿文字並淨化插入；瀏覽器拒絕存取剪貼簿時顯示錯誤提示。
- 介面文案目前為內建繁體中文（未接 i18n）。
- 元件卸載時會撤銷所有暫存 blob URL 並銷毀編輯器實例。

---
[🏠 Wiki](../index.md)

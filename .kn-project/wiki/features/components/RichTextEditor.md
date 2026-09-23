# RichTextEditor

## Summary

`CamelotRichTextEditor` 是以 TipTap 驅動、依主題換外觀的所見即所得編輯器，以 HTML 字串雙向綁定內容。內建標題、清單、引言、程式碼、連結、圖片等工具列，會把貼上的雜亂 HTML 淨化成乾淨的文章格式；圖片可先暫存在本機、等到儲存前再透過使用端提供的上傳函式一次上傳。整體設計見 [RichTextEditor 與 ImageDropzone](../richtext-editor-image-dropzone.md)。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色 |
| `placeholder` | `string` | `'開始撰寫內容…'` | 內容空白時的提示文字 |
| `disabled` | `boolean` | `false` | 停用編輯：唯讀、半透明、不接受點擊 |
| `minHeight` | `string` | `'320px'` | 編輯區最小高度（CSS 長度） |
| `uploadHandler` | `(file: File) => Promise<string>` | — | 上傳函式，回傳圖片的最終網址；未提供時只能插入圖片網址 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `string` | 編輯器的 HTML 內容（必填） |

## Exposed
| 名稱 | 說明 |
| :--- | :--- |
| `flush()` | 回傳 `Promise<void>`；把仍在內容中的暫存圖片逐張上傳，並把內容裡的暫存網址換成最終網址。上傳中再呼叫會拋錯 |
| `hasPending` | `ComputedRef<boolean>`；是否還有尚未上傳的暫存圖片 |

## 運作方式

### 工具列

| 群組 | 按鈕 |
| :--- | :--- |
| 段落格式 | 標題 1、標題 2、標題 3、段落 |
| 文字樣式 | 粗體、斜體、刪除線、行內代碼 |
| 區塊 | 項目清單、編號清單、引言、程式碼區塊、分隔線 |
| 插入 | 連結、圖片、貼上 HTML |
| 歷程 | 復原、重做 |

工具列固定在編輯區頂端，捲動時不離開。介面文案內建繁體中文，沒有接 i18n。

來源：1. [RichTextEditor.vue][]

### 貼上與鍵盤

1. 貼上圖片檔且有上傳函式時，圖片以暫存方式插入。
2. 貼上的純文字看起來含 HTML 標籤時，先淨化再插入：移除腳本、樣式與多餘屬性，只保留文章常用標籤。
3. 「貼上 HTML」按鈕讀取剪貼簿文字並淨化後插入；瀏覽器拒絕存取或剪貼簿為空時，狀態列顯示錯誤 4 秒。
4. 在清單內按 Tab 會調整清單層級；在程式碼區塊內插入兩個半形空白；其他地方插入一個全形空白，Shift＋Tab 刪除它。
5. 連結在編輯區內點擊不會開啟，方便編輯文字。

來源：1. [RichTextEditor.vue][]　2. [paste-sanitize.ts][]　3. [tab-indent.ts][]

### 圖片暫存與上傳

1. 有上傳函式時，貼上、拖放或從圖片面板選擇的圖片不會立刻上傳，而是以本機暫存網址插入，並以虛線外框標示。
2. 狀態列顯示待上傳的張數。
3. 儲存前使用端呼叫 `flush()`：已從內容刪除的暫存圖片直接釋放，其餘逐張上傳並換成最終網址，最後更新綁定的 HTML。
4. 上傳失敗時狀態列顯示錯誤，`flush()` 拋出帶原始錯誤原因的例外。
5. 沒有上傳函式時，圖片面板只提供貼上圖片網址，貼上或拖放的圖片檔交給編輯器預設處理。
6. 選取圖片後，拖曳右下角的把手可調整寬度。
7. 元件卸載時釋放所有暫存網址並銷毀編輯器。

來源：1. [RichTextEditor.vue][]　2. [resizable-image.ts][]　3. [ResizableImageView.vue][]

### 各主題外框

| 主題 | 外框 |
| :--- | :--- |
| aqua | 大圓角、半透明底加背景模糊與柔和陰影 |
| scifi | 直角、淡角色色框線與光暈，等寬字體 |
| cupertino | 14px 圓角、淺色容器底與較深陰影 |
| material | 12px 圓角、表面底色與輕陰影 |

來源：1. [RichTextEditor.vue][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| RichTextEditor.vue | [app/components/Camelot/RichTextEditor.vue](../../../../app/components/Camelot/RichTextEditor.vue) |
| paste-sanitize.ts | [app/components/Camelot/Internal/editor/paste-sanitize.ts](../../../../app/components/Camelot/Internal/editor/paste-sanitize.ts) |
| tab-indent.ts | [app/components/Camelot/Internal/editor/tab-indent.ts](../../../../app/components/Camelot/Internal/editor/tab-indent.ts) |
| resizable-image.ts | [app/components/Camelot/Internal/editor/resizable-image.ts](../../../../app/components/Camelot/Internal/editor/resizable-image.ts) |
| ResizableImageView.vue | [app/components/Camelot/Internal/editor/ResizableImageView.vue](../../../../app/components/Camelot/Internal/editor/ResizableImageView.vue) |

[RichTextEditor.vue]: #references
[paste-sanitize.ts]: #references
[tab-indent.ts]: #references
[resizable-image.ts]: #references
[ResizableImageView.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

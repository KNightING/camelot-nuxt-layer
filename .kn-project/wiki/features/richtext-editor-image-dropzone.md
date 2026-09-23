# ✍️ 富文本與圖片拖曳

## Summary

`CamelotRichTextEditor` 是以 TipTap v3 驅動的主題化 WYSIWYG 編輯器，v-model 為 HTML 字串，支援連結、圖片縮放與對齊、貼上 HTML 清洗、Tab 縮排，以及可插拔的延後上傳。`CamelotImageDropzone` 是從編輯器圖片彈窗抽出、可單獨使用的圖片拖曳／選擇元件，有 stacked 與 grid 兩種版面。兩者都支援四種主題，與舊版圖片預覽框 `CamelotDropImage` 並存。

## 運作方式

### 編輯器擴充

編輯器以 StarterKit 為底，另外註冊以下擴充；自寫的三個擴充放在內部 editor 目錄。

| 擴充 | 作用 |
| :--- | :--- |
| StarterKit | 段落、標題、清單、程式碼區塊、復原等基本功能；內建的 Link 關閉，改由下一列註冊 |
| Link | 點擊連結不開啟，方便編輯 |
| Placeholder | 空白時顯示 `placeholder` |
| ResizableImage | 圖片寬度、對齊、待上傳標記與圖說，NodeView 提供縮放手把與對齊工具列 |
| PasteSanitize | 清洗貼上的 HTML，只留 allowlist 內的標籤與屬性，b 轉 strong、i 轉 em |
| TabIndent | 清單內交給 StarterKit 調整層級；程式碼區塊插兩個半形空白；其餘插一個全形空白 |

1. 圖片 NodeView 元件的 props 直接用 TipTap 的 `NodeViewProps` 型別；手寫 props 會缺少必要欄位而被 NodeView renderer 拒絕。
2. `addNodeView()` 必須明寫回傳型別 `NodeViewRenderer`，否則會與 schema 形成循環推導。
3. 插入圖片用 `insertContent` 帶 image 型別與屬性，而不用 `setImage()`：後者的選項型別容不下自訂的 `pending` 屬性，兩者行為相同。

來源：1. [RichTextEditor.vue][]　2. [resizable-image.ts][]　3. [ResizableImageView.vue][]　4. [paste-sanitize.ts][]　5. [tab-indent.ts][]

### 圖片上傳

有 `uploadHandler` 時，圖片先以 blob 暫存在編輯器裡，等頁面呼叫 `flush()` 才真正上傳。

1. 貼上、拖入或從圖片彈窗的 ImageDropzone 選入圖片時，建立 blob URL 並插入標記為待上傳的圖片。
2. 狀態列顯示待上傳張數；`hasPending` 可供頁面判斷是否還有未上傳的圖。
3. 頁面儲存前呼叫 `flush()`：先回收已從內容刪掉的 blob，再逐張呼叫 `uploadHandler`，把圖片來源換成回傳的 URL 並清除待上傳標記。
4. 上傳中再次呼叫 `flush()` 會丟錯；上傳失敗時狀態列顯示錯誤並把錯誤往外丟，保留原始錯誤在 `cause`。
5. 沒有 `uploadHandler` 時，圖片彈窗只能貼圖片網址，貼上與拖入圖片檔不會被攔截。

來源：1. [RichTextEditor.vue][]

### 工具列與主題

1. 工具列用 Material Symbols 圖示，連結與圖片以彈窗輸入，彈窗內的按鈕用 CamelotButton。
2. 「貼上 HTML 原始碼」按鈕讀取剪貼簿，清洗後插入；剪貼簿為空、無法解析或瀏覽器拒絕讀取時顯示提示，4 秒後消失。
3. 貼上的純文字若看起來像 HTML 標籤，也會先清洗再插入。
4. 按鈕形狀依主題區分：aqua 膠囊、scifi 銳角、cupertino 柔圓、material 標準圓角。
5. 啟用態依主題區分：aqua 漸層加柔光、scifi 霓虹底色加色彩角色邊框與光暈，其餘為實心。
6. 顏色一律走主題 token 與色彩角色，邊框用 border token。

來源：1. [RichTextEditor.vue][]

### RichTextEditor Props

| Prop | 預設 | 說明 |
| :--- | :--- | :--- |
| `v-model` | 必填 | HTML 字串 |
| `color` | `'primary'` | 色彩角色 |
| `placeholder` | 「開始撰寫內容…」 | 空白提示 |
| `disabled` | `false` | 唯讀 |
| `minHeight` | `'320px'` | 編輯區最小高度 |
| `uploadHandler` | — | `(file: File) => Promise<string>`，回傳可存取的圖片 URL |

| Exposed | 說明 |
| :--- | :--- |
| `flush()` | 上傳所有仍在內容中的待上傳圖片 |
| `hasPending` | 是否還有待上傳圖片 |

來源：1. [RichTextEditor.vue][]

### ImageDropzone

可重用的拖曳或點擊選擇圖片區；拖曳、過濾與縮圖由檔案拖曳核心提供，見 [檔案拖曳](./file-drop.md)。

| 版面 | 行為 |
| :--- | :--- |
| stacked（預設） | 一個大區塊，下方縮圖預覽列；編輯器圖片彈窗用這個版面並關閉預覽 |
| grid | 縮圖各佔一格，「新增」格在縮圖右側；達 `max` 後隱藏新增格，移除後重現；檔案累加 |

| Prop | 預設 | 說明 |
| :--- | :--- | :--- |
| `v-model` | `null` | `File[] \| null`，唯一真相來源，縮圖由它衍生 |
| `color` | `'primary'` | 色彩角色 |
| `accept` | 圖片 MIME | 同 input 的 accept |
| `multiple` | `false` | 多選；grid 版面一律多選 |
| `disabled` | `false` | 停用 |
| `layout` | `'stacked'` | `'stacked'` 或 `'grid'` |
| `max` | `0` | 最多張數，0 為不限 |
| `columns` | `4` | grid 欄數 |
| `height` | `'7rem'` | stacked 區塊最小高度 |
| `hint` | 「點此選擇圖片，或拖曳到此區域」 | 提示文字 |
| `gridHint` | 「新增」 | grid 新增格文字 |
| `preview` | `true` | stacked 是否在下方顯示縮圖 |

| Slot 或 Emit | 說明 |
| :--- | :--- |
| 預設 slot | 新增區或新增格的內容，外層恆可點擊，scope 含 `open` |
| `#icon` | 替換預設圖示 |
| `#thumb` | 自訂縮圖，scope 為 `url`、`filename`、`index`、`remove` |
| `select` | 清單變動時 emit 目前的檔案陣列 |

整個元件都是拖放目標；邊框走 border token，hover 與拖入時改用色彩角色。

來源：1. [ImageDropzone.vue][]

### 開發環境

playground 的 Nuxt 設定開頭會把開發時的暫存目錄導到短路徑。macOS 預設暫存目錄太長，vite-node 建立的 unix socket 路徑會超過約 104 字元上限而連線失敗。這個設定只在 playground 開發時生效，不隨 layer 發佈。

來源：1. [nuxt.config.ts][]

## 相關頁面

- [RichTextEditor](./components/RichTextEditor.md)
- [ImageDropzone](./components/ImageDropzone.md)
- [DropImage](./components/DropImage.md)
- [ResizableImageView](./components/Internal-editor-ResizableImageView.md)
- [檔案拖曳](./file-drop.md)
- [主題系統](../platform/theme-system.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| RichTextEditor.vue | [app/components/Camelot/RichTextEditor.vue](../../../app/components/Camelot/RichTextEditor.vue) |
| resizable-image.ts | [app/components/Camelot/Internal/editor/resizable-image.ts](../../../app/components/Camelot/Internal/editor/resizable-image.ts) |
| ResizableImageView.vue | [app/components/Camelot/Internal/editor/ResizableImageView.vue](../../../app/components/Camelot/Internal/editor/ResizableImageView.vue) |
| paste-sanitize.ts | [app/components/Camelot/Internal/editor/paste-sanitize.ts](../../../app/components/Camelot/Internal/editor/paste-sanitize.ts) |
| tab-indent.ts | [app/components/Camelot/Internal/editor/tab-indent.ts](../../../app/components/Camelot/Internal/editor/tab-indent.ts) |
| ImageDropzone.vue | [app/components/Camelot/ImageDropzone.vue](../../../app/components/Camelot/ImageDropzone.vue) |
| nuxt.config.ts | [.playground/nuxt.config.ts](../../../.playground/nuxt.config.ts) |

[RichTextEditor.vue]: #references
[resizable-image.ts]: #references
[ResizableImageView.vue]: #references
[paste-sanitize.ts]: #references
[tab-indent.ts]: #references
[ImageDropzone.vue]: #references
[nuxt.config.ts]: #references

---
[⚙️ Env](../environment.md) | [🏠 Wiki](../index.md)

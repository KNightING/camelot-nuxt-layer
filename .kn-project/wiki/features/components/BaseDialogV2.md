# BaseDialogV2

## Summary

原生 `<dialog>` 為基底的模態對話框，含四主題外框、遮罩點擊/Esc 關閉與網址查詢字串同步。

**匯入名稱**：`CamelotBaseDialogV2`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `closeByMask` | `boolean` | `true` | 點擊遮罩（內容框之外）或按 Esc 是否關閉 |
| `tag` | `string` | - | 對話框 id；亦作為預設的網址查詢字串 key（值為此 tag） |
| `zIndex` | `number` | - | 對話框 z-index |
| `query` | `CamelotDialogQuery` | - | 自訂網址查詢字串同步設定（優先於 `tag`） |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `cancel` | - | 透過遮罩或 Esc 關閉時觸發 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model:open` | `boolean` | 是否開啟（預設 `false`） |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `wrapper` | - | 覆寫整個全螢幕置中容器（自訂 wrapper 時遮罩判斷改回 `e.target === dialog`） |
| `default` | - | 對話框內容（置於各主題內容框內） |

## 備註
- 依 `themeMode` 呈現四種內容框：`scifi`（`CamelotScifiFrame` 四角框）、`cupertino`、`aqua`（毛玻璃）、預設 Material。
- 使用原生 `dialog.showModal()` 產生背景遮罩；關閉時延遲 400ms 再 `close()` 以配合淡出動畫。
- 遮罩點擊判斷：點在 `.dialog-content-box` 之外即關閉，但下列四種情形會**先行排除**：
    1. 點在 `[data-camelot-popup]` 內 —— [PopupV2](./PopupV2.md) 會把浮層 Teleport 進本 `<dialog>`，位置落在內容框之外；不排除的話，點選單選項會被誤判成點遮罩。
    2. 事件 target 已脫離文件 —— 巢狀 `<dialog>` 以 `v-if` 渲染，選取後先被移除，本 `pointerup` 才輪到執行，此時 `contains()` 必然回傳 `false`。
    3. 點在巢狀 `<dialog>` 內 —— 交由該內層自行處理遮罩與關閉。
    4. 內容框只認**屬於本對話框**的那一個（以 `closest('dialog')` 篩選）—— `querySelector` 會一併撈到巢狀 `<dialog>` 的內容框；[BaseBottomSheetV2](./BaseBottomSheetV2.md) 以自訂 wrapper 渲染、本身沒有內容框，若不篩選會誤把對方的當成自己的，導致點面板空白處連整個 Sheet 一起關掉。
- `closeByMask: false` 會**連帶停用 Esc 關閉**，這是刻意設計，用於強制決策的 modal。此時元件不提供任何內建關閉 UI，使用端必須自行提供關閉途徑（可改用 [ConfirmDialog](./ConfirmDialog.md)）。
- 本元件**不提供內建關閉按鈕**：四種版面皆只渲染 `<slot />`，關閉 UI 由使用端負責。需要標準按鈕列時請改用 [ConfirmDialog](./ConfirmDialog.md)。
- 網址同步：設定 `tag` 或 `query` 後，開啟會 push 查詢字串（含 `isDialog=true`），關閉會 back 或移除查詢字串；並監聽路由變化反向同步 `open`。
- 開啟時鎖定 `body` 捲動。

---
[🏠 Wiki](../../index.md)

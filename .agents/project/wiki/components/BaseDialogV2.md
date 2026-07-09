# BaseDialogV2

> 原生 `<dialog>` 為基底的模態對話框，含四主題外框、遮罩點擊/Esc 關閉與網址查詢字串同步。

**匯入名稱**：`CamelotBaseDialogV2`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `closeByMask` | `boolean` | `true` | 點擊遮罩（內容框之外）或按 Esc 是否關閉 |
| `tag` | `string` | - | 對話框 id；亦作為預設的網址查詢字串 key（值為此 tag） |
| `zIndex` | `number` | - | 對話框 z-index |
| `query` | `{ key: string, value: string }` | - | 自訂網址查詢字串同步設定（優先於 `tag`） |

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
- 遮罩點擊判斷：點在 `.dialog-content-box` 之外即關閉。
- 網址同步：設定 `tag` 或 `query` 後，開啟會 push 查詢字串（含 `isDialog=true`），關閉會 back 或移除查詢字串；並監聽路由變化反向同步 `open`。
- 開啟時鎖定 `body` 捲動。

---
[🏠 Wiki](../index.md)

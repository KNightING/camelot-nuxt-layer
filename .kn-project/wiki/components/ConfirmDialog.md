# ConfirmDialog

> 帶標準按鈕列的確認對話框，最多三顆按鈕（反向 / 中立 / 正向），預設只有「確認」且點擊即關閉。

**匯入名稱**：`CamelotConfirmDialog`

組合 [BaseDialogV2](./BaseDialogV2.md) 與 [Button](./Button.md)。兩者本身已依 `themeMode` 分派 scifi / cupertino / aqua / material，因此本元件不另外實作版面。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `title` | `string` | — | 標題；未設定且未用 `title` slot 時不渲染標題列 |
| `message` | `string` | — | 內文；未設定且未用預設 slot 時不渲染內文 |
| `positiveLabel` | `string` | `'確認'` | 正向按鈕文字；設為空字串可隱藏此鈕 |
| `neutralLabel` | `string` | — | 中立按鈕文字；**未設定則不顯示** |
| `negativeLabel` | `string` | — | 反向按鈕文字；**未設定則不顯示** |
| `positiveColor` | `CamelotColorRole` | `'primary'` | 正向按鈕色彩角色 |
| `neutralColor` | `CamelotColorRole` | `'primary'` | 中立按鈕色彩角色（以 container 樣式呈現） |
| `negativeColor` | `CamelotColorRole` | `'error'` | 反向按鈕色彩角色（以 container 樣式呈現） |
| `autoClose` | `boolean` | `true` | 點擊任一按鈕後是否自動關閉 |
| `closeByMask` | `boolean` | `true` | 透傳 `BaseDialogV2` |
| `tag` | `string` | — | 透傳 `BaseDialogV2` |
| `zIndex` | `number` | — | 透傳 `BaseDialogV2` |
| `query` | `CamelotDialogQuery` | — | 透傳 `BaseDialogV2`，用於網址查詢字串同步 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `positive` | — | 點擊正向按鈕 |
| `neutral` | — | 點擊中立按鈕 |
| `negative` | — | 點擊反向按鈕 |
| `cancel` | — | 透過遮罩或 Esc 關閉（由 `BaseDialogV2` 轉發） |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model:open` | `boolean` | 是否開啟（預設 `false`） |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `title` | — | 取代 `title` 標題列 |
| `default` | — | 取代 `message` 內文 |
| `actions` | `close: () => void` | 完全接管按鈕列；`close` 可用來關閉對話框 |

## 用法

```vue
<!-- 預設：只有一顆「確認」，點擊即關閉 -->
<CamelotConfirmDialog
  v-model:open="saved"
  title="已儲存"
  message="設定已套用。"
/>

<!-- 三顆按鈕 -->
<CamelotConfirmDialog
  v-model:open="deleting"
  title="刪除這筆資料？"
  message="刪除後無法復原。"
  positive-label="刪除"
  positive-color="error"
  neutral-label="稍後再說"
  negative-label="取消"
  @positive="remove()"
/>

<!-- 非同步流程：自行控制關閉時機 -->
<CamelotConfirmDialog
  v-model:open="submitting"
  :auto-close="false"
  positive-label="送出"
  @positive="onSubmit"
/>
```

## 備註
- **按鈕顯示規則**：依 label 是否設定決定。`positiveLabel` 有預設值故預設顯示；`neutralLabel` / `negativeLabel` 未設定即不渲染。
- **按鈕順序固定為 反向 → 中立 → 正向 並靠右**，四種風格一致。風格差異由 `CamelotButton` 的外觀承擔，使用端不必為了切換風格重新思考按鈕位置。
- `autoClose` 為 `false` 時，按鈕仍會 emit 事件但不關閉，由使用端自行控制 `v-model:open`（適用於送出前需驗證或等待 API 的情境）。
- 內容請只放內容：外框與內距已由 `BaseDialogV2` 負責。

---
[🗂️ 元件清單](../features/components.md) ・ [🏠 Wiki](../index.md)

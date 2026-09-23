# ConfirmDialog

## Summary

ConfirmDialog 是帶標準按鈕列的確認對話框，匯入名稱 `CamelotConfirmDialog`。最多三顆按鈕（反向、中立、正向），預設只有「確認」且點擊即關閉；它組合 [BaseDialogV2](./BaseDialogV2.md) 與 [Button](./Button.md)，兩者已依主題切換外觀，所以本元件不另外實作版面。

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
| `closeByMask` | `boolean` | `true` | 透傳給 BaseDialogV2 |
| `tag` | `string` | — | 透傳給 BaseDialogV2 |
| `zIndex` | `number` | — | 透傳給 BaseDialogV2 |
| `query` | `CamelotDialogQuery` | — | 透傳給 BaseDialogV2，用於網址查詢字串同步 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `positive` | — | 點擊正向按鈕 |
| `neutral` | — | 點擊中立按鈕 |
| `negative` | — | 點擊反向按鈕 |
| `cancel` | — | 透過遮罩或 Esc 關閉（由 BaseDialogV2 轉發） |

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

## 運作方式

### 按鈕列

1. 依 label 是否有值決定每顆按鈕是否渲染；正向按鈕有預設文字，所以預設顯示。
2. 按鈕順序固定為反向、中立、正向並靠右，四種主題一致；外觀差異由 Button 承擔。
3. 反向與中立按鈕以容器色呈現，正向按鈕用一般色。
4. 點擊按鈕先送出對應事件；`autoClose` 為 true 時接著關閉。

`autoClose` 設為 false 時按鈕只送出事件不關閉，由使用端自行控制開關，適用於送出前需驗證或等待 API 的情境。

內容只放內容即可：外框與內距已由 BaseDialogV2 負責。

來源：1. [ConfirmDialog.vue][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| ConfirmDialog.vue | [app/components/Camelot/ConfirmDialog.vue](../../../../app/components/Camelot/ConfirmDialog.vue) |

[ConfirmDialog.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

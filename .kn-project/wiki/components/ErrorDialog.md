# ErrorDialog

> 綁定 [useCamelotError](../composables/useCamelotError.md) 佇列的錯誤對話框，一次呈現一則錯誤，關閉後自動接續下一則。

**匯入名稱**：`CamelotErrorDialog`

包裝 [ConfirmDialog](./ConfirmDialog.md)，於 App 根部掛一次即可，不需要在各頁面重複放置。內容全部來自 `currentError`，Props 只提供錯誤未帶對應欄位時的預設值。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `title` | `string` | `'發生錯誤'` | 錯誤未帶 `title` 時的預設標題 |
| `fallbackMessage` | `string` | `'發生錯誤，請稍後再試'` | 錯誤未帶 `message` 也未帶 `messageHtml` 時的保底文字 |
| `positiveLabel` | `string` | `'確認'` | 錯誤未帶 `positive` 動作時的正向按鈕文字 |
| `closeByMask` | `boolean` | `false` | 是否可由遮罩／Esc 關閉；預設關閉以免使用者略過未讀的錯誤 |
| `zIndex` | `number` | — | 錯誤未帶 `zIndex` 時的預設層級 |

## Emits
無。使用者的操作一律回寫到 `useCamelotError` 的佇列。

## v-model
無。開關狀態由佇列是否為空決定。

## Slots
無。內容取自 `currentError` 的 `message` / `messageHtml`。

## 用法

```vue
<!-- app.vue：掛一次即可 -->
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <CamelotToast />
  <CamelotErrorDialog />
</template>
```

```vue
<!-- 覆寫預設文字 -->
<CamelotErrorDialog
  title="系統訊息"
  fallback-message="請稍後再試一次。"
  positive-label="我知道了"
/>
```

## 備註
- **動作按鈕**取自錯誤的 `positive` / `neutral` / `negative`（型別 `CamelotErrorAction`），直接對映 `ConfirmDialog` 的三個按鈕槽，因此排列規則同樣是 **反向 → 中立 → 正向 並靠右**。未指定 `positive` 時退回 Props 的預設確認鈕。
- 按鈕色彩未指定時，沿用由錯誤 `level` 推導的色彩角色（`level` 未設定時為 `error`）。
- 以 `:auto-close="false"` 接管關閉時機：按鈕一律走 `runAction`，由 `CamelotErrorAction.close` 決定是否關閉。
- **關閉路徑統一收斂到 `open` 的 computed setter**，未另接 `cancel` 事件——[BaseDialogV2](./BaseDialogV2.md) 的遮罩／Esc 關閉會先寫回 open model 再 emit `cancel`，兩邊都接會重複 `dismiss()` 而吃掉佇列中的下一則。
- 佇列還有下一筆時對話框保持開啟並直接顯示下一則，佇列清空才關閉。
- `messageHtml` 以 `v-html` 渲染，內容必須來自可信來源。

---
[🗂️ 元件清單](../components.md) ・ [🏠 Wiki](../index.md)

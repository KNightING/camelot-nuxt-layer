# ErrorDialog

## Summary

ErrorDialog（匯入名稱 `CamelotErrorDialog`）是綁定 [useCamelotError](../composables/useCamelotError.md) 錯誤佇列的對話框：一次顯示一則錯誤，關閉後自動接續下一則，佇列清空才關閉。它包裝 [ConfirmDialog](./ConfirmDialog.md)，在 App 根部掛一次即可；內容全部來自目前的錯誤，Props 只提供錯誤未帶對應欄位時的預設值。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `title` | `string` | `'發生錯誤'` | 錯誤未帶標題時的預設標題 |
| `fallbackMessage` | `string` | `'發生錯誤，請稍後再試'` | 錯誤既無純文字也無 HTML 訊息時的保底文字 |
| `positiveLabel` | `string` | `'確認'` | 錯誤未帶正向動作時的按鈕文字 |
| `closeByMask` | `boolean` | `false` | 是否可由遮罩或 Esc 關閉；預設關閉，以免使用者略過未讀的錯誤 |
| `zIndex` | `number` | — | 錯誤未帶層級時的預設層級 |

## Emits
無。使用者的操作一律回寫到錯誤佇列。

## v-model
無。開關狀態由佇列是否為空決定。

## Slots
無。內容取自目前錯誤的純文字或 HTML 訊息。

## 用法

### 掛載

在 app 根元件掛一次：

```vue
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <CamelotToast />
  <CamelotErrorDialog />
</template>
```

### 覆寫預設文字

```vue
<CamelotErrorDialog
  title="系統訊息"
  fallback-message="請稍後再試一次。"
  positive-label="我知道了"
/>
```

## 運作方式

### 內容與按鈕

| 項目 | 來源 |
| :--- | :--- |
| 標題 | 錯誤的標題，沒有則用 title |
| 內文 | HTML 訊息優先，其次純文字訊息，都沒有則用 fallbackMessage |
| 按鈕 | 錯誤的 positive、neutral、negative 三個動作，對應 ConfirmDialog 的三個按鈕槽 |
| 按鈕色 | 動作自帶顏色優先，否則用錯誤等級推導的色彩角色，未設等級時為 error |
| 層級 | 錯誤的 zIndex，沒有則用 zIndex prop |

按鈕排列沿用 ConfirmDialog：反向、中立、正向，靠右。錯誤未指定正向動作時，仍顯示一顆用 positiveLabel 的確認鈕。

HTML 訊息以 v-html 渲染，內容必須來自可信來源。

來源：1. [ErrorDialog.vue][]

### 關閉流程

1. 對話框停用 ConfirmDialog 的自動關閉，按鈕一律交給錯誤佇列處理。
2. 按下的按鈕有對應動作時，由佇列執行該動作，並依動作的 close 設定決定是否關閉這則錯誤。
3. 按下的按鈕沒有對應動作時，直接關閉這則錯誤。
4. 遮罩與 Esc 關閉會寫回開關狀態，由同一個 setter 關閉這則錯誤。
5. 佇列還有下一則時對話框保持開啟並顯示下一則，佇列清空才關閉。

關閉只收斂在開關狀態的 setter，不另外監聽 cancel 事件：[BaseDialogV2](./BaseDialogV2.md) 關閉時會先寫回開關狀態再發出 cancel，兩邊都處理會多關一則、吃掉佇列中的下一則錯誤。

來源：1. [ErrorDialog.vue][]

## 相關頁面

- [元件清單](../components.md)
- [錯誤處理](../../platform/error-handling.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| ErrorDialog.vue | [app/components/Camelot/ErrorDialog.vue](../../../../app/components/Camelot/ErrorDialog.vue) |

[ErrorDialog.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

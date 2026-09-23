# useCamelotToast

## Summary

`useCamelotToast()` 是全域單例的 Toast 通知佇列，提供開啟、新增、移除與清空通知的方法。通知預設顯示 3 秒後自動移除，可同時存在多則，由 Toast 元件依各自的位置呈現。

## 運作方式

### 新增通知

1. 以預設值補齊：顯示 3000ms、類型 info、位置 bottom，並產生隨機 id；傳入的欄位會覆蓋預設值。
2. 深拷貝後放進佇列；函式欄位如 onClose、action 的 handler 保留原參照。
3. 選項 only 為 true 時，先清空所有通知與計時器再加入。
4. 顯示時間大於 0 時設定計時器，到期自動移除；設為 0 則不會自動關閉。
5. 回傳這則通知的 id。

open 接受字串或通知物件，字串會轉成只有 message 的通知，再走同樣流程。

來源：1. [useCamelotToast.ts][]

### 移除與清空

1. removeToast 未傳 id 時不做任何事。
2. 有 id 時先清掉該則的計時器，移出佇列，再呼叫它的 onClose。
3. clear 清掉所有計時器並清空佇列，不呼叫任何 onClose。

來源：1. [useCamelotToast.ts][]

## 用法

```ts
const toast = useCamelotToast()
toast.open('儲存成功', { only: true })
const id = toast.addToast({ message: '刪除中…', type: 'warning', duration: 0 })
toast.removeToast(id)
```

## 簽章

```ts
useCamelotToast(): {
  toasts: Ref<CamelotToast[]>
  currentToast: ComputedRef<CamelotToast | null>
  addToast: (toast: CamelotToast, options?: CamelotToastOptions) => string | undefined
  removeToast: (id?: string) => void
  open: (messageOrToast: string | CamelotToast, options?: CamelotToastOptions) => string | undefined
  clear: () => void
}
```

## 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `toasts` | `Ref<CamelotToast[]>` | 所有通知，以 useState 的 `Camelot:Toasts` 保存 |
| `currentToast` | `ComputedRef<CamelotToast \| null>` | 佇列第一則，供舊用法相容；沒有則為 `null` |
| `addToast` | `(toast, options?) => string \| undefined` | 新增通知並回傳 id |
| `removeToast` | `(id?) => void` | 移除指定通知並呼叫其 onClose |
| `open` | `(messageOrToast, options?) => string \| undefined` | 以字串或物件開啟通知 |
| `clear` | `() => void` | 清空所有通知 |

## 型別

| 型別 | 欄位 |
| --- | --- |
| `CamelotToast` | `id?`、`message`、`title?`、`type?`、`color?`、`duration?`、`position?`、`action?`、`onClose?` |
| `CamelotToastOptions` | `only?` |
| `CamelotToastType` | `'success' \| 'error' \| 'info' \| 'warning'` |
| `CamelotToastPosition` | `'top' \| 'bottom' \| 'left' \| 'right' \| 'center' \| 'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` |
| `CamelotToastAction` | `{ label: string; handler?: () => void }` |

| 欄位 | 預設 | 說明 |
| --- | --- | --- |
| `duration` | `3000` | 顯示毫秒數；0 代表不自動關閉 |
| `type` | `'info'` | 狀態類型，決定狀態色 |
| `color` | — | 直接指定色彩角色，優先於類型對應的狀態色 |
| `position` | `'bottom'` | 顯示位置 |

來源：1. [useCamelotToast.ts][]

## 相關頁面

- [Toast](../components/Toast.md)：顯示佇列的元件。

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useCamelotToast.ts | [app/composables/useCamelotToast.ts](../../../../app/composables/useCamelotToast.ts) |

[useCamelotToast.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

# useCamelotToast

> 全域單例的 Toast 通知管理，提供新增、開啟、移除與清空通知的方法。

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
| `toasts` | `Ref<CamelotToast[]>` | 目前所有通知，透過 `useState('Camelot:Toasts')` 保存。 |
| `currentToast` | `ComputedRef<CamelotToast \| null>` | 第一個通知（向後相容用），無則為 `null`。 |
| `addToast` | `(toast, options?) => string \| undefined` | 新增通知，回傳其 `id`。會 deepClone 並補上預設值。 |
| `removeToast` | `(id?) => void` | 依 `id` 移除通知並清除其計時器，觸發該通知的 `onClose`。 |
| `open` | `(messageOrToast, options?) => string \| undefined` | 以字串或物件開啟通知（字串會轉為 `{ message }`），內部呼叫 `addToast`。 |
| `clear` | `() => void` | 清除所有計時器並清空通知。 |

## 參數與型別
`addToast` / `open` 的通知物件 `CamelotToast` 預設值：`duration: 3000`、`type: 'info'`、`position: 'bottom'`。

| 型別 | 欄位 |
| --- | --- |
| `CamelotToast` | `id?`、`message`、`title?`、`type?`、`color?`（直接指定色彩角色，優先於 type）、`duration?`、`position?`、`action?`、`onClose?` |
| `CamelotToastOptions` | `only?`（為 `true` 時先 `clear()` 再新增） |
| `CamelotToastType` | `'success' \| 'error' \| 'info' \| 'warning'` |
| `CamelotToastPosition` | `'top' \| 'bottom' \| 'left' \| 'right' \| 'center' \| 'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` |
| `CamelotToastAction` | `{ label: string; handler?: () => void }` |

## 用法
```ts
const toast = useCamelotToast()
toast.open('儲存成功', { only: true })
const id = toast.addToast({ message: '刪除中…', type: 'warning', duration: 5000 })
toast.removeToast(id)
```

## 備註
- 為模組層單例（`camelotToast`），首次呼叫時建立，之後共用同一實例。
- `duration` 且有 `id` 時會設定計時器，到期自動 `removeToast`。
- `id` 以 `Math.random().toString(36).substring(2, 11)` 產生。

---
[🏠 Wiki](../index.md)

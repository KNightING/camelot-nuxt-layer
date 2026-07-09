# useInputValidationController

> 集中管理多個輸入驗證器（函式或 computed），提供批次驗證、失敗時自動捲動至第一個錯誤元素、以及整體有效性的 computed。

## 簽章
```ts
export const useInputValidationController = () => {
  addValidatorComputed,
  removeValidatorComputed,
  addValidator,
  removeValidator,
  validate,
  hasInvalid,
  isValidate,
}
```

相關型別：
```ts
export type ValidatorFn = () => boolean

export type Validator = () => {
  valid: boolean
  element?: MaybeElementRef
} | boolean
```

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `addValidatorComputed` | `(ref: ComputedRef<boolean \| string \| undefined>) => void` | 加入一個 computed 驗證來源（供 `isValidate` 計算）。 |
| `removeValidatorComputed` | `(ref: ComputedRef<boolean \| string \| undefined>) => void` | 移除已加入的 computed 驗證來源。 |
| `addValidator` | `(fn: Validator) => void` | 加入一個驗證函式（供 `validate` / `hasInvalid` 使用）。 |
| `removeValidator` | `(fn: Validator) => void` | 移除已加入的驗證函式。 |
| `validate` | `() => boolean` | 回傳 `!hasInvalid()`，即是否全部通過。 |
| `hasInvalid` | `(options?: { scrollToFirstElement?: boolean }) => boolean` | 執行所有驗證函式，回傳是否存在錯誤；預設會捲動至第一個錯誤元素。 |
| `isValidate` | `ComputedRef<boolean>` | 所有 computed 驗證來源皆為 truthy 時為 `true`。 |

## 用法
```ts
const controller = useInputValidationController()

controller.addValidator(() => ({
  valid: !!name.value,
  element: nameInputRef,
}))

controller.addValidatorComputed(computed(() => email.value.includes('@')))

function onSubmit() {
  if (!controller.validate()) return // 失敗會自動捲動至第一個錯誤欄位
  // 送出...
}
```

## 備註
- `hasInvalid` 的驗證函式可回傳 `boolean` 或 `{ valid, element }`；後者在 `valid` 為 `false` 且提供 `element` 時會納入捲動候選。
- 捲動目標取所有錯誤元素中 `scrollTop` 最小者，並以 `scrollIntoView({ behavior: 'smooth', block: 'center' })` 捲動。
- `element` 若為 Vue 元件實例，會取其 `$el`。
- `isValidate` 與 `validate` 是兩套獨立來源：前者看 computed 清單，後者看函式清單。

---
[🏠 Wiki](../index.md)

# 輸入驗證控制器

## Summary

useInputValidationController 集中管理一個表單內的多個驗證來源：驗證函式清單用於送出前批次驗證，失敗時自動捲動到出錯欄位；computed 清單用於即時算出整體是否有效。兩套清單彼此獨立，各自註冊、各自判斷。

## 介面

### 簽章

```ts
const useInputValidationController: () => InputValidationController

interface InputValidationController {
  addValidatorComputed: (ref: ComputedRef<boolean | string | undefined>) => void
  removeValidatorComputed: (ref: ComputedRef<boolean | string | undefined>) => void
  addValidator: (fn: Validator) => void
  removeValidator: (fn: Validator) => void
  validate: () => boolean
  hasInvalid: (options?: { scrollToFirstElement?: boolean }) => boolean
  isValidate: ComputedRef<boolean>
}

export type Validator = () => {
  valid: boolean
  element?: MaybeElementRef
} | boolean

export type ValidatorFn = () => boolean
```

### 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `addValidatorComputed` | `(ref) => void` | 加入一個 computed 驗證來源，供 `isValidate` 計算 |
| `removeValidatorComputed` | `(ref) => void` | 移除已加入的 computed 驗證來源 |
| `addValidator` | `(fn: Validator) => void` | 加入一個驗證函式，供 `validate` 與 `hasInvalid` 使用 |
| `removeValidator` | `(fn: Validator) => void` | 移除已加入的驗證函式 |
| `validate` | `() => boolean` | 等於 `!hasInvalid()`，全部通過時為 `true` |
| `hasInvalid` | `(options?) => boolean` | 執行所有驗證函式，有任何失敗時為 `true`；可用選項控制要不要捲動 |
| `isValidate` | `ComputedRef<boolean>` | 所有 computed 來源皆為 truthy 時為 `true` |

來源：1. [useInputValidationController.ts][]

## 用法

```ts
const controller = useInputValidationController()

controller.addValidator(() => ({
  valid: !!name.value,
  element: nameInputRef,
}))

controller.addValidatorComputed(computed(() => email.value.includes('@')))

function onSubmit() {
  if (!controller.validate()) return // 失敗會自動捲動到出錯欄位
  // 送出...
}
```

## 規則

| 規則 | 說明 |
| --- | --- |
| 驗證函式回傳 | 可回傳 `boolean`，或 `{ valid, element }` 物件 |
| 捲動候選 | 只有物件回傳、`valid` 為 `false` 且帶 `element` 的項目會列入 |
| 元件實例 | `element` 為 Vue 元件實例時取其 `$el` |
| 捲動目標 | 候選元素中畫面位置最靠上的錯誤欄位 |
| 捲動方式 | `scrollIntoView`，平滑捲動並置中 |
| 關閉捲動 | 呼叫 `hasInvalid({ scrollToFirstElement: false })`；`validate()` 一律會捲動 |
| computed 為字串 | 非空字串視為通過，空字串視為失敗 |
| 移除未註冊項目 | 移除從未加入的項目時不做任何事，不影響其他項目 |

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231702-fix-wiki-review-code-defects](../../../archive/2609231702-fix-wiki-review-code-defects.md) | 修正程式碼缺陷後更新為修正後的行為 | [#47](https://github.com/KNightING/camelot-nuxt-layer/issues/47) | — |
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useInputValidationController.ts | [app/composables/useInputValidationController.ts](../../../../app/composables/useInputValidationController.ts) |

[useInputValidationController.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

# useValueValidation

## Summary

useValueValidation 依指定型別對字串值做響應式格式驗證，回傳 ComputedRef<boolean>。支援 email、手機、國際手機、純數字、市話、可含分機的市話、台灣身分證字號、台灣統一編號；空值的結果由 allowUndefined 決定。

## 介面

### 簽章

```ts
const useValueValidation: (
  target: MaybeRef<string | undefined>,
  options: {
    type: 'email' | 'mobile' | 'internationalMobile' | 'number' | 'phone'
      | 'phoneCanExtension' | 'taiwanIdNumber' | 'taiwanUniformNumber'
    allowUndefined?: boolean
  },
) => ComputedRef<boolean>
```

### 參數

| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `target` | `MaybeRef<string \| undefined>` | 必填 | 要驗證的值 |
| `options.type` | 見簽章 | 必填 | 驗證型別 |
| `options.allowUndefined` | `boolean` | `false` | 值為空字串或 `undefined` 時直接回傳的結果 |

### 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| 回傳值 | `ComputedRef<boolean>` | 值是否通過驗證 |

來源：1. [useValueValidation.ts][]

## 用法

```ts
const email = ref('')
const isValidEmail = useValueValidation(email, { type: 'email' })

const id = ref('')
const isValidId = useValueValidation(id, { type: 'taiwanIdNumber', allowUndefined: true })
```

## 驗證規則

| type | 規則 | 備註 |
| --- | --- | --- |
| `email` | `/^[\w.+-]+@([\w-]+\.)+[\w-]{2,4}$/` | 見下方說明 |
| `mobile` | `/^[0-9]+$/` | 與 `number` 相同，只檢查純數字 |
| `internationalMobile` | `/^\+\d{1,3}\d{8,9}$/` | 加號、1 到 3 碼國碼、8 到 9 碼號碼 |
| `number` | `/^[0-9]+$/` | 純數字 |
| `phone` | `/^0\d{8,9}$/` | 0 開頭共 9 到 10 碼 |
| `phoneCanExtension` | `/^0\d{8,9}(#\d+)?$/` | 同 `phone`，可接 `#` 加分機 |
| `taiwanIdNumber` | 身分證檢核碼 | 見下方步驟 |
| `taiwanUniformNumber` | 統一編號檢核碼 | 見下方步驟 |

email 的帳號可含英數、底線、點、連字號與加號，網域各段可含英數、底線與連字號，不接受反斜線。頂級網域須為 2 到 4 碼。

### 台灣身分證字號

1. 格式須為一個大寫字母、數字 1 或 2、再 8 碼數字。
2. 字母依對照表轉成兩位數，十位數乘 1、個位數乘 9。
3. 第 2 到第 9 碼依序乘 8 到 1，最後一碼乘 1。
4. 全部加總可被 10 整除即合法。

### 台灣統一編號

1. 格式須為 8 碼數字。
2. 各碼依序乘上權重 1、2、1、2、1、2、4、1。
3. 乘積為兩位數時，十位數與個位數相加。
4. 全部加總可被 5 整除即合法。
5. 第 7 碼為 7 時，總和加 1 可被 5 整除也視為合法。

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231702-fix-wiki-review-code-defects](../../../archive/2609231702-fix-wiki-review-code-defects.md) | 修正程式碼缺陷後更新為修正後的行為 | [#47](https://github.com/KNightING/camelot-nuxt-layer/issues/47) | — |
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useValueValidation.ts | [app/composables/useValueValidation.ts](../../../../app/composables/useValueValidation.ts) |

[useValueValidation.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

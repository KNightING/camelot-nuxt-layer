# useValueValidation

> 依指定型別（email、手機、電話、台灣身分證、台灣統一編號等）對字串值做響應式格式驗證，回傳 `ComputedRef<boolean>`。

## 簽章
```ts
export const useValueValidation = (
  target: MaybeRef<string | undefined>,
  options: {
    type: 'email' | 'mobile' | 'internationalMobile' | 'number' | 'phone'
        | 'phoneCanExtension' | 'taiwanIdNumber' | 'taiwanUniformNumber'
    allowUndefined?: boolean
  },
) => ComputedRef<boolean>
```

## 參數
| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `target` | `MaybeRef<string \| undefined>` | （必填） | 要驗證的值（透過 `toValue` 解析）。 |
| `options.type` | `'email' \| 'mobile' \| 'internationalMobile' \| 'number' \| 'phone' \| 'phoneCanExtension' \| 'taiwanIdNumber' \| 'taiwanUniformNumber'` | （必填） | 驗證型別。 |
| `options.allowUndefined` | `boolean` | `false` | 值為空（falsy）時的回傳值。 |

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| （回傳值） | `ComputedRef<boolean>` | 值是否通過對應型別驗證。 |

## 驗證規則
| type | 規則 |
| --- | --- |
| `email` | `/^[\w\-\.]+@([\w\-]+\.)+[\w\-]{2,4}$/` |
| `mobile` | 純數字 `/^[0-9]+$/` |
| `internationalMobile` | `/^\+\d{1,3}\d{8,9}$/` |
| `number` | 純數字 `/^[0-9]+$/` |
| `phone` | `/^0\d{8,9}$/` |
| `phoneCanExtension` | `/^0\d{8,9}(#\d+)?$/`（可含分機） |
| `taiwanIdNumber` | 台灣身分證字號檢核（含字母權重與檢查碼） |
| `taiwanUniformNumber` | 台灣統一編號檢核（權重 `[1,2,1,2,1,2,4,1]`，總和可被 5 整除；第7位為 7 時另有特例） |

## 用法
```ts
const email = ref('')
const isValidEmail = useValueValidation(email, { type: 'email' })

const id = ref('')
const isValidId = useValueValidation(id, { type: 'taiwanIdNumber', allowUndefined: true })
```

## 備註
- 值為空字串或 `undefined` 時直接回傳 `allowUndefined`（預設 `false`）。
- 台灣身分證：格式須為 `[A-Z][12]\d{8}`，依字母對應數值與位權計算，總和 `% 10 === 0` 為合法。
- 台灣統一編號：格式須為 8 位數字；乘積為兩位數時取十位＋個位相加後加總。

---
[🏠 Wiki](../index.md)

# useIsValidKey

> 判斷指定的 key 是否存在於物件中，並作為 TypeScript 型別守衛（type guard）收窄型別。

## 簽章
```ts
const useIsValidKey: (
  key: string | number | symbol,
  object: object,
) => key is keyof typeof object
```

## 參數
| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `key` | `string \| number \| symbol` | — | 欲檢查的鍵。 |
| `object` | `object` | — | 欲檢查的目標物件。 |

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| （回傳值） | `key is keyof typeof object` | 以 `key in object` 判斷是否存在；為型別守衛，成立時可將 `key` 收窄為該物件的鍵。 |

## 用法
```ts
const obj = { name: 'a', age: 1 }
const key = 'name'
if (useIsValidKey(key, obj)) {
  // 此處 key 被收窄為 keyof typeof obj
  console.log(obj[key])
}
```

---
[🏠 Wiki](../index.md)

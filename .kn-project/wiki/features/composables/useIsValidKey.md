# useIsValidKey

## Summary

useIsValidKey 以 in 運算子判斷一個 key 是否存在於物件中，宣告為泛型的 TypeScript 型別守衛。守衛成立後 key 會被收窄成該物件的鍵型別，之後可以直接用它安全地取值。

## 介面

### 簽章

```ts
const useIsValidKey: <T extends object>(
  key: PropertyKey,
  object: T,
) => key is keyof T
```

### 參數

| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `key` | `PropertyKey` | 必填 | 要檢查的鍵 |
| `object` | `T` | 必填 | 要檢查的物件 |

### 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| 回傳值 | `key is keyof T` | `key in object` 的結果 |

來源：1. [useIsValidKey.ts](../../../../app/composables/useIsValidKey.ts)

## 用法

```ts
const letterMap = { A: 10, B: 11 }
const char = input.charAt(0)
if (!useIsValidKey(char, letterMap)) {
  return false
}
const num = letterMap[char]
```

## 規則

| 規則 | 說明 |
| --- | --- |
| 原型鏈 | `in` 會找原型鏈，`'toString'` 對一般物件也會回傳 `true` |
| 型別收窄 | 收窄成物件的鍵型別，取得的值是該物件的屬性型別 |

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

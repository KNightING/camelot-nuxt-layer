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

來源：1. [useIsValidKey.ts][]

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

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231702-fix-wiki-review-code-defects](../../../archive/2609231702-fix-wiki-review-code-defects.md) | 修正程式碼缺陷後更新為修正後的行為 | [#47](https://github.com/KNightING/camelot-nuxt-layer/issues/47) | — |
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useIsValidKey.ts | [app/composables/useIsValidKey.ts](../../../../app/composables/useIsValidKey.ts) |

[useIsValidKey.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

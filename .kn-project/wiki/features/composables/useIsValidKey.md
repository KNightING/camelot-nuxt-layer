# useIsValidKey

## Summary

useIsValidKey 以 in 運算子判斷一個 key 是否存在於物件中，宣告為 TypeScript 型別守衛。因為物件參數宣告為 object，守衛成立後 key 會被收窄成 never，不會變成該物件的鍵型別；它的實際用途是執行期的存在檢查。

## 介面

### 簽章

```ts
const useIsValidKey: (
  key: string | number | symbol,
  object: object,
) => key is keyof typeof object
```

### 參數

| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `key` | `string \| number \| symbol` | 必填 | 要檢查的鍵 |
| `object` | `object` | 必填 | 要檢查的物件 |

### 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| 回傳值 | `key is keyof typeof object` | `key in object` 的結果 |

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
| 型別收窄 | 收窄結果是 `never`；取值不會報錯，但取得的值型別也是 `never` |

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useIsValidKey.ts | [app/composables/useIsValidKey.ts](../../../../app/composables/useIsValidKey.ts) |

[useIsValidKey.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

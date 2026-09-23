# useFloat

## Summary

useFloat 提供避免 JavaScript 浮點誤差的數值運算，目前只有加法 plus：把兩個數放大成整數後相加再縮回，回傳 computed，讓 0.1 + 0.2 得到 0.3。兩個參數都可以是 ref，值變動時結果自動重算。

## 介面

### 簽章

```ts
const useFloat: () => {
  plus: (
    value1Ref: MaybeRef<number>,
    value2Ref: MaybeRef<number>,
  ) => ComputedRef<number>
}
```

### 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `plus` | `(value1Ref, value2Ref) => ComputedRef<number>` | 兩數相加，回傳避免浮點誤差的 computed |

來源：1. [useFloat.ts][]

## 用法

```ts
const { plus } = useFloat()
const sum = plus(0.1, 0.2) // sum.value === 0.3
```

## 規則

計算步驟：

1. 以字串形式找出兩數小數點後的長度，取較大者。
2. 縮放倍數為 10 的「小數位數加一」次方。
3. 兩數各乘上倍數後相加，四捨五入成整數。
4. 除以倍數得到結果。

| 規則 | 說明 |
| --- | --- |
| 整數相加 | 倍數為 1，直接相加 |
| 科學記號 | 以字串找小數點，極小或極大的數轉成科學記號時不保證精度 |

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useFloat.ts | [app/composables/useFloat.ts](../../../../app/composables/useFloat.ts) |

[useFloat.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

# useFloat

> 提供避免浮點誤差的數值運算工具，目前包含加法。

## 簽章
```ts
useFloat(): {
  plus: (
    value1Ref: MaybeRef<number>,
    value2Ref: MaybeRef<number>
  ) => ComputedRef<number>
}
```

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `plus` | `(value1Ref: MaybeRef<number>, value2Ref: MaybeRef<number>) => ComputedRef<number>` | 依兩數的小數位數放大後相加再還原，回傳 `computed` 結果以避免浮點誤差。 |

## 用法
```ts
const { plus } = useFloat()
const sum = plus(0.1, 0.2) // sum.value === 0.3
```

## 備註
- `plus` 會依兩個值的小數位數取較大者作為縮放倍數（`10 ^ fixedSize`）。

---
[🏠 Wiki](../index.md)

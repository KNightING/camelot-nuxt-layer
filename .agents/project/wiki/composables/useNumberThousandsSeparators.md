# useNumberThousandsSeparator

> 提供將數字格式化為含千分位分隔符字串的 `format` 方法。

## 簽章
```ts
const useNumberThousandsSeparator: () => {
  format: (value: number | bigint) => string
}
```

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `format` | `(value: number \| bigint) => string` | 以 `value.toLocaleString()` 回傳含千分位的字串。 |

## 用法
```ts
const { format } = useNumberThousandsSeparator()
format(1234567) // '1,234,567'
```

## 備註
- 檔案標註為 client only supports。
- 目前 `format` 實作為 `value.toLocaleString()`；基於 `Intl.NumberFormat` 的實作在原始碼中為註解狀態，尚未啟用。

---
[🏠 Wiki](../index.md)

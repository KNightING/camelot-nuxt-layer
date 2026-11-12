# 千分位格式化

## Summary

useNumberThousandsSeparator（檔名為複數 useNumberThousandsSeparators）提供 format 方法，把數字轉成帶千分位分隔符號的字串。實作直接呼叫 toLocaleString，分隔符號與小數處理跟著執行環境的預設語系，因此只適合在瀏覽器端使用。

## 介面

### 簽章

```ts
const useNumberThousandsSeparator: () => {
  format: (value: number | bigint) => string
}
```

### 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `format` | `(value: number \| bigint) => string` | 回傳 `value.toLocaleString()` 的結果 |

來源：1. [useNumberThousandsSeparators.ts](../../../../app/composables/useNumberThousandsSeparators.ts)

## 用法

```ts
const { format } = useNumberThousandsSeparator()
format(1234567) // '1,234,567'（預設語系為 en、zh-TW 時）
```

## 規則

| 規則 | 說明 |
| --- | --- |
| 語系 | 不指定語系，跟著執行環境；伺服端與瀏覽器語系不同時輸出會不一致 |
| 小數 | 依 `toLocaleString` 預設，最多保留 3 位小數 |

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

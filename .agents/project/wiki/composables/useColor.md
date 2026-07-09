# useColor

> 回傳一個顏色工具單例，提供 Hex 驗證、轉換與明暗調整等方法。

## 簽章
```ts
useColor(): ColorUtil
```

## 回傳
回傳共用的 `ColorUtil` 單例，包含下列方法：

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `isCorrectHex` | `(hex: string) => boolean` | 檢查是否為合法 Hex（支援 3/4/6/8 碼，可含或不含 `#`）。 |
| `toFullHex` | `(hex: string \| undefined) => string \| undefined` | 將 Hex 補齊為 8 碼 `#RRGGBBAA`；無效時回傳 `undefined`。 |
| `hexToRgbaArray` | `(hex: string \| undefined) => number[] \| undefined` | 轉為 `[r, g, b, a]` 陣列，`a` 為 0~1；無效時回傳 `undefined`。 |
| `hexToRgba` | `(hex: string \| undefined, alpha?: number) => string \| undefined` | 轉為 `rgba(...)` 字串，`alpha` 範圍 0~1；無效時回傳 `undefined`。 |
| `shade` | `(hex: string \| undefined, amt: number) => string \| undefined` | 對 RGB 各通道加上 `amt`（可負）調整明暗，回傳 Hex。 |
| `lightness` | `(hex: string \| undefined) => string \| undefined` | 等同 `shade(hex, 40)`，提亮。 |
| `darkness` | `(hex: string \| undefined) => string \| undefined` | 等同 `shade(hex, -40)`，變暗。 |

## 用法
```ts
const color = useColor()
color.toFullHex('#abc')        // '#AABBCCFF'
color.hexToRgba('#ff0000', 0.5) // 'rgba(255,0,0, 0.5)'
color.lightness('#336699')
```

## 備註
- `useColor()` 每次呼叫皆回傳同一個 `colorUtil` 單例。
- `isCorrectHex` 接受 3、4、6、8 碼十六進位。
- `shade` 各通道值會夾在 0~255 之間，並保留原本的 alpha 段。

---
[🏠 Wiki](../index.md)

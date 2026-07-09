# useCanvasConvert

> 將 `HTMLCanvasElement` 轉換為 Blob 或 Data URL。

## 簽章
```ts
useCanvasConvert(canvasRef: MaybeRefOrGetter<HTMLCanvasElement>): {
  toBlob: () => Promise<Blob | null>
  toDataURL: (type?: string, quality?: any) => string
}
```

## 參數
| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `canvasRef` | `MaybeRefOrGetter<HTMLCanvasElement>` | — | 目標 canvas 元素，內部以 `computed` 解析其值。 |

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `toBlob` | `() => Promise<Blob \| null>` | 以 Promise 包裝 `canvas.toBlob`，回傳 Blob（或 `null`）。 |
| `toDataURL` | `(type?: string, quality?: any) => string` | 呼叫 `canvas.toDataURL(type, quality)` 回傳 Data URL 字串。 |

## 用法
```ts
const { toBlob, toDataURL } = useCanvasConvert(canvasEl)
const blob = await toBlob()
const dataUrl = toDataURL('image/png', 0.9)
```

## 備註
- `toBlob`、`toDataURL` 每次呼叫都會取用最新的 `canvas.value`。

---
[🏠 Wiki](../index.md)

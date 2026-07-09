# useLazyImage

> 以程式方式預載入圖片，並提供載入中／完成／錯誤等響應式狀態。

## 簽章
```ts
useLazyImage(
  src: MaybeRefOrGetter<string | undefined>,
  options?: LazyImageOptions,
): {
  isLoading: Ref<boolean>
  isError: Ref<boolean>
  isReady: Ref<boolean>
  isPending: Ref<boolean>
  load: () => void
  image: Ref<HTMLImageElement | null>
  isLandscapeImage: ComputedRef<boolean>
}

interface LazyImageOptions {
  immediate?: boolean
}
```

## 參數
| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `src` | `MaybeRefOrGetter<string \| undefined>` | — | 圖片來源網址。呼叫 `load()` 時以 `toValue` 取值。 |
| `options.immediate` | `boolean` | `undefined` | 為 `true` 時建立後立即呼叫 `load()`。 |

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `isLoading` | `Ref<boolean>` | 是否載入中，初始為 `true`。 |
| `isError` | `Ref<boolean>` | 是否載入失敗（`onerror`）。 |
| `isReady` | `Ref<boolean>` | 是否已載入完成（`onload`）。 |
| `isPending` | `Ref<boolean>` | 是否等待中（呼叫 `load()` 後、完成或失敗前）。 |
| `load` | `() => void` | 重設狀態並開始載入圖片；`src` 為空時直接返回。 |
| `image` | `Ref<HTMLImageElement \| null>` | 載入完成後的 `HTMLImageElement`。 |
| `isLandscapeImage` | `ComputedRef<boolean>` | 圖片寬大於高時為 `true`，否則為 `false`。 |

## 用法
```ts
const { isReady, isError, image, load } = useLazyImage(() => user.avatarUrl)
load()
```

## 備註
- `load()` 內部建立 `new Image()` 並設定 `onload` / `onerror`；使用 `Image` 建構子，僅能在瀏覽器環境呼叫。
- 開始載入時會先將 `image` 清為 `null`，並重設 `isLoading=true`、`isPending=true`、`isError=false`、`isReady=false`。

---
[🏠 Wiki](../index.md)

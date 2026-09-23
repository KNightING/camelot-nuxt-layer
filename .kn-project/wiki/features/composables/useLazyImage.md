# useLazyImage

## Summary

useLazyImage 以程式建立 Image 物件預載入圖片，提供載入中、完成、失敗等響應式狀態，以及載入完成後的圖片元素與是否為橫向圖。預設不自動載入，呼叫 load 才開始；只能在瀏覽器端使用。

## 介面

### 簽章

```ts
const useLazyImage: (
  src: MaybeRefOrGetter<string | undefined>,
  options?: LazyImageOptions,
) => {
  isLoading: Ref<boolean>
  isError: Ref<boolean>
  isReady: Ref<boolean>
  isPending: Ref<boolean>
  load: () => void
  image: Ref<HTMLImageElement | null>
  isLandscapeImage: ComputedRef<boolean>
}

export interface LazyImageOptions {
  immediate?: boolean
}
```

### 參數

| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `src` | `MaybeRefOrGetter<string \| undefined>` | 必填 | 圖片網址，呼叫 `load` 時才取值 |
| `options.immediate` | `boolean` | — | 為 `true` 時建立後立即呼叫 `load` |

### 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `isLoading` | `Ref<boolean>` | 是否載入中，初始為 `true` |
| `isPending` | `Ref<boolean>` | 是否等待中，初始為 `false`，呼叫 `load` 後變 `true` |
| `isReady` | `Ref<boolean>` | 是否載入完成 |
| `isError` | `Ref<boolean>` | 是否載入失敗 |
| `load` | `() => void` | 重設狀態並開始載入 |
| `image` | `Ref<HTMLImageElement \| null>` | 載入完成後的圖片元素 |
| `isLandscapeImage` | `ComputedRef<boolean>` | 圖片寬大於高時為 `true`；尚未載入時為 `false` |

來源：1. [useLazyImage.ts][]

## 用法

```ts
const { isReady, isError, image, load } = useLazyImage(() => user.avatarUrl)
load()
```

## 運作方式

1. `load` 先把 `isLoading`、`isPending` 設為 `true`，`isError`、`isReady` 設為 `false`。
2. 網址為空時直接結束，狀態停在載入中與等待中。
3. 網址有值時清空 `image`，建立新的 Image 並設定網址。
4. 載入成功：`isReady` 為 `true`，存入 `image`，結束載入中與等待中。
5. 載入失敗：`isError` 為 `true`，結束載入中與等待中。

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useLazyImage.ts | [app/composables/useLazyImage.ts](../../../../app/composables/useLazyImage.ts) |

[useLazyImage.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

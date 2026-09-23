# useCanvasConvert

## Summary

`useCanvasConvert(canvas)` 把一個 canvas 元素轉成 Blob 或 Data URL。回傳的兩個函式每次呼叫都取用當下的 canvas，canvas 可用 ref 或 getter 傳入。

## 運作方式

1. 以 computed 解析傳入的 canvas。
2. toBlob 以 Promise 包裝 canvas 的 toBlob，可指定格式與品質，未指定時輸出 PNG；無法產生時為 `null`。
3. toDataURL 直接轉呼叫 canvas 的 toDataURL，可指定格式與品質。

來源：1. [useCanvasConvert.ts][]

## 用法

```ts
const { toBlob, toDataURL } = useCanvasConvert(canvasEl)
const blob = await toBlob('image/webp', 0.8)
const dataUrl = toDataURL('image/jpeg', 0.9)
```

## 簽章

```ts
useCanvasConvert(canvasRef: MaybeRefOrGetter<HTMLCanvasElement>): {
  toBlob: (type?: string, quality?: number) => Promise<Blob | null>
  toDataURL: (type?: string, quality?: any) => string
}
```

## 參數

| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `canvasRef` | `MaybeRefOrGetter<HTMLCanvasElement>` | — | 目標 canvas 元素 |

## 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `toBlob` | `(type?, quality?) => Promise<Blob \| null>` | 轉成 Blob，未指定格式時為 PNG |
| `toDataURL` | `(type?, quality?) => string` | 轉成 Data URL 字串 |

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231702-fix-wiki-review-code-defects](../../../archive/2609231702-fix-wiki-review-code-defects.md) | 修正程式碼缺陷後更新為修正後的行為 | [#47](https://github.com/KNightING/camelot-nuxt-layer/issues/47) | — |
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useCanvasConvert.ts | [app/composables/useCanvasConvert.ts](../../../../app/composables/useCanvasConvert.ts) |

[useCanvasConvert.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

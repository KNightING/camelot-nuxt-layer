# useColor

## Summary

`useColor()` 回傳全站共用的顏色工具單例，提供 Hex 驗證、補齊、轉 RGBA 與調整明暗等方法。Hex 可寫 3、4、6、8 碼，可含或不含井號。

## 運作方式

1. 所有轉換都先補齊成 8 碼 Hex：3、4 碼逐字元加倍，6 碼補上 FF 透明度。
2. 輸入為空或不是合法 Hex 時回傳 `undefined`。
3. 補齊時保留輸入的大小寫，只有補上的透明度固定為大寫 FF。
4. 調整明暗時，紅、綠、藍各通道加上位移量並夾在 0 到 255，透明度段原樣保留。

| 注意事項 | 說明 |
| --- | --- |
| 陣列的透明度 | 換算成 0 到 1 後無條件捨去到小數一位 |
| hexToRgba 未傳 alpha | 會把已是 0 到 1 的透明度再除一次 255，結果恆為 0；需要不透明時請明確傳入 1 |
| 調整後的大小寫 | 紅綠藍三段輸出小寫 |

來源：1. [useColor.ts][]

## 用法

```ts
const color = useColor()
color.toFullHex('#abc')         // '#aabbccFF'
color.hexToRgba('#ff0000', 0.5) // 'rgba(255,0,0, 0.5)'
color.lightness('#336699')      // '#5b8ec1FF'
```

## 簽章

```ts
useColor(): ColorUtil

type CamelotRgbaTuple = [number, number, number, number]
```

## 回傳

共用的 `ColorUtil` 實例，包含下列方法：

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `isCorrectHex` | `(hex: string) => boolean` | 是否為合法的 3、4、6、8 碼 Hex |
| `toFullHex` | `(hex: string \| undefined) => string \| undefined` | 補齊為井號開頭的 8 碼 Hex |
| `hexToRgbaArray` | `(hex: string \| undefined) => CamelotRgbaTuple \| undefined` | 轉成紅、綠、藍 0 到 255 與透明度 0 到 1 的陣列 |
| `hexToRgba` | `(hex: string \| undefined, alpha?: number) => string \| undefined` | 轉成 rgba 字串，alpha 範圍 0 到 1 |
| `shade` | `(hex: string \| undefined, amt: number) => string \| undefined` | 各通道加上 amt 調整明暗，amt 可為負 |
| `lightness` | `(hex: string \| undefined) => string \| undefined` | 等同 shade 加 40 |
| `darkness` | `(hex: string \| undefined) => string \| undefined` | 等同 shade 減 40 |

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useColor.ts | [app/composables/useColor.ts](../../../../app/composables/useColor.ts) |

[useColor.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

# useAutoLink

## Summary

`useAutoLink(text, options)` 把純文字中的網址、Email 與電話號碼轉成 `<a>` 超連結，回傳隨輸入更新的 HTML 字串 computed；三種轉換可各自停用。結果需以 `v-html` 渲染，而輸入文字不會做 HTML 跳脫。

## 運作方式

1. 依序套用網址、Email、電話三段替換。
2. 每一段都作用在前一段的輸出上，包含前段產生的標籤屬性。
3. 任一段停用時直接略過該段。

| 類型 | 比對條件 | 產出 |
| --- | --- | --- |
| 網址 | http、https、ftp、file 協定開頭，或 www. 開頭 | 新分頁開啟，加上 noopener 與 noreferrer；www. 開頭時補上 http 協定 |
| Email | 一般 Email 格式 | mailto 連結 |
| 電話 | 數字與橫線、空白、括號的簡化組合 | tel 連結；號碼移除分隔符號後少於 7 碼則不轉換 |

來源：1. [useAutoLink.ts][]

## 用法

```ts
const html = useAutoLink(() => props.text, { disabledPhone: true })
```

```vue
<p v-html="html" />
```

來源：1. [useAutoLink.ts][]

## 簽章

```ts
useAutoLink(
  textRef: MaybeRefOrGetter<string | undefined>,
  options?: MaybeRef<AutoLinkOptions>
): ComputedRef<string>

type AutoLinkOptions = {
  disabledUrl?: boolean
  disabledEmail?: boolean
  disabledPhone?: boolean
}
```

## 參數

| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `textRef` | `MaybeRefOrGetter<string \| undefined>` | — | 原始文字；為 `undefined` 時回傳空字串 |
| `options` | `MaybeRef<AutoLinkOptions>` | `undefined` | 各類轉換的停用開關 |
| `options.disabledUrl` | `boolean` | `false` | 不轉換網址 |
| `options.disabledEmail` | `boolean` | `false` | 不轉換 Email |
| `options.disabledPhone` | `boolean` | `false` | 不轉換電話號碼 |

## 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| （回傳值） | `ComputedRef<string>` | 已把符合內容替換成超連結的 HTML 字串 |

## 注意事項

| 情況 | 說明 |
| --- | --- |
| 使用者輸入 | 文字不做跳脫，含 HTML 的輸入會原樣渲染；不可信內容需先跳脫 |
| 網址含長數字 | 電話規則會再比對到網址裡 7 碼以上的數字，必要時停用電話轉換 |
| 電話格式 | 規則為簡化版，年份、編號等數字串可能被誤判 |

來源：1. [useAutoLink.ts][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useAutoLink.ts | [app/composables/useAutoLink.ts](../../../../app/composables/useAutoLink.ts) |

[useAutoLink.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

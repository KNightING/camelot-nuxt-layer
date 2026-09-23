# useAutoLink

## Summary

`useAutoLink(text, options)` 把純文字中的網址、Email 與電話號碼轉成 `<a>` 超連結，回傳隨輸入更新的 HTML 字串 computed；三種轉換可各自停用。結果需以 `v-html` 渲染，非連結的文字一律先做 HTML 跳脫。

## 運作方式

1. 把未停用的規則合成一條正則，在原始文字上一次掃描。
2. 同一位置同時符合多條規則時，優先序是網址、Email、電話。
3. 比對到的片段轉成連結，已轉成連結的片段不會再被其他規則改寫。
4. 連結以外的文字一律做 HTML 跳脫；三種規則都停用時，回傳整段跳脫後的文字。
5. 停用某個規則時，其餘規則照常生效。

| 類型 | 比對條件 | 產出 |
| --- | --- | --- |
| 網址 | http、https、ftp、file 協定開頭，或 www. 開頭 | 新分頁開啟，加上 noopener 與 noreferrer；www. 開頭時補上 http 協定 |
| Email | 一般 Email 格式 | mailto 連結 |
| 電話 | 數字與橫線、點、空白、括號的簡化組合 | tel 連結；移除分隔符號後至少 7 碼才轉換，未達時保留原文 |

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
| 使用者輸入 | 文字會先跳脫，含 HTML 的輸入以純文字顯示 |
| 網址含長數字 | 網址整段轉成連結，其中的數字不會再被當成電話 |
| 電話格式 | 規則為簡化版，7 碼以上的編號等數字串仍可能被誤判 |

來源：1. [useAutoLink.ts][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231702-fix-wiki-review-code-defects](../../../archive/2609231702-fix-wiki-review-code-defects.md) | 修正程式碼缺陷後更新為修正後的行為 | [#47](https://github.com/KNightING/camelot-nuxt-layer/issues/47) | — |
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useAutoLink.ts | [app/composables/useAutoLink.ts](../../../../app/composables/useAutoLink.ts) |

[useAutoLink.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

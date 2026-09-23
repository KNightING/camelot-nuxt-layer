# useLocale

## Summary

useLocale 把輸入的語系字串標準化，衍生出 BCP 47、CLDR、l10n 三種語言標籤。輸入可為 zh-TW 這類 BCP 47 格式，或 zh-Hant-TW、zh_Hant_TW 這類帶 script 的格式；三個結果都是 computed，輸入是 ref 或 getter 時會跟著變。

## 介面

### 簽章

```ts
const useLocale: (
  locale: MaybeRefOrGetter<string | undefined>,
) => {
  bcp47: ComputedRef<string | undefined>
  cldr: ComputedRef<string | undefined>
  l10n: ComputedRef<string | undefined>
}
```

### 參數

| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `locale` | `MaybeRefOrGetter<string \| undefined>` | 必填 | 原始語系字串，連字號或底線分隔皆可 |

### 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `bcp47` | `ComputedRef<string \| undefined>` | BCP 47 格式，如 `en-US`、`zh-TW`；由 CLDR 結果或標準化值移除 script 子標籤而得 |
| `cldr` | `ComputedRef<string \| undefined>` | CLDR 格式，如 `zh-Hant-TW`；不在對照表內且未自帶 script 時為 `undefined` |
| `l10n` | `ComputedRef<string \| undefined>` | 優先 `cldr`，其次 `bcp47`，最後原始字串 |

來源：1. [useLocale.ts][]

## 用法

```ts
const { bcp47, cldr, l10n } = useLocale(() => 'zh-CN')
// bcp47.value === 'zh-CN'
// cldr.value  === 'zh-Hans-CN'
// l10n.value  === 'zh-Hans-CN'
```

## 運作方式

1. 底線換成連字號，逐段標準化大小寫：語言碼小寫、script 首字大寫、region 大寫。
2. 標準化後若已帶 script 子標籤，直接作為 CLDR 結果。
3. 否則查對照表補上 script；查不到時 CLDR 為 `undefined`。
4. BCP 47 取 CLDR 結果或標準化值，移除 script 子標籤。

| 規則 | 說明 |
| --- | --- |
| script 子標籤 | 4 個英文字母，如 `Hant`、`Latn` |
| region 子標籤 | 2 個英文字母或 3 個數字，如 `TW`、`001` |
| 對照表涵蓋 | 中文、塞爾維亞文、烏茲別克文、亞塞拜然文、哈薩克文、蒙古文、庫德文、旁遮普文、信德文、塔吉克文、韃靼文 |
| 空輸入 | 三個結果都是 `undefined` |

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useLocale.ts | [app/composables/useLocale.ts](../../../../app/composables/useLocale.ts) |

[useLocale.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)

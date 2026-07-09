# useLocale

> 將輸入 locale 標準化，並衍生 bcp47、cldr、l10n 三種語言標籤格式。

## 簽章
```ts
useLocale(
  locale: MaybeRefOrGetter<string | undefined>,
): {
  bcp47: ComputedRef<string | undefined>
  cldr: ComputedRef<string | undefined>
  l10n: ComputedRef<string | undefined>
}
```

## 參數
| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `locale` | `MaybeRefOrGetter<string \| undefined>` | — | 原始 locale，可為 bcp47（`zh-TW`）或 cldr（`zh-Hant-TW`、`zh_Hant_TW`）格式。 |

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `bcp47` | `ComputedRef<string \| undefined>` | BCP 47 格式（如 `en-US`、`zh-TW`），由 cldr（若有）反推：移除 script 子標籤、保留 region。 |
| `cldr` | `ComputedRef<string \| undefined>` | CLDR 格式（如 `zh-Hant-TW`），為缺少 script 的常見語言補上完整 `lang-Script-Region`；已自帶 script 者保留，不在對照表內者為 `undefined`。 |
| `l10n` | `ComputedRef<string \| undefined>` | 優先 `cldr`，否則 `bcp47`，再否則原始 locale。 |

## 用法
```ts
const { bcp47, cldr, l10n } = useLocale(() => 'zh-CN')
// bcp47.value === 'zh-CN'
// cldr.value  === 'zh-Hans-CN'
// l10n.value  === 'zh-Hans-CN'
```

## 備註
- 內部先將原始 locale 以 `-` 連接並依 BCP 47 慣例標準化大小寫（語言碼小寫、script 首字大寫、region 大寫）作為共同基礎（`canonical`）。
- 需要補 script 的語言由 `CLDR_LOCALE_MAP` 定義，涵蓋中文、塞爾維亞文、烏茲別克文、亞塞拜然文、哈薩克文、蒙古文、庫德文、旁遮普文、信德文、塔吉克文、韃靼文等。

---
[🏠 Wiki](../index.md)

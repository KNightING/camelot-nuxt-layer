# Plan: 2606261225 - useLocale 補完 cldr 與 l10n

- Created: 2026-06-26 12:25
- Archived: 2026-06-26 13:09
- Branch: feature/2606261225-use-locale-cldr-l10n
- Status: Archived
- Affected: `app/composables/useLocale.ts`

## Goals
補完 `app/composables/useLocale.ts`,讓單一 locale 字串(**輸入可為 bcp47 或 cldr 格式**)可正規化為三種國際化格式表示:

1. **`bcp47`** — 正規化 `_`→`-` 後**移除 script 子標籤**(保留 region),如 `zh-Hant-TW`/`zh_Hant_TW` → `zh-TW`。
2. **`cldr`** — 僅針對「需要補 script 的常見語言」確保帶有 script 子標籤,**一律使用 `-` 連接**;已含 script 則保留;非清單內語言回 `undefined`。
3. **`l10n`** — fallback 鏈 `cldr ?? bcp47 ?? localeValue`。

## 設計演進(逐次 Iteration)
- v1:cldr 用「default script + region 覆寫」演算法插入,bcp47 僅換分隔符。
- v2:輸入格式不限(bcp47/cldr 皆可)→ `cldr`/`bcp47` 改各自從原始 locale 推導,bcp47 改為移除 script(可由 cldr 反推)。
- v3:改用使用者提供之 **flat 對照表** `CLDR_LOCALE_MAP`(locale → 完整 `lang-Script-Region`);bcp47 反推語意定為「由 `cldr ?? canonical` 去 script」。
- 最終決策:**移除所有裸語言碼 key**(`zh`/`sr`/`uz`…),只保留帶 region 者,使裸碼行為與非清單語言(`en`)一致。

## 最終實作
### 共用解析
- `canonical` = 原始 locale `_`→`-`(`/_/g`,修正原 `.replace` 只換首個的 bug)+ BCP47 casing 標準化(lang 小寫、script Title、region 大寫)。`bcp47` 與 `cldr` 皆基於此。
- `isScriptSubtag` `^[A-Za-z]{4}$`;`isRegionSubtag` `^([A-Za-z]{2}|\d{3})$`。

### cldr(直接查表)
1. `canonical` undefined → undefined。
2. 已自帶 script 子標籤(`zh-Hant-TW`、`zh-Hant`)→ 回 `canonical`(保留)。
3. 否則 `CLDR_LOCALE_MAP[canonical] ?? undefined`。

### bcp47(由 cldr 反推、去 script)
- `tag = cldr ?? canonical`;保留 index 0,`slice(1)` 濾掉 script,`join('-')`。

### CLDR_LOCALE_MAP(僅帶 region 的 key,11 語言)
zh / sr / uz / az / kk / mn / ku / pa / sd / tg / tt。例:`zh-CN`→`zh-Hans-CN`、`zh-TW`→`zh-Hant-TW`、`sr-ME`→`sr-Latn-ME`、`mn-CN`→`mn-Mong-CN`、`uz-AF`→`uz-Arab-AF`、`pa-PK`→`pa-Arab-PK`。

### 行為範例
| 輸入 | bcp47 | cldr | l10n |
| :--- | :--- | :--- | :--- |
| `zh-TW` / `zh-Hant-TW` / `zh_Hant_TW` / `ZH-tw` | `zh-TW` | `zh-Hant-TW` | `zh-Hant-TW` |
| `zh-CN` | `zh-CN` | `zh-Hans-CN` | `zh-Hans-CN` |
| `zh`(裸碼) | `zh` | `undefined` | `zh` |
| `zh-Hant`(僅 script) | `zh` | `zh-Hant` | `zh-Hant` |
| `en-US` | `en-US` | `undefined` | `en-US` |
| `undefined` | `undefined` | `undefined` | `undefined` |

## 代碼規範遵循
- Auto-Imports 禁令:不手動 import `computed`/`toValue`/`MaybeRefOrGetter`。
- Guard Clauses:cldr/bcp47 解析皆 early return。
- 對照表為內聚 const(`Record<string, string>`),維持既有 composables 就地風格。

## 驗證
- ESLint `app/composables/useLocale.ts` → exit 0。
- 邏輯驗證:裸碼 / 帶 region / 雙向輸入(bcp47⇄cldr)/ 大小寫不敏感 / `_`·`-` 混用 案例全數正確。

## Tasks(完成)
- [x] 分析現況與意圖
- [x] 建立分支
- [x] `CLDR_LOCALE_MAP` flat 對照表
- [x] `canonical` 正規化 + casing
- [x] `cldr` 查表(保留既有 script)
- [x] `bcp47` 反推去 script
- [x] `l10n` fallback 鏈
- [x] 移除裸語言碼 key
- [x] ESLint + 邏輯驗證
- [x] Commit `f26cf35`

## References
- `app/composables/useLocale.ts` JSDoc(bcp47 / cldr / l10n 定義)
- 對照表資料來源:使用者提供之 CLDR locale → script/region 清單

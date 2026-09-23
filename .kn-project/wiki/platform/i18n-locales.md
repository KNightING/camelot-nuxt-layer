# i18n 語系系統

## Summary

本專案的多語系採 CLDR 區域代碼加上 vue-i18n 的 fallback 鏈，語系註冊與 fallback 設定全部由消費端負責：Layer 的 Nuxt 設定宣告 `locales: []`、`defaultLocale: undefined`，Layer 的 i18n 設定也不設 `fallbackLocale`。Layer 目錄下雖有 en 與 zh 兩份基底字典，但不會被註冊，消費端必須自帶完整詞條，fallback 鏈也只能指向自己註冊過的語系。

## 運作方式

### 分工原則

@nuxtjs/i18n 會合併各 layer 的 `locales` 與 vueI18n 設定，專案層優先。

| 層 | 職責 | 語系 |
| :--- | :--- | :--- |
| Layer | 只提供 `globalInjection`、`legacy` 等與語系無關的設定；不註冊語系、不設預設語系與 fallback | 無，實際註冊數為 0 |
| 消費端 | 註冊全部語系，含區域與語言基底；決定預設語系、提供完整詞條與自己的 fallback 鏈 | 以 playground 為例：zh-Hant-TW、zh-Hant-HK、zh-Hant-MO、zh-Hant、zh-Hans-CN、zh-Hans-SG、zh-Hans-MY、zh-Hans、en-US |

> [!IMPORTANT]
> 消費端不可假設 Layer 基底字典存在，fallback 鏈的終點詞條必須自己備齊。
> fallback 目標必須是已註冊的語系：指向未註冊語系的鏈在執行期不成立，`nuxt typecheck` 也會報型別錯誤。

來源：1. [nuxt.config.ts][]　2. [i18n/i18n.config.ts][]　3. [.playground/nuxt.config.ts][]

### Fallback 鏈

這張圖回答：playground 的某個語系缺 key 時，會依序退回哪個語系？

```json diagram id=圖1
{
  "type": "flow",
  "dir": "LR",
  "title": "playground fallback 鏈",
  "desc": "區域語系先退回繁或簡通用基底，未命中時由 default 退回 zh-Hant-TW",
  "nodes": [
    {"id": "HK", "text": "zh-Hant-HK"},
    {"id": "MO", "text": "zh-Hant-MO"},
    {"id": "Hant", "text": "zh-Hant", "kind": "data"},
    {"id": "CN", "text": "zh-Hans-CN"},
    {"id": "SG", "text": "zh-Hans-SG"},
    {"id": "MY", "text": "zh-Hans-MY"},
    {"id": "Hans", "text": "zh-Hans", "kind": "data"},
    {"id": "ENUS", "text": "en-US"},
    {"id": "TW", "text": "zh-Hant-TW", "key": true}
  ],
  "edges": [
    {"from": "HK", "to": "Hant"},
    {"from": "MO", "to": "Hant"},
    {"from": "TW", "to": "Hant", "label": "區域覆寫"},
    {"from": "CN", "to": "Hans"},
    {"from": "SG", "to": "Hans"},
    {"from": "MY", "to": "Hans"},
    {"from": "Hans", "to": "TW", "label": "default", "kind": "retry"},
    {"from": "ENUS", "to": "TW", "label": "default", "kind": "retry"}
  ]
}
```

![playground fallback 鏈](i18n-locales.圖1.svg)

| 規則 | 說明 |
| :--- | :--- |
| 一語系一檔 | 每個 locale 對應單一字典檔，fallback 由 vue-i18n 在執行期解析，不是合併檔案 |
| 區域覆寫檔只放差異 | 例如 zh-Hant-TW 只有 login 一個 key，其餘 key 逐層退回 |
| 完整字典 | 繁體在 zh-Hant、簡體在 zh-Hans，都由消費端提供 |
| 最終兜底 | `default` 指向 zh-Hant-TW；鏈中不出現 zh 與 en，那兩碼未註冊，指過去不會生效 |

playground 的 fallback 設定：

```ts
fallbackLocale: {
  'zh-Hant-TW': ['zh-Hant'],
  'zh-Hant-HK': ['zh-Hant'],
  'zh-Hant-MO': ['zh-Hant'],
  'zh-Hans-CN': ['zh-Hans'],
  'zh-Hans-SG': ['zh-Hans'],
  'zh-Hans-MY': ['zh-Hans'],
  'default': ['zh-Hant-TW'],
}
```

Layer 的 i18n 設定不設 `fallbackLocale`：Layer 不註冊語系，無從得知消費端會註冊哪些，也就無法指定落點。

來源：1. [.playground/i18n/i18n.config.ts][]　2. [zh-Hant-TW.json][]　3. [i18n/i18n.config.ts][]

## 已知缺陷

### Layer 基底字典永不註冊

Layer 的 en 與 zh 兩份字典存在，但不會進入任何消費端的語系表。成因是 @nuxtjs/i18n 跨 layer 合併的兩個限制：

| 機制 | 後果 |
| :--- | :--- |
| `mergeConfigLocales` 逐 config 迭代各自的 locales，以語系代碼為鍵累積字典檔 | Layer 宣告空陣列，不貢獻任何代碼，兩份字典永不進入合併結果 |
| `resolveRelativeLocales` 以該 config 自己的 langDir 解析字典路徑 | 消費端想在自己的 files 疊加 Layer 字典時，路徑以消費端目錄解析，找不到檔案 |

這是 Layer 端缺陷，消費端無法繞過。

來源：1. [nuxt.config.ts][]　2. [en.json][]　3. [zh.json][]

### 因應與修法

| 項目 | 說明 |
| :--- | :--- |
| 現況因應 | 消費端自帶完整詞條，不依賴 Layer 基底字典；Layer 與 playground 的 fallback 鏈都不指向 zh 與 en |
| 修法 | 在 Layer 的 Nuxt 設定 `i18n.locales` 補上 zh 與 en 兩筆，各自指向同名字典檔 |
| 未修原因 | 修復會讓 zh 與 en 開始註冊，改變既有消費端的 fallback 鏈與語系選單，屬公開契約的行為變更，需獨立驗證 |
| 字典檔保留原因 | 以 zh 或 en 為語系代碼的消費端仍會取用 Layer 同名檔案 |

來源：1. [nuxt.config.ts][]

## 陷阱

1. 設定 `restructureDir` 為 i18n 後，vueI18n 設定檔的路徑以 i18n 目錄為基準；放在專案根目錄不會被載入，`nuxt prepare` 只給 WARN 就跳過。
2. 多 layer 合併後，fallback map 同 key 可能出現重複項，例如 en-US 對應兩個 en，無害。
3. `detectBrowserLanguage` 對 zh-TW 這類簡式代碼以語言前綴比對，取 locales 清單中第一個命中者。
4. 因此區域語系必須排在通用基底之前，否則初始語系會落在 zh-Hant 而非 zh-Hant-TW。
5. Nuxt 設定裡的 i18n 區塊不在 HMR 範圍，改動需重啟 dev server。

來源：1. [nuxt.config.ts][]　2. [.playground/nuxt.config.ts][]

## 相關頁面

- [useLocale](./locale.md)：語系格式正規化
- [Layer 整合與必裝依賴](../dev/layer-integration.md)
- [vue-i18n Fallbacking](https://vue-i18n.intlify.dev/guide/essentials/fallback.html)
- [@nuxtjs/i18n locales 選項](https://i18n.nuxtjs.org/docs/api/options#locales)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| nuxt.config.ts | [nuxt.config.ts](../../../nuxt.config.ts) |
| i18n/i18n.config.ts | [i18n/i18n.config.ts](../../../i18n/i18n.config.ts) |
| .playground/nuxt.config.ts | [.playground/nuxt.config.ts](../../../.playground/nuxt.config.ts) |
| .playground/i18n/i18n.config.ts | [.playground/i18n/i18n.config.ts](../../../.playground/i18n/i18n.config.ts) |
| zh-Hant-TW.json | [.playground/i18n/locales/zh-Hant-TW.json](../../../.playground/i18n/locales/zh-Hant-TW.json) |
| en.json | [i18n/locales/en.json](../../../i18n/locales/en.json) |
| zh.json | [i18n/locales/zh.json](../../../i18n/locales/zh.json) |

[nuxt.config.ts]: #references
[i18n/i18n.config.ts]: #references
[.playground/nuxt.config.ts]: #references
[.playground/i18n/i18n.config.ts]: #references
[zh-Hant-TW.json]: #references
[en.json]: #references
[zh.json]: #references

---
[⚙️ Env](../environment.md) | [🏠 Wiki](../index.md)

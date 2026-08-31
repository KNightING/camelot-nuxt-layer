# 🌐 i18n 語系系統(CLDR 代碼 + Fallback 鏈 + Layer/消費端分工)

## Summary

本專案的多語系採 CLDR 區域代碼 + vue-i18n fallback 鏈，語系註冊與 fallback 設定**全部由消費端負責**：Layer 的 `nuxt.config.ts` 宣告 `locales: []`、`defaultLocale: undefined`，其 `i18n.config.ts` 也不再設定 `fallbackLocale`。
Layer 目錄下雖有 `i18n/locales/{en,zh}.json` 基底字典，但**不會被註冊**（見下方「已知缺陷」），消費端必須自帶完整詞條，且 fallback 鏈只能指向自己註冊過的語系。

## 分工原則

@nuxtjs/i18n 會合併各 layer 的 `locales` 與 vueI18n 設定(專案層優先),因此:

| 層 | 職責 | 語系 |
| :--- | :--- | :--- |
| **Layer**(`i18n/`) | 只提供 `globalInjection` / `legacy` 等與語系無關的設定。`nuxt.config.ts` 的 `locales` 為**空陣列**、`defaultLocale` 為 `undefined`,不註冊任何語系,**也不設 `fallbackLocale`**。目錄下的 `en.json` / `zh.json` 因此**未生效**(見「已知缺陷」) | 無(實際註冊數為 0) |
| **消費端**(範例:`.playground/i18n/`) | 註冊**全部**語系(區域 + 語言基底)、決定 `defaultLocale`、提供完整詞條與自己的 fallback 鏈 | `zh-Hant-TW/HK/MO`、`zh-Hans-CN/SG/MY`、`zh-Hant`/`zh-Hans`、`en-US` 等 |

> [!IMPORTANT]
> 設計意圖是「Layer 提供 `en` / `zh` 語言層級基底,保證 fallback 終點存在」,但該意圖**目前未實現**。消費端不可假設基底字典存在,fallback 鏈的終點詞條必須自己備齊。
> **fallback 目標必須是已註冊的語系**——指向未註冊語系的鏈在執行期不成立(`availableLocales` 不含該碼),且 `nuxt typecheck` 會直接報型別錯誤。

## Fallback 鏈

```mermaid
graph LR
    subgraph 消費端註冊
        TW["zh-Hant-TW"] --> Hant["zh-Hant"]
        HK["zh-Hant-HK"] --> Hant
        MO["zh-Hant-MO"] --> Hant
        CN["zh-Hans-CN"] --> Hans["zh-Hans"]
        SG["zh-Hans-SG"] --> Hans
        MY["zh-Hans-MY"] --> Hans
        ENUS["en-US"]
    end
    subgraph 終點基底(須由消費端提供)
        Hant --> ZH["zh(繁體字典)"]
        Hans --> ZH
        ENUS --> EN["en"]
    end
```

- 每個 locale 對應**單一檔案**,fallback 由 vue-i18n 於執行期解析(非 `files` 合併)。
- 區域覆寫檔只放該地區的差異 key(如 `zh-Hant-TW.json` 只有 `login`),其餘 key 逐層退回。
- 簡體完整字典在消費端的 `zh-Hans.json`。鏈的終點 `zh` / `en` **也必須由消費端註冊**——Layer 同名檔案不會被載入。

## 關鍵設定

### Layer — `i18n/i18n.config.ts`

**不設 `fallbackLocale`**。Layer 宣告 `locales: []`,無從得知消費端會註冊哪些語系,也就無法指定 fallback 落點;只保留 `globalInjection` 與 `legacy` 設定。

### 消費端 — `.playground/i18n/i18n.config.ts`

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

區域語系退回繁／簡通用基底,終點由 `default` 兜底。**鏈中不出現 `zh` / `en`**——那兩碼未註冊,指過去不會生效。

## 已知缺陷:Layer 基底字典永不註冊

`i18n/locales/en.json` 與 `zh.json` 存在於 Layer,但**不會進入任何消費端的語系表**。

**成因**——@nuxtjs/i18n 的跨 layer 合併有兩個限制:

| 機制 | 位置 | 後果 |
| :--- | :--- | :--- |
| `mergeConfigLocales` 逐 config 迭代 `config.locales ?? []`,以 `locale.code` 為 Map 鍵累積 `files` | `node_modules/@nuxtjs/i18n/dist/module.mjs:232` | Layer 宣告 `locales: []` → 不貢獻任何 code → 兩份字典永不進入合併結果 |
| `resolveRelativeLocales` 以 `resolve(config.langDir, file.path)` 解析,`langDir` 取**該 config 自己的** | 同檔 `:226` | 消費端寫 `files: ['zh.json', ...]` 想疊加 Layer 字典時,路徑會以**消費端的** `langDir` 解析 → ENOENT |

**這是 Layer 端缺陷,消費端無法繞過。**

- **現況因應**:消費端自帶完整詞條,不依賴 Layer 基底字典;兩份 config 的 fallback 鏈皆已移除指向 `zh` / `en` 的死目標。
- **修法**:在 Layer 的 `nuxt.config.ts` 的 `i18n.locales` 補回 `{ code: 'zh', file: 'zh.json' }` 與 `{ code: 'en', file: 'en.json' }`。
- **未修原因**:修復會使 `zh` / `en` 突然開始註冊並改變既有消費端的 fallback 鏈與語系選單,屬公開契約的行為變更,需獨立驗證。詳見 `../../archive/2608190042-readme-refresh-and-wiki-links.md` 與 `../../archive/2608311144-shared-types-dom-decoupling.md`。
- **字典檔保留原因**:以 `zh` / `en` 為 locale code 的消費端仍會取用 Layer 同名檔案,故 `zh.json` / `en.json` 未刪除。

## 陷阱與實測結論

1. **`restructureDir: 'i18n'` 後,`vueI18n` 路徑以 `i18n/` 目錄為基準**——設定檔放專案根目錄不會被載入(`nuxt prepare` 只給 WARN 就跳過),`fallbackLocale` 形同虛設。
2. **多 layer 合併**:@nuxtjs/i18n 會合併各 layer 的 `locales` 與 vueI18n 設定(專案層優先);合併後 fallback map 同 key 可能出現重複項(如 `en-US: ['en','en']`),無害。
3. **瀏覽器偵測順序敏感**:`detectBrowserLanguage` 對 `zh-TW` 這類簡式代碼以語言前綴比對,取 locales **清單中第一個**命中者——區域語系必須排在通用基底之前,否則初始語系會落在 `zh-Hant` 而非 `zh-Hant-TW`。
4. **`nuxt.config.ts` 的 i18n 區塊不在 HMR 範圍**,改動需重啟 dev server。

## References

- [vue-i18n Fallbacking](https://vue-i18n.intlify.dev/guide/essentials/fallback.html)
- [@nuxtjs/i18n locales 選項](https://i18n.nuxtjs.org/docs/api/options#locales)
- 計畫歸檔:`../../archive/2607021527-i18n-cldr-locales-fallback.md`
- 缺陷紀錄:`../../archive/2608190042-readme-refresh-and-wiki-links.md`
- 死 fallback 目標移除:`../../archive/2608311144-shared-types-dom-decoupling.md`
- Layer 整合前提:[Layer 整合與必裝依賴](./layer-integration.md)
- 語系格式正規化 composable：[useLocale](./locale.md)

---

[🌐 useLocale](./locale.md) | [📦 Layer 整合](./layer-integration.md) | [🏠 Wiki](../index.md)

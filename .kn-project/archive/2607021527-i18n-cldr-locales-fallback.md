<!-- REMINDER: Relative Paths Only! -->
# Plan: 2607021527 - i18n 語系代碼改用 CLDR 格式並建立 fallback 鏈

- Created: 2026-07-02
- Branch: main(Iteration 1–3 經使用者核准直接於 main 修改;歸檔於 feature/2607021527-i18n-cldr-locales-fallback 發 PR)
- Status: Archived
- Completed: 2026-07-02 17:23

## Goals

1. 語系代碼由 BCP 47 簡式改為含 script 子標籤的 CLDR 格式:`zh-TW` → `zh-Hant-TW`。
2. 建立 vue-i18n `fallbackLocale` 鏈:區域語系 → 繁/簡通用基底 → 語言層級基底。
3. 補上繁體與簡體語系範例(TW/HK/MO、CN/SG/MY)。
4. (Iteration 3)Layer 僅保留語言層級 `en` / `zh`,區域語系下放 `.playground` 作為消費端範例。

## 最終架構

### Layer(隨套件發佈,`i18n.locales` 會被消費端繼承)

- `i18n/locales/`:僅 `en.json`、`zh.json`(繁體基底,完整字典)。
- `nuxt.config.ts`:locales 只註冊 `en` / `zh`(含 `language` 屬性),`defaultLocale: 'zh'`。
- `i18n/i18n.config.ts`:`fallbackLocale: { 'en-US': ['en'], 'default': ['zh'] }`、
  `globalInjection: true`、`legacy: false`。
  區域語系(`zh-Hant-TW` 等)靠 vue-i18n **隱含階層 fallback**(`zh-Hant-TW` → `zh-Hant` → `zh`)落回基底。

### Playground(消費端註冊區域語系的範例)

- `.playground/i18n/locales/`:`zh-Hant.json`(空)、`zh-Hant-TW.json`(覆寫 login)、
  `zh-Hant-HK/MO.json`(空)、`zh-Hans.json`(簡體完整字典)、`zh-Hans-CN/SG/MY.json`、
  `en-US.json`(空)、`ja-JP.json` / `ko-KR.json`(未啟用)。
- `.playground/nuxt.config.ts`:註冊九個區域/基底語系,`defaultLocale: 'zh-Hant-TW'`,
  **區域語系排在通用基底之前**(瀏覽器語系如 `zh-TW` 以語言前綴比對時取清單第一個命中者)。
- `.playground/i18n/i18n.config.ts`:完整 fallback 鏈,終點補 `'zh'`:
  `zh-Hant-TW/HK/MO` → `['zh-Hant', 'zh']`、`zh-Hans-CN/SG/MY` → `['zh-Hans', 'zh']`、
  `zh-Hant`/`zh-Hans` → `['zh']`、`en-US` → `['en']`、`default` → `['zh-Hant-TW']`。

## 關鍵發現(實測驗證)

1. **`restructureDir: 'i18n'` 之後 `vueI18n` 路徑以 `i18n/` 為基準**:原根目錄的 `i18n.config.ts`
   一直未被載入(`nuxt prepare` 警告 Skipping),`fallbackLocale` 等設定形同虛設;搬入 `i18n/` 後生效。
2. **@nuxtjs/i18n 會合併多 layer 的 `locales` 與 vueI18n 設定**(專案層優先):
   playground 實測 availableLocales 為 11 個(layer en/zh + playground 9 個),
   fallbackLocale 為兩層合併後的 map(同 key 兩層各貢獻一次,如 `en-US: ['en','en']`,無害)。
3. **瀏覽器語系偵測順序敏感**:`zh-TW` 前綴比對取 locales 清單第一個 `zh*`,
   區域語系必須排在通用基底前,否則初始語系會落在 `zh-Hant` 而非 `zh-Hant-TW`。
4. **`nuxt.config.ts` 的 i18n 變更不在 HMR 範圍**,需重啟 dev server 才生效。
5. **附帶修復**:移除 `@vuepic/vue-datepicker` 時發現 `date-fns` 僅為其傳遞依賴,
   但 Calendar/DateV2/TimeV2 等元件直接 import → 補為 package.json 正式依賴(^4.4.0)。

## Tasks

### Iteration 1(CLDR 代碼 + 繁簡範例)
- [x] 分析現況(locale 檔案、nuxt.config、i18n.config、useLocale 相容性)
- [x] `git mv` `zh-TW.json` → `zh-Hant.json`;新增 `zh-Hant-TW.json`、`zh-Hans.json`、`zh-Hans-CN.json`
- [x] 更新 nuxt.config locales / defaultLocale 與 i18n.config fallbackLocale 鏈
- [x] 補回 `date-fns` 直接依賴
- [x] playground 實測 fallback、瀏覽器偵測、無 missing key 警告

### Iteration 2(HK/MO/SG/MY)
- [x] 新增 `zh-Hant-HK` / `zh-Hant-MO` / `zh-Hans-SG` / `zh-Hans-MY`(空覆寫檔,直接 fallback 基底)
- [x] 驗證四個新語系 fallback 全數正確

### Iteration 3(Layer 瘦身)
- [x] Layer 語系縮減為 `en` / `zh`,`defaultLocale: 'zh'`
- [x] 區域語系與 ja/ko 檔搬移至 `.playground/i18n/`,建立 playground 自己的註冊與 fallback 鏈
- [x] 驗證多 layer locales / vueI18n 合併、初始語系 `zh-Hant-TW`、fallback 正確

## References

- [vue-i18n Fallbacking](https://vue-i18n.intlify.dev/guide/essentials/fallback.html)
- [@nuxtjs/i18n locales 設定](https://i18n.nuxtjs.org/docs/api/options#locales)
- 相關 Wiki:`../wiki/features/locale.md`(useLocale / CLDR 對照)
- 相關 commits:`1071deb`(deps)、`93414e6`(CLDR locales)、`c745530`(layer/playground 拆分)

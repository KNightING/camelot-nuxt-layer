# Tasks for 2607021527

- [x] 分析現況(locale 檔案、nuxt.config、i18n.config、useLocale 相容性)
- [x] `git mv` `zh-TW.json` → `zh-Hant.json`
- [x] 新增 `zh-Hant-TW.json`(區域覆寫範例)
- [x] 新增 `zh-Hans.json` / `zh-Hans-CN.json`(簡體基底 + 覆寫範例)
- [x] 更新 `nuxt.config.ts` locales / defaultLocale(區域語系排在通用基底前,瀏覽器偵測才會優先命中)
- [x] 更新 `i18n/i18n.config.ts` fallbackLocale 鏈
- [x] 補回 `date-fns` 直接依賴(原為 @vuepic/vue-datepicker 傳遞依賴,移除後 Calendar/DateV2 等解析失敗)
- [x] 更新 `.agents/project/project.md`、`wiki/index.md` 語系描述
- [x] 驗證:playground 實測 fallback、瀏覽器偵測、無 missing key 警告

## Iteration 2

- [x] 新增 `zh-Hant-HK` / `zh-Hant-MO` / `zh-Hans-SG` / `zh-Hans-MY`(空覆寫檔,直接 fallback 至 zh-Hant / zh-Hans)
- [x] nuxt.config locales 與 i18n.config fallbackLocale 同步更新
- [x] 驗證:四個新語系 fallback 全數正確

## Iteration 3

- [x] Layer 語系縮減為語言層級 en / zh(zh 為繁體基底),defaultLocale 改 `zh`
- [x] 區域語系(zh-Hant 系 TW/HK/MO、zh-Hans 系 CN/SG/MY、en-US、ja/ko 檔)搬移至 `.playground/i18n/`
- [x] playground 建立自己的 locales 註冊與 fallback 鏈(終點補 `zh`)
- [x] 驗證:多 layer locales 與 vueI18n 設定成功合併(11 語系、合併後 fallback map)、
      初始語系 zh-Hant-TW、各語系 fallback 正確、無 missing key 警告

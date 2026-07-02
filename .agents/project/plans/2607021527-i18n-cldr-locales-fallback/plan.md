<!-- REMINDER: Relative Paths Only! -->
# Plan: 2607021527 - i18n 語系代碼改用 CLDR 格式並建立 fallback 鏈

- Created: 2026-07-02
- Branch: main(經使用者核准直接於 main 修改)
- Status: Awaiting Archive

## Iteration 2(2026-07-02)

新增香港/澳門/新加坡/馬來西亞中文語系,覆寫檔為空物件、直接 fallback 至繁/簡基底:

| Locale | 名稱 | 檔案 | Fallback |
| :--- | :--- | :--- | :--- |
| `zh-Hant-HK` | 繁體中文（香港） | `zh-Hant-HK.json`(空) | → `zh-Hant` |
| `zh-Hant-MO` | 繁體中文（澳門） | `zh-Hant-MO.json`(空) | → `zh-Hant` |
| `zh-Hans-SG` | 简体中文（新加坡） | `zh-Hans-SG.json`(空) | → `zh-Hans` |
| `zh-Hans-MY` | 简体中文（马来西亚） | `zh-Hans-MY.json`(空) | → `zh-Hans` |
- Completed: [Wait for Finish]

## Goals

1. 語系代碼由 BCP 47 簡式改為含 script 子標籤的 CLDR 格式:`zh-TW` → `zh-Hant-TW`。
2. 建立 vue-i18n `fallbackLocale` 鏈:`zh-Hant-TW` → `zh-Hant`(繁體通用基底)→ default。
3. 至少補上繁體與簡體兩組語系範例:
   - 繁體:`zh-Hant`(通用基底)+ `zh-Hant-TW`(台灣區域覆寫)
   - 簡體:`zh-Hans`(通用基底)+ `zh-Hans-CN`(中國大陸區域覆寫)

## Architecture

### 語系檔(`i18n/locales/`)

| 檔案 | 角色 | 內容 |
| :--- | :--- | :--- |
| `zh-Hant.json` | 繁體通用基底(由現有 `zh-TW.json` 改名) | 完整 key:HelloWorld / echo / login |
| `zh-Hant-TW.json` | 台灣區域覆寫(新增) | 僅示範覆寫部分 key,其餘走 fallback 到 `zh-Hant` |
| `zh-Hans.json` | 簡體通用基底(新增) | 完整 key(簡體翻譯) |
| `zh-Hans-CN.json` | 中國大陸區域覆寫(新增) | 僅示範覆寫部分 key,其餘 fallback 到 `zh-Hans` |
| `en-US.json` | 不變 | — |
| `ja-JP.json` / `ko-KR.json` | 不變(對應 locale 目前為註解狀態) | — |

### `nuxt.config.ts` — `i18n.locales`

註冊 5 個 locale,每個 locale 各自對應單一檔案(fallback 由 vue-i18n 執行,而非 files 合併),
並補上 `language` 屬性供 SEO / 瀏覽器偵測使用:

```ts
locales: [
  { name: 'English', code: 'en-US', language: 'en-US', file: 'en-US.json' },
  { name: '正體中文', code: 'zh-Hant', language: 'zh-Hant', file: 'zh-Hant.json' },
  { name: '正體中文（台灣）', code: 'zh-Hant-TW', language: 'zh-Hant-TW', file: 'zh-Hant-TW.json' },
  { name: '简体中文', code: 'zh-Hans', language: 'zh-Hans', file: 'zh-Hans.json' },
  { name: '简体中文（中国大陆）', code: 'zh-Hans-CN', language: 'zh-Hans-CN', file: 'zh-Hans-CN.json' },
],
defaultLocale: 'zh-Hant-TW',
```

ja-JP / ko-KR 的註解區塊維持註解,但同步補上 `language` 欄位格式以便未來啟用。

### `i18n/i18n.config.ts` — fallback 鏈

```ts
export default defineI18nConfig(() => ({
  fallbackLocale: {
    'zh-Hant-TW': ['zh-Hant'],
    'zh-Hans-CN': ['zh-Hans'],
    'zh': ['zh-Hant'],
    'en': ['en-US'],
    'default': ['zh-Hant-TW'],
  },
  globalInjection: true,
  legacy: false,
}))
```

- `zh-Hant-TW` 缺 key → 先查 `zh-Hant` → 再查 `default`(`zh-Hant-TW`,即終止)。
- `zh-Hans-CN` 缺 key → 先查 `zh-Hans` → 再查 `default`。
- @nuxtjs/i18n lazy 模式會依 fallback 鏈預載對應語系檔,SSR/CSR 行為一致。

### 相容性注意事項

- `strategy: 'no_prefix'` + `detectBrowserLanguage`:瀏覽器送出 `zh-TW` 時,
  @nuxtjs/i18n 的比對會先嘗試完整比對、再以語言前綴比對;比對不到時落回
  `defaultLocale: 'zh-Hant-TW'`,行為安全。
- cookie `i18n_redirected` 舊值可能為 `zh-TW`(已不在 locale 清單),模組會忽略無效值並回落 defaultLocale。
- `app/composables/useLocale.ts` 已支援 CLDR 格式輸入(自帶 script 直接保留),無需修改。

## Impact Files

| 檔案 | 動作 |
| :--- | :--- |
| `i18n/locales/zh-TW.json` | `git mv` → `zh-Hant.json` |
| `i18n/locales/zh-Hant-TW.json` | 新增(區域覆寫範例) |
| `i18n/locales/zh-Hans.json` | 新增(簡體基底) |
| `i18n/locales/zh-Hans-CN.json` | 新增(區域覆寫範例) |
| `nuxt.config.ts` | locales 清單、defaultLocale 改為 CLDR 代碼 |
| `i18n/i18n.config.ts` | fallbackLocale 改為新 fallback 鏈 |
| `.agents/project/project.md` | 語系描述 `zh-TW` → `zh-Hant-TW` 等 |
| `.agents/project/wiki/index.md` | 技術棧表與圖中的語系描述更新 |

## Verification

1. `pnpm nuxt prepare .playground` 無警告。
2. 啟動 playground,確認:
   - 預設語系為 `zh-Hant-TW`,`login` 等 key 正常顯示。
   - `zh-Hant-TW` 未覆寫的 key(如 `HelloWorld`)由 `zh-Hant` fallback 補上、無 missing key 警告。
   - 切換 `zh-Hans-CN` 顯示簡體且 fallback 至 `zh-Hans` 正常。

## Code Style

實作將遵循 `kn:project:code-style:nuxt` 代碼規範。

## Git Completion Policy

- After user-approved commits, completion will run `git rebase main` and update the remote work branch with `git push --force-with-lease`.
- PR/archive order: Archive automatically triggered on PR request.

## References

- [vue-i18n Fallbacking](https://vue-i18n.intlify.dev/guide/essentials/fallback.html)
- [@nuxtjs/i18n locales 設定](https://i18n.nuxtjs.org/docs/api/options#locales)
- 相關 Wiki:`.agents/project/wiki/features/locale.md`(useLocale / CLDR 對照)

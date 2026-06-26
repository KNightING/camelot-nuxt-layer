<!-- REMINDER: Relative Paths Only! No file:///c:/... -->
# Plan: 2606261225 - useLocale 補完 cldr 與 l10n

- Created: 2026-06-26
- Branch: feature/2606261225-use-locale-cldr-l10n
- Status: Planning
- Completed: [Wait for Finish]

## Goals
補完 `app/composables/useLocale.ts`,讓單一 locale 字串(**輸入可為 bcp47 或 cldr 格式**)可正規化為三種國際化格式表示:

1. **`bcp47`** — 正規化 `_`→`-` 後**移除 script 子標籤**(保留 region),如 `zh-Hant-TW`/`zh_Hant_TW` → `zh-TW`。只要 locale 存在必有值。
2. **`cldr`** — 僅針對「需要補 script 的常見語言」確保帶有 script 子標籤,**一律使用 `-` 連接**;**已含 script 則保留**。非清單內語言回 `undefined`。
3. **`l10n`** — fallback 鏈 `cldr ?? bcp47 ?? localeValue`。

## 背景與決策(來自使用者確認)
- cldr **不做全語言**,只針對註解列出的常見語言:中文 `zh`、塞爾維亞 `sr`、烏茲別克 `uz`、亞塞拜然 `az`、蒙古 `mn`、庫德 `ku`。
- cldr 連接符使用 **`-`**(原本錯誤地把 `-` 換成 `_`,需修正)。
- **(Iteration 追加)輸入格式不限**:可餵 bcp47 或 cldr,兩者輸出皆需正確 → `cldr`/`bcp47` 皆**直接從原始 locale 推導**,`bcp47` 不再是 `cldr` 的輸入來源(否則反推 bcp47 會弄丟既有 script)。
- **(Iteration 追加)bcp47 = 不帶 script 的形式**:可由 cldr 反推。
- **(Iteration 追加)簡體中文 region 也要細分**:zh 對照表明列 `CN/SG/MY → Hans`,不只靠 default。

## Architecture / 實作設計(v3:flat 對照表)

### 共用解析
- `canonical` = 原始 locale `_`→`-`(用 `/_/g`,修正原 `.replace` 只換首個的 bug)後做 BCP47 casing 標準化:lang 小寫、script Title、region 大寫。`bcp47` 與 `cldr` 皆基於此。
- `isScriptSubtag`:`^[A-Za-z]{4}$`(script 位於 index ≥ 1;語言碼 2–3 碼不誤判,variant 為 5–8 碼或數字開頭亦不誤判)。
- `isRegionSubtag`:`^([A-Za-z]{2}|\d{3})$`。

### CLDR(直接查表)
1. `canonical` 為 undefined → undefined。
2. **若已自帶 script 子標籤**(如 `zh-Hant-TW`、`zh-Hant`)→ 直接回 `canonical`(視為已是 cldr,保留)。
3. 否則回 `CLDR_LOCALE_MAP[canonical] ?? undefined`。

### bcp47(由 cldr 反推、去 script)
1. `tag = cldr ?? canonical`;undefined → undefined。
2. 保留 index 0,對 `slice(1)` 濾掉 `isScriptSubtag` 者,`join('-')`。
- 因此 `zh-TW` → cldr `zh-Hant-TW` → bcp47 `zh-TW`;`en-US`(無 cldr)→ `en-US`。

### CLDR_LOCALE_MAP(僅帶 region 的 key)
- **決策(Iteration)**:移除所有「裸語言碼」key(`zh`/`sr`/`uz`…),只保留帶 region 者。理由:裸語言碼的預設 region 偏武斷,且與「非清單語言裸碼不轉換」不對稱;移除後裸碼一律不擴展(`zh`/`sr` 與 `en` 行為一致)。
- 涵蓋語言:中文 `zh`、塞爾維亞 `sr`、烏茲別克 `uz`、亞塞拜然 `az`、哈薩克 `kk`、蒙古 `mn`、庫德 `ku`、旁遮普 `pa`、信德 `sd`、塔吉克 `tg`、韃靼 `tt`。值為完整 `lang-Script-Region`:
- `zh-CN`/`zh-SG`/`zh-MY` → `zh-Hans-*`;`zh-TW`/`zh-HK`/`zh-MO` → `zh-Hant-*`
- `sr-RS`→`sr-Cyrl-RS`、`sr-ME`→`sr-Latn-ME`、`sr-BA`→`sr-Cyrl-BA`
- `uz-UZ`→`uz-Latn-UZ`、`uz-AF`→`uz-Arab-AF`;`az-AZ`→`az-Latn-AZ`、`az-IR`→`az-Arab-IR`
- `mn-MN`→`mn-Cyrl-MN`、`mn-CN`→`mn-Mong-CN`;`ku-IQ`→`ku-Arab-IQ`、`ku-TR`→`ku-Latn-TR`
- `pa-IN`→`pa-Guru-IN`、`pa-PK`→`pa-Arab-PK`;`sd-PK`→`sd-Arab-PK`、`sd-IN`→`sd-Deva-IN`
- `kk-KZ`→`kk-Cyrl-KZ`;`tg-TJ`→`tg-Cyrl-TJ`;`tt-RU`→`tt-Cyrl-RU`

範例結果(輸入 bcp47 或 cldr 皆可):
- `zh-TW` / `zh-Hant-TW` / `zh_Hant_TW` → bcp47 `zh-TW`、cldr `zh-Hant-TW`、l10n `zh-Hant-TW`
- `zh`(裸碼) → bcp47 `zh`、cldr `undefined`、l10n `zh`
- `zh-Hant`(僅 script) → bcp47 `zh`、cldr `zh-Hant`
- `en-US` → bcp47 `en-US`、cldr `undefined`、l10n `en-US`

### l10n
```ts
const l10n = computed(() => cldr.value ?? bcp47.value ?? currentLocale.value)
```

## 代碼規範遵循 (kn:project:code-style:nuxt)
- 遵守 Auto-Imports 禁令:不手動 import `computed`/`toValue`/`MaybeRefOrGetter`。
- Guard Clauses / 提前回傳:cldr 解析以 early return 處理非命中情境。
- script 對照表為內聚 const(`Record<string, ...>`),維持與既有 composables 一致的就地風格;專案目前無 `app/models`,不為單一內部查表新建型別層。

## Impact Files
- `app/composables/useLocale.ts`(修改 `cldr`,實作 `l10n`)

## Git Completion Policy
- 經核准的 Commit 後,完成階段將執行 `git rebase main` 並以 `git push --force-with-lease` 更新遠端工作分支(重寫遠端歷史,lease 防止覆蓋未預期之新提交)。
- PR/歸檔順序:PR 請求時自動觸發歸檔。

## References
- `app/composables/useLocale.ts` 內既有 JSDoc 註解(bcp47 / cldr / l10n 定義)

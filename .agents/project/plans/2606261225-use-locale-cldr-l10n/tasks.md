# Tasks for 2606261225

- [x] Analyze code（確認 bcp47/cldr/l10n 現況與意圖）
- [x] 切換/建立分支 feature/2606261225-use-locale-cldr-l10n

## Iteration v3（flat 對照表 / 雙向輸入 / bcp47 反推）
- [x] `CLDR_LOCALE_MAP` flat 對照表（zh/sr/uz/az/kk/mn/ku/pa/sd/tg/tt）
- [x] `canonical`：`_`→`-`（/_/g）+ BCP47 casing 標準化
- [x] `cldr`：自帶 script 保留，否則查表，沒命中 undefined
- [x] `bcp47`：由 `cldr ?? canonical` 反推、移除 script
- [x] `l10n`：`cldr ?? bcp47 ?? currentLocale`
- [x] 決策：移除裸語言碼 key（zh/sr/uz…），裸碼一律不擴展（與 en 一致）
- [x] 驗證：裸碼/帶 region/雙向輸入/大小寫 案例全數正確 + ESLint exit 0
- [ ] 等待 Commit 核准

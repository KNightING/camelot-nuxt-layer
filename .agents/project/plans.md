# Current Plans

| Plan | Status | Affected Components | Summary |
| :--- | :--- | :--- | :--- |
| 2606261225-use-locale-cldr-l10n | Planning | app/composables/useLocale.ts | 補完 useLocale：重寫 cldr（常見語言 script 擴展、用 `-`、含 guard）並實作 l10n fallback 鏈 `cldr ?? bcp47 ?? localeValue` |

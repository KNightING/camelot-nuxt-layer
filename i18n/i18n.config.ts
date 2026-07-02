export default defineI18nConfig(() => ({
  // Layer 只保證語言層級終點存在；區域語系（zh-Hant-TW 等）由 vue-i18n
  // 隱含階層 fallback（zh-Hant-TW → zh-Hant → zh）落回基底，完整範例見 .playground。
  fallbackLocale: {
    'en-US': ['en'],
    'default': ['zh'],
  },
  globalInjection: true,
  legacy: false,
}))

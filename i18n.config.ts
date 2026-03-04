export default defineI18nConfig(() => ({
  fallbackLocale: {
    'en': ['en-US'],
    'zh': ['zh-TW'],
    'zh-hans': ['zh-TW'],
    'default': ['zh-TW'],
  },
  globalInjection: true,
  legacy: false,
}))

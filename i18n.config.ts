export default defineI18nConfig(() => ({
  fallbackLocale: {
    'en': ['en-us'],
    'zh-tw': ['en-us'],
    'zh-hans': ['zh-tw'],
    'default': ['zh-tw'],
  },
  globalInjection: true,
  legacy: false,
}))

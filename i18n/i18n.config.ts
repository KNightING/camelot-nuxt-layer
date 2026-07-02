export default defineI18nConfig(() => ({
  // 區域語系缺 key 時先退回繁／簡通用基底（zh-Hant / zh-Hans），最後才落到 default
  fallbackLocale: {
    'zh-Hant-TW': ['zh-Hant'],
    'zh-Hant-HK': ['zh-Hant'],
    'zh-Hant-MO': ['zh-Hant'],
    'zh-Hans-CN': ['zh-Hans'],
    'zh-Hans-SG': ['zh-Hans'],
    'zh-Hans-MY': ['zh-Hans'],
    'zh': ['zh-Hant'],
    'en': ['en-US'],
    'default': ['zh-Hant-TW'],
  },
  globalInjection: true,
  legacy: false,
}))

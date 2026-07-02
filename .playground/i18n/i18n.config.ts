export default defineI18nConfig(() => ({
  // 區域語系缺 key 時先退回繁／簡通用基底（zh-Hant / zh-Hans），最終落到 layer 的 zh
  fallbackLocale: {
    'zh-Hant-TW': ['zh-Hant', 'zh'],
    'zh-Hant-HK': ['zh-Hant', 'zh'],
    'zh-Hant-MO': ['zh-Hant', 'zh'],
    'zh-Hant': ['zh'],
    'zh-Hans-CN': ['zh-Hans', 'zh'],
    'zh-Hans-SG': ['zh-Hans', 'zh'],
    'zh-Hans-MY': ['zh-Hans', 'zh'],
    'zh-Hans': ['zh'],
    'en-US': ['en'],
    'default': ['zh-Hant-TW'],
  },
}))

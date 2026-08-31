export default defineI18nConfig(() => ({
  // 區域語系缺 key 時退回繁／簡通用基底（zh-Hant / zh-Hans）。
  // 不再指向 'zh' / 'en'：本 app 未把它們登記為 locale，那樣的鏈在執行期不成立。
  fallbackLocale: {
    'zh-Hant-TW': ['zh-Hant'],
    'zh-Hant-HK': ['zh-Hant'],
    'zh-Hant-MO': ['zh-Hant'],
    'zh-Hans-CN': ['zh-Hans'],
    'zh-Hans-SG': ['zh-Hans'],
    'zh-Hans-MY': ['zh-Hans'],
    'default': ['zh-Hant-TW'],
  },
}))

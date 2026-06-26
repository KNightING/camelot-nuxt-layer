/**
 * 需要補上 script 子標籤的常見語言之完整 CLDR 對照表（locale → lang-Script-Region）。
 * 未列於此表、且輸入未自帶 script 的語言，cldr 會回傳 undefined，交由 l10n 退回 bcp47。
 */
const CLDR_LOCALE_MAP: Record<string, string> = {
  // ---------- Chinese ----------
  'zh-CN': 'zh-Hans-CN',
  'zh-SG': 'zh-Hans-SG',
  'zh-MY': 'zh-Hans-MY',
  'zh-TW': 'zh-Hant-TW',
  'zh-HK': 'zh-Hant-HK',
  'zh-MO': 'zh-Hant-MO',

  // ---------- Serbian ----------
  'sr-RS': 'sr-Cyrl-RS',
  'sr-ME': 'sr-Latn-ME',
  'sr-BA': 'sr-Cyrl-BA',

  // ---------- Uzbek ----------
  'uz-UZ': 'uz-Latn-UZ',
  'uz-AF': 'uz-Arab-AF',

  // ---------- Azerbaijani ----------
  'az-AZ': 'az-Latn-AZ',
  'az-IR': 'az-Arab-IR',

  // ---------- Kazakh ----------
  'kk-KZ': 'kk-Cyrl-KZ',

  // ---------- Mongolian ----------
  'mn-MN': 'mn-Cyrl-MN',
  'mn-CN': 'mn-Mong-CN',

  // ---------- Kurdish ----------
  'ku-IQ': 'ku-Arab-IQ',
  'ku-TR': 'ku-Latn-TR',

  // ---------- Punjabi ----------
  'pa-IN': 'pa-Guru-IN',
  'pa-PK': 'pa-Arab-PK',

  // ---------- Sindhi ----------
  'sd-PK': 'sd-Arab-PK',
  'sd-IN': 'sd-Deva-IN',

  // ---------- Tajik ----------
  'tg-TJ': 'tg-Cyrl-TJ',

  // ---------- Tatar ----------
  'tt-RU': 'tt-Cyrl-RU',
}

/** 是否為 script 子標籤格式（4 個英文字母，如 Hant、Latn）。 */
const isScriptSubtag = (subtag: string) => /^[A-Za-z]{4}$/.test(subtag)

/** 是否為 region 子標籤格式（2 個英文字母或 3 個數字，如 TW、001）。 */
const isRegionSubtag = (subtag: string) => /^([A-Za-z]{2}|\d{3})$/.test(subtag)

/**
 * 將單一 subtag 依 BCP 47 慣例標準化大小寫：
 * 語言碼（index 0）小寫、script 首字大寫其餘小寫、region 大寫，其餘小寫。
 */
const canonicalizeSubtag = (subtag: string, index: number) => {
  if (index === 0) {
    return subtag.toLowerCase()
  }
  if (isScriptSubtag(subtag)) {
    return subtag.charAt(0).toUpperCase() + subtag.slice(1).toLowerCase()
  }
  if (isRegionSubtag(subtag)) {
    return subtag.toUpperCase()
  }
  return subtag.toLowerCase()
}

export const useLocale = (
  locale: MaybeRefOrGetter<string | undefined>,
) => {
  const currentLocale = computed(() => toValue(locale))

  /**
   * 將原始 locale 以 "-" 連接並標準化大小寫，作為 bcp47 / cldr 的共同基礎。
   * 輸入可為 bcp47（zh-TW）或 cldr（zh-Hant-TW、zh_Hant_TW）格式。
   */
  const canonical = computed(() => {
    const localeValue = currentLocale.value
    if (!localeValue) {
      return undefined
    }
    return localeValue.replace(/_/g, '-').split('-').map(canonicalizeSubtag).join('-')
  })

  /**
   * cldr: CLDR 語言標籤格式，通常用於國際化資料庫和工具，例如 "zh-Hant-TW"。
   * 為缺少 script 的常見語言補上完整 "lang-Script-Region"，並一律使用 "-" 連接。
   *
   * 只有部分語言需要（中文, 塞爾維亞文, 烏茲別克文, 亞塞拜然文, 哈薩克文, 蒙古文,
   * 庫德文, 旁遮普文, 信德文, 塔吉克文, 韃靼文）。
   * 輸入已自帶 script 者直接保留；不在對照表內者回傳 undefined。
   */
  const cldr = computed(() => {
    const tag = canonical.value
    if (!tag) {
      return undefined
    }

    // 已自帶 script 子標籤（如 zh-Hant-TW、zh-Hant）視為已是 cldr，直接保留。
    if (tag.split('-').slice(1).some(isScriptSubtag)) {
      return tag
    }

    return CLDR_LOCALE_MAP[tag] ?? undefined
  })

  /**
   * bcp47: BCP 47 語言標籤格式，通常用於網頁和應用程式的國際化，例如 "en-US"、"zh-TW"。
   * 由 cldr（若有）反推：移除 script 子標籤、保留 region。
   */
  const bcp47 = computed(() => {
    const tag = cldr.value ?? canonical.value
    if (!tag) {
      return undefined
    }

    const [lang = '', ...rest] = tag.split('-')
    return [lang, ...rest.filter(subtag => !isScriptSubtag(subtag))].join('-')
  })

  /**
   * l10n: L10n 語言標籤格式，通常用於本地化資料庫和工具，例如 "zh-Hant-TW"。
   *
   * 優先cldr, 若cldr不存在則使用bcp47, 若bcp47不存在則使用localeValue
   */
  const l10n = computed(() => cldr.value ?? bcp47.value ?? currentLocale.value)

  return {
    bcp47,
    cldr,
    l10n,
  }
}

export type AutoLinkOptions = {
  disabledUrl?: boolean
  disabledEmail?: boolean
  disabledPhone?: boolean
}

type LinkRule = {
  /** 正則片段（不含旗標），會併入同一條正則一次掃描 */
  source: string
  /** 回傳連結的 href；回傳 undefined 表示這段不轉連結 */
  toHref: (match: string) => string | undefined
  /** 是否在新分頁開啟 */
  external?: boolean
}

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#39;',
}

const escapeHtml = (text: string) => text.replace(/[&<>"']/g, char => HTML_ESCAPES[char] ?? char)

// 電話號碼至少 7 碼才轉連結，避免年份等短數字被誤判
const MIN_PHONE_DIGITS = 7

// URL：http(s)://、ftp://、file:// 或 www. 開頭
const urlRule: LinkRule = {
  source: String.raw`\b(?:(?:https?|ftp|file):\/\/|www\.)[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]`,
  toHref: match => (/^www\./i.test(match) ? `http://${match}` : match),
  external: true,
}

const emailRule: LinkRule = {
  source: String.raw`\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b`,
  toHref: match => `mailto:${match}`,
}

// 常見的數字與分隔符號組合，如 123-456-7890、(123) 456-7890、+886 9xx xxx xxx
const phoneRule: LinkRule = {
  source: String.raw`\b(?:\+?\d{1,4}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}\b`,
  toHref: (match) => {
    const phoneNumber = match.replace(/[-\s().]/g, '')
    return phoneNumber.replace('+', '').length < MIN_PHONE_DIGITS ? undefined : `tel:${phoneNumber}`
  },
}

const toAnchor = (rule: LinkRule, match: string) => {
  const href = rule.toHref(match)
  if (!href) {
    return escapeHtml(match)
  }
  const target = rule.external ? ' target="_blank" rel="noopener noreferrer"' : ''
  return `<a href="${escapeHtml(href)}"${target}>${escapeHtml(match)}</a>`
}

/**
 * 把純文字中的網址、email、電話轉成連結，回傳可放進 v-html 的 HTML。
 * 所有規則合成一條正則在原始文字上掃描一次：已轉成連結的片段不會再被其他規則改寫，
 * 非連結的文字一律跳脫 HTML。
 */
export const useAutoLink = (textRef: MaybeRefOrGetter<string | undefined>, options?: MaybeRef<AutoLinkOptions>) => computed(() => {
  const text = toValue(textRef)

  if (typeof text === 'undefined') {
    return ''
  }

  const {
    disabledUrl = false,
    disabledEmail = false,
    disabledPhone = false,
  } = toValue(options) ?? {}

  // 順序即優先序：同一位置同時符合時，網址優先於 email，email 優先於電話
  const rules = [
    disabledUrl ? undefined : urlRule,
    disabledEmail ? undefined : emailRule,
    disabledPhone ? undefined : phoneRule,
  ].filter((rule): rule is LinkRule => rule !== undefined)

  if (rules.length === 0) {
    return escapeHtml(text)
  }

  const pattern = new RegExp(rules.map(rule => `(${rule.source})`).join('|'), 'gi')

  let html = ''
  let lastIndex = 0
  for (const match of text.matchAll(pattern)) {
    const ruleIndex = match.slice(1).findIndex(group => group !== undefined)
    const rule = rules[ruleIndex]
    if (!rule) continue
    html += escapeHtml(text.slice(lastIndex, match.index)) + toAnchor(rule, match[0])
    lastIndex = match.index + match[0].length
  }

  return html + escapeHtml(text.slice(lastIndex))
})

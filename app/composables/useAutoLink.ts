// URL Regex (涵蓋 http(s)://, www. 開頭，及簡單的 domain.tld)
// 這裡使用一個稍微簡化的版本，更複雜的 URL 需要更複雜的 Regex
const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\\/%?=~_|!:,.;]*[-A-Z0-9+&@#\\/%=~_|]\b)|(\bwww\.[-A-Z0-9+&@#\\/%?=~_|!:,.;]*[-A-Z0-9+&@#\\/%=~_|]\b)/ig

// 替換 URL
const replaceUrl = (target: string) => {
  return target.replaceAll(urlRegex, (match) => {
    let href = match
    // 如果是 www. 開頭但沒有協議，手動添加 http://
    if (!/^https?:\/\//i.test(match) && match.toLowerCase().startsWith('www.')) {
      href = 'http://' + match
    }
    // 使用 rel="noopener noreferrer" 增加安全性，target="_blank" 在新分頁開啟
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${match}</a>`
  })
}

// Email Regex (標準格式)
const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/ig

// 替換 Email
const replaceEmail = (target: string) => {
  return target.replaceAll(emailRegex, (match) => {
    return `<a href="mailto:${match}">${match}</a>`
  })
}

// Phone Regex (一個簡單的範例，匹配常見的數字和分隔符號組合，可能不夠嚴謹)
// 偵測電話號碼的 Regex 會非常複雜，需要根據目標地區的格式調整
// 這個範例匹配如 123-456-7890, (123) 456-7890, +886 9xx xxx xxx 等簡單格式
const phoneRegex = /\b(?:\+?\d{1,4}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}\b/g

// 替換 Phone (需要將匹配到的電話號碼轉換為 tel: URI 格式)
const replacePhone = (target: string) => {
  return target.replaceAll(phoneRegex, (match) => {
  // 清理電話號碼，移除空格和橫線，只保留數字和開頭的 '+'
    const phoneNumber = match.replace(/[-\s()]/g, '')
    // 避免匹配到純數字（如年份）或太短的數字串被誤判為電話
    // 可以加一些邏輯判斷，這裡僅作簡單清理
    if (phoneNumber.length < 7) { // 假設電話號碼至少7位 (簡化判斷)
      return match // 不處理短數字
    }
    return `<a href="tel:${phoneNumber}">${match}</a>`
  })
}

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

  let target = text

  // 替換 URL
  if (!disabledUrl) {
    target = replaceUrl(target)
  }
  // 替換 Email
  if (!disabledEmail) {
    target = replaceEmail(target)
  }
  // 替換 Phone
  if (!disabledPhone) {
    target = replacePhone(target)
  }
  // 返回處理後的文本
  return target
})

export type AutoLinkOptions = {
  disabledUrl?: boolean
  disabledEmail?: boolean
  disabledPhone?: boolean
}
